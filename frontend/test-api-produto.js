// Teste da API de produtos para verificar estrutura dos dados
const API_BASE_URL = 'http://localhost:5001/api';

async function testarProduto() {
  try {
    console.log('🔍 Testando busca de produto por ID...');
    
    const response = await fetch(`${API_BASE_URL}/produtos/1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Resposta da API:', JSON.stringify(data, null, 2));
      
      // Verificar se é dados.produto ou apenas dados
      if (data.sucesso) {
        if (data.dados.produto) {
          console.log('📦 Estrutura produto:', JSON.stringify(data.dados.produto, null, 2));
          console.log('💰 Preço atual:', data.dados.produto.preco_atual);
          console.log('💰 currentPrice:', data.dados.produto.currentPrice);
        } else {
          console.log('📦 Estrutura dados direta:', JSON.stringify(data.dados, null, 2));
        }
      }
    } else {
      console.error('❌ Erro na resposta:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Texto do erro:', errorText);
    }
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testarProduto();
