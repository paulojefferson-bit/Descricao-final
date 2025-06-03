import React, { useEffect } from 'react';
import { useCarrinho } from '../context/ContextoCarrinho';

const TesteCarrinho = () => {
  const { carrinho, obterCarrinho } = useCarrinho();
  
  useEffect(() => {
    console.log('🧪 Componente de teste montado');
    console.log('🛒 Carrinho atual:', carrinho);
    console.log('📊 Total de itens:', carrinho.length);
  }, [carrinho]);
  
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h2>🧪 Teste do Carrinho</h2>
      <p><strong>Total de itens:</strong> {carrinho.length}</p>
      <p><strong>Dados do carrinho:</strong></p>
      <pre style={{ background: 'white', padding: '10px', maxHeight: '300px', overflow: 'auto' }}>
        {JSON.stringify(carrinho, null, 2)}
      </pre>
    </div>
  );
};

export default TesteCarrinho;
