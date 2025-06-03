import React from 'react';
import { useCarrinhoSimples } from '../context/ContextoCarrinhoSimples';

const TesteCarrinhoSimples = () => {
  const { carrinho, carregando, erro, recarregar } = useCarrinhoSimples();

  if (carregando) {
    return (
      <div style={{ padding: '20px', background: '#fff3cd', border: '2px solid #ffeaa7' }}>
        <h3>🔄 Carregando carrinho...</h3>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={{ padding: '20px', background: '#f8d7da', border: '2px solid #f5c6cb' }}>
        <h3>❌ Erro: {erro}</h3>
        <button onClick={recarregar}>🔄 Recarregar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#d4edda', border: '2px solid #c3e6cb' }}>
      <h3>✅ Carrinho Carregado com Sucesso!</h3>
      <p><strong>Total de itens:</strong> {carrinho.length}</p>
      {carrinho.map((item, index) => (
        <div key={index} style={{ background: 'white', padding: '10px', margin: '5px 0', borderRadius: '5px' }}>
          <strong>{item.name}</strong> - {item.brand} - Qtd: {item.quantidade} - R$ {item.currentPrice}
        </div>
      ))}
    </div>
  );
};

export default TesteCarrinhoSimples;
