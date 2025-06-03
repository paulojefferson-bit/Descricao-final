// Hooks personalizados para integração com a API
import { useState, useEffect, useCallback } from 'react';
import { 
  authService, 
  produtosService, 
  carrinhoService, 
  pedidosService, 
  promocoesService,
  utilService
} from '../services/integracaoService';

// Hook para autenticação
export const useAuth = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = authService.isLoggedIn();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(isLoggedIn);
      setUsuario(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, senha) => {
    try {
      setLoading(true);
      const response = await authService.login(email, senha);
      
      if (response.sucesso) {
        setIsAuthenticated(true);
        setUsuario(response.usuario);
      }
      
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (dadosUsuario) => {
    try {
      setLoading(true);
      return await authService.register(dadosUsuario);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUsuario(null);
  };

  return {
    usuario,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  };
};

// Hook para produtos
export const useProdutos = (filtros = {}) => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarProdutos = useCallback(async (novosFiltros = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await produtosService.buscarTodos({
        ...filtros,
        ...novosFiltros
      });
      
      if (response.sucesso) {
        setProdutos(response.dados);
      } else {
        setError(response.mensagem);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  const buscarProduto = async (id) => {
    try {
      const response = await produtosService.buscarPorId(id);
      return response.sucesso ? response.dados : null;
    } catch (err) {
      console.error('Erro ao buscar produto:', err);
      return null;
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  return {
    produtos,
    loading,
    error,
    buscarProdutos,
    buscarProduto,
    recarregar: buscarProdutos
  };
};

// Hook para carrinho
export const useCarrinho = () => {
  const [carrinho, setCarrinho] = useState(null);
  const [itens, setItens] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarCarrinho = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await carrinhoService.buscarCarrinho();
      
      if (response.sucesso) {
        setCarrinho(response.dados);
        setItens(response.dados.itens || []);
        setTotal(response.dados.total || 0);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar carrinho:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  const adicionarItem = async (produtoId, quantidade = 1, tamanho = null) => {
    try {
      setLoading(true);
      
      // Verificar autenticação
      const isAuthenticated = api.isAuthenticated();
      
      if (isAuthenticated) {
        // Se autenticado, usar API
        const response = await carrinhoService.adicionarItem(produtoId, quantidade, tamanho);
        
        if (response.sucesso) {
          await buscarCarrinho(); // Recarregar carrinho
          return response;
        } else {
          setError(response.mensagem);
          return response;
        }
      } else {
        // Se não autenticado, usar localStorage
        // Obter carrinho atual
        const carrinhoLocalStr = localStorage.getItem('carrinho');
        const carrinhoLocal = carrinhoLocalStr ? JSON.parse(carrinhoLocalStr) : [];
        
        // Buscar produto pelo ID
        const produtosResponse = await produtosService.buscarPorId(produtoId);
        if (!produtosResponse.sucesso) {
          throw new Error('Produto não encontrado');
        }
        
        const produto = produtosResponse.dados;
        
        // Verificar se o produto já está no carrinho
        const itemExistente = carrinhoLocal.find(item => item.produto_id === produtoId);
        
        if (itemExistente) {
          // Atualizar quantidade
          itemExistente.quantidade += quantidade;
        } else {
          // Adicionar novo item
          carrinhoLocal.push({
            produto_id: produtoId,
            quantidade,
            tamanho,
            preco: produto.preco_atual,
            nome: produto.nome,
            imagem: produto.imagem
          });
        }
        
        // Salvar no localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinhoLocal));
        
        // Simular resposta da API
        return {
          sucesso: true,
          dados: {
            mensagem: 'Item adicionado ao carrinho local'
          }
        };
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarItem = async (itemId, quantidade) => {
    try {
      setLoading(true);
      const response = await carrinhoService.atualizarItem(itemId, quantidade);
      
      if (response.sucesso) {
        await buscarCarrinho();
      } else {
        setError(response.mensagem);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removerItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await carrinhoService.removerItem(itemId);
      
      if (response.sucesso) {
        await buscarCarrinho();
      } else {
        setError(response.mensagem);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const limparCarrinho = async () => {
    try {
      setLoading(true);
      const response = await carrinhoService.limparCarrinho();
      
      if (response.sucesso) {
        setCarrinho(null);
        setItens([]);
        setTotal(0);
      } else {
        setError(response.mensagem);
      }
      
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCarrinho();
  }, [buscarCarrinho]);

  return {
    carrinho,
    itens,
    total,
    loading,
    error,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho,
    recarregar: buscarCarrinho
  };
};

// Hook para pedidos
export const usePedidos = (filtros = {}) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPedidos = useCallback(async (novosFiltros = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pedidosService.buscarPedidos({
        ...filtros,
        ...novosFiltros
      });
      
      if (response.sucesso) {
        setPedidos(response.dados);
      } else {
        setError(response.mensagem);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  const buscarPedido = async (pedidoId) => {
    try {
      const response = await pedidosService.buscarPedido(pedidoId);
      return response.sucesso ? response.dados : null;
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      return null;
    }
  };

  const criarPedido = async (dadosPedido) => {
    try {
      setLoading(true);
      const response = await pedidosService.criarPedido(dadosPedido);
      
      if (response.sucesso) {
        await buscarPedidos(); // Recarregar lista
      }
      
      return response;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const finalizarPedido = async (dadosCheckout) => {
    try {
      setLoading(true);
      return await pedidosService.finalizarPedido(dadosCheckout);
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarPedidos();
  }, [buscarPedidos]);

  return {
    pedidos,
    loading,
    error,
    buscarPedidos,
    buscarPedido,
    criarPedido,
    finalizarPedido,
    recarregar: buscarPedidos
  };
};

// Hook para promoções
export const usePromocoes = () => {
  const [promocoes, setPromocoes] = useState([]);
  const [promocaoRelampago, setPromocaoRelampago] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPromocoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await promocoesService.buscarAtivas();
      
      if (response.sucesso) {
        setPromocoes(response.dados);
      } else {
        setError(response.mensagem);
      }
    } catch (err) {
      setError(err.message);
      console.error('Erro ao buscar promoções:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const verificarPromocaoRelampago = useCallback(async () => {
    try {
      const response = await promocoesService.verificarPromocaoRelampago();
      
      if (response.sucesso) {
        setPromocaoRelampago(response.dados);
      }
    } catch (err) {
      console.error('Erro ao verificar promoção relâmpago:', err);
    }
  }, []);

  const aplicarCupom = async (codigo) => {
    try {
      return await promocoesService.aplicarCupom(codigo);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    buscarPromocoes();
    verificarPromocaoRelampago();
  }, [buscarPromocoes, verificarPromocaoRelampago]);

  return {
    promocoes,
    promocaoRelampago,
    loading,
    error,
    buscarPromocoes,
    verificarPromocaoRelampago,
    aplicarCupom
  };
};

// Hook para utilitários
export const useUtils = () => {
  const buscarCep = async (cep) => {
    return await utilService.buscarCep(cep);
  };

  const calcularFrete = async (cep, itens) => {
    return await utilService.calcularFrete(cep, itens);
  };

  const validarEmail = (email) => {
    return utilService.validarEmail(email);
  };

  const validarCPF = (cpf) => {
    return utilService.validarCPF(cpf);
  };

  const formatarPreco = (valor) => {
    return utilService.formatarPreco(valor);
  };

  const formatarData = (data) => {
    return utilService.formatarData(data);
  };

  return {
    buscarCep,
    calcularFrete,
    validarEmail,
    validarCPF,
    formatarPreco,
    formatarData
  };
};

// Hook para estado global de loading
export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const showLoading = (message = 'Carregando...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setLoadingMessage('');
  };

  return {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading
  };
};
