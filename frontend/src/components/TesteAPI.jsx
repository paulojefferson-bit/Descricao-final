import React, { useState } from 'react';
import { carrinhoService } from '../services';

const TesteAPI = () => {
  const [resultado, setResultado] = useState('');
  const [carregando, setCarregando] = useState(false);

  const testarCarrinho = async () => {
    setCarregando(true);
    try {
      console.log('🧪 Testando API do carrinho...');
      const resposta = await carrinhoService.obter();
      console.log('📦 Resposta:', resposta);
      setResultado(JSON.stringify(resposta, null, 2));
    } catch (erro) {
      console.error('❌ Erro:', erro);
      setResultado(`Erro: ${erro.message}`);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#e0e0e0', margin: '20px', border: '2px solid red' }}>
      <h2>🧪 Teste da API do Carrinho</h2>
      <button onClick={testarCarrinho} disabled={carregando}>
        {carregando ? 'Testando...' : 'Testar Carrinho API'}
      </button>
      <pre style={{ background: 'white', padding: '10px', maxHeight: '400px', overflow: 'auto', marginTop: '10px' }}>
        {resultado || 'Clique no botão para testar'}
      </pre>
    </div>
  );
};

export default TesteAPI;
