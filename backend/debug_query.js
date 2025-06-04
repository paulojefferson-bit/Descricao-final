// Script de teste usando query ao invés de execute
require('dotenv').config();
const conexao = require('./banco/conexao');

async function testarQuery() {
  try {
    console.log('🔍 Testando com query() ao invés de execute()...');
    
    // Testando diretamente no pool
    const pool = conexao.pool;
    
    // Teste com query (sem prepared statement)
    console.log('\n=== TESTE 1: Query simples ===');
    const [result1] = await pool.query('SELECT * FROM produtos LIMIT 5');
    console.log('✅ Resultado:', result1.length, 'produtos encontrados');
    
    // Teste com query e parâmetros
    console.log('\n=== TESTE 2: Query com parâmetros ===');
    const [result2] = await pool.query('SELECT * FROM produtos WHERE marca = ? LIMIT ?', ['nike', 5]);
    console.log('✅ Resultado:', result2.length, 'produtos encontrados');
    
    if (result2.length > 0) {
      console.log('📦 Primeiro produto:', {
        id: result2[0].id,
        marca: result2[0].marca,
        nome: result2[0].nome,
        estoque: result2[0].quantidade_estoque
      });
    }
    
  } catch (erro) {
    console.error('❌ Erro no teste:', erro.message);
    console.error('🔍 Detalhes:', {
      code: erro.code,
      errno: erro.errno,
      sqlState: erro.sqlState
    });
  }
}

testarQuery();
