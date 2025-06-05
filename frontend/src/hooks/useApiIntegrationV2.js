// Hooks personalizados aprimorados com sistema de notificações
import { useState, useCallback } from 'react';
import { 
  produtosService, 
  carrinhoService, 
  pedidosService, 
  promocoesService,
  utilService
} from '../services/integracaoService';
import { useNotifications } from '../context/NotificationContext';

// Hook para produtos com notificações
export const useProdutosHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError } = useNotifications();

  const listarProdutos = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produtosService.listar(filtros);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao carregar produtos';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const obterProduto = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produtosService.obter(id);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao carregar produto';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const buscarProdutos = useCallback(async (termo) => {
    try {
      setLoading(true);
      setError(null);
      const response = await produtosService.buscar(termo);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro na busca';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  return {
    listarProdutos,
    obterProduto,
    buscarProdutos,
    loading,
    error
  };
};

// Hook para carrinho com notificações
export const useCarrinhoHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useNotifications();

  const adicionarItem = useCallback(async (produtoId, quantidade = 1, opcoes = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await carrinhoService.adicionar(produtoId, quantidade, opcoes);
      
      if (response.sucesso) {
        showSuccess('Produto adicionado ao carrinho!');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao adicionar produto';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const atualizarQuantidade = useCallback(async (produtoId, quantidade) => {
    try {
      setLoading(true);
      setError(null);
      const response = await carrinhoService.atualizar(produtoId, quantidade);
      
      if (response.sucesso) {
        showSuccess('Quantidade atualizada!');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao atualizar quantidade';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const removerItem = useCallback(async (produtoId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await carrinhoService.remover(produtoId);
      
      if (response.sucesso) {
        showSuccess('Produto removido do carrinho!');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao remover produto';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const limparCarrinho = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await carrinhoService.limpar();
      
      if (response.sucesso) {
        showSuccess('Carrinho limpo!');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao limpar carrinho';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const calcularTotais = useCallback(async () => {
    try {
      setError(null);
      return await carrinhoService.calcularTotais();
    } catch (error) {
      const errorMessage = error.message || 'Erro ao calcular totais';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    }
  }, [showError]);

  return {
    adicionarItem,
    atualizarQuantidade,
    removerItem,
    limparCarrinho,
    calcularTotais,
    loading,
    error
  };
};

// Hook para pedidos com notificações
export const usePedidosHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useNotifications();

  const criarPedido = useCallback(async (dadosPedido) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosService.criar(dadosPedido);
      
      if (response.sucesso) {
        showSuccess('Pedido realizado com sucesso!', 'Sucesso');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao criar pedido';
      setError(errorMessage);
      showError(errorMessage, 'Erro no Pedido');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  const listarPedidos = useCallback(async (filtros = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosService.listar(filtros);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao carregar pedidos';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const obterPedido = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosService.obter(id);
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao carregar pedido';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const cancelarPedido = useCallback(async (id, motivo) => {
    try {
      setLoading(true);
      setError(null);
      const response = await pedidosService.cancelar(id, motivo);
      
      if (response.sucesso) {
        showSuccess('Pedido cancelado com sucesso!');
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao cancelar pedido';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  return {
    criarPedido,
    listarPedidos,
    obterPedido,
    cancelarPedido,
    loading,
    error
  };
};

// Hook para usuário com notificações
export const useUsuarioHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useNotifications();

  const atualizarPerfil = useCallback(async (dadosPerfil) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular endpoint de atualização de perfil
      // Na implementação real, seria: await usuarioService.atualizarPerfil(dadosPerfil);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Perfil atualizado com sucesso!');
      
      return {
        sucesso: true,
        dados: dadosPerfil
      };
    } catch (error) {
      const errorMessage = error.message || 'Erro ao atualizar perfil';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);
  const alterarSenha = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular endpoint de alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Senha alterada com sucesso!');
      
      return {
        sucesso: true
      };
    } catch (error) {
      const errorMessage = error.message || 'Erro ao alterar senha';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  return {
    atualizarPerfil,
    alterarSenha,
    loading,
    error
  };
};

// Hook para promoções com notificações
export const usePromocoesHooks = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useNotifications();

  const listarPromocoes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await promocoesService.listar();
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Erro ao carregar promoções';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const aplicarCupom = useCallback(async (codigo) => {
    try {
      setLoading(true);
      setError(null);
      const response = await promocoesService.aplicarCupom(codigo);
      
      if (response.sucesso) {
        showSuccess(`Cupom "${codigo}" aplicado com sucesso!`);
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.message || 'Cupom inválido';
      setError(errorMessage);
      showError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  return {
    listarPromocoes,
    aplicarCupom,
    loading,
    error
  };
};

// Hook para utilitários (sem notificações por serem síncronos)
export const useUtils = () => {
  return {
    validarEmail: utilService.validarEmail,
    validarCPF: utilService.validarCPF,
    formatarPreco: utilService.formatarPreco,
    formatarData: utilService.formatarData,
    gerarSlug: utilService.gerarSlug
  };
};
