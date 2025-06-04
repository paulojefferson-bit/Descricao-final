// Script para testar a API de produtos via HTTP
const http = require('http');

function testarAPI() {
  console.log('🔍 Testando API de produtos...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/produtos?marcas=nike&apenas_em_estoque=true&limite=15&offset=0',
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        if (res.statusCode === 200) {
          const resultado = JSON.parse(data);
          console.log('✅ API funcionando!');
          console.log('📦 Produtos encontrados:', resultado.produtos?.length || 0);
          if (resultado.produtos && resultado.produtos.length > 0) {
            console.log('🔍 Primeiro produto:', {
              id: resultado.produtos[0].id,
              marca: resultado.produtos[0].marca,
              nome: resultado.produtos[0].nome
            });
          }
        } else {
          console.log('❌ Erro na API:', data);
        }
      } catch (erro) {
        console.log('❌ Erro ao parsear resposta:', erro.message);
        console.log('📝 Resposta bruta:', data);
      }
    });
  });

  req.on('error', (erro) => {
    console.error('❌ Erro na requisição:', erro.message);
  });

  req.on('timeout', () => {
    console.error('❌ Timeout na requisição');
    req.destroy();
  });

  req.end();
}

testarAPI();
