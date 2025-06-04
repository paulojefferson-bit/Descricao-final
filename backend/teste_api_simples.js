// Script para testar a API sem filtros
const http = require('http');

function testarAPISimples() {
  console.log('🔍 Testando API de produtos sem filtros...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/produtos',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        if (res.statusCode === 200) {
          const resultado = JSON.parse(data);
          console.log('✅ API funcionando!');
          console.log('📦 Total de produtos:', resultado.produtos?.length || 0);
          console.log('📊 Paginação:', resultado.paginacao || {});
          
          if (resultado.produtos && resultado.produtos.length > 0) {
            console.log('🔍 Primeiros produtos:');
            resultado.produtos.slice(0, 3).forEach((produto, index) => {
              console.log(`  ${index + 1}. ${produto.marca} - ${produto.nome} (estoque: ${produto.quantidade_estoque})`);
            });
          }
        } else {
          console.log('❌ Erro na API:', data);
        }
      } catch (erro) {
        console.log('❌ Erro ao parsear resposta:', erro.message);
        console.log('📝 Resposta bruta:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (erro) => {
    console.error('❌ Erro na requisição:', erro.message);
  });

  req.end();
}

testarAPISimples();
