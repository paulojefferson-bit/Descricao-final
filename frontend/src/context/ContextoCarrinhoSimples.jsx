import React, { createContext, useState, useContext, useEffect } from 'react';
import { carrinhoService } from '../services';

const ContextoCarrinhoSimples = createContext();

export const useCarrinhoSimples = () => useContext(ContextoCarrinhoSimples);

export const ProvedorCarrinhoSimples = ({ children }) => {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const carregarCarrinho = async () => {
      console.log('🛒 [SIMPLES] Iniciando carregamento do carrinho...');
      try {
        setCarregando(true);
        setErro(null);
        
        console.log('🌐 [SIMPLES] Fazendo requisição para API...');
        const resposta = await carrinhoService.obter();
        console.log('📦 [SIMPLES] Resposta recebida:', resposta);
        
        if (resposta.sucesso) {
          console.log('✅ [SIMPLES] Sucesso! Itens:', resposta.dados?.itens?.length || 0);
          const itens = resposta.dados?.itens || [];
          
          const itensMapeados = itens.map(item => ({
            id: item.produto_id,
            itemId: item.id,
            name: item.produto?.nome || 'Produto',
            brand: item.produto?.marca || 'Marca',
            image: item.produto?.imagem || '/tenis_produtos.png',
            currentPrice: parseFloat(item.produto?.preco_atual || item.preco_unitario || 0),
            quantidade: item.quantidade,
            tamanho: item.tamanho,
            cor: item.cor
          }));
          
          console.log('🔄 [SIMPLES] Itens mapeados:', itensMapeados);
          setItensCarrinho(itensMapeados);
        } else {
          console.warn('⚠️ [SIMPLES] API retornou erro:', resposta);
          setErro('Falha ao carregar carrinho');
        }
      } catch (error) {
        console.error('❌ [SIMPLES] Erro ao carregar carrinho:', error);
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    carregarCarrinho();
  }, []);

  const valor = {
    carrinho: itensCarrinho,
    carregando,
    erro,
    recarregar: () => window.location.reload()
  };

  return (
    <ContextoCarrinhoSimples.Provider value={valor}>
      {children}
    </ContextoCarrinhoSimples.Provider>
  );
};

export default ContextoCarrinhoSimples;
