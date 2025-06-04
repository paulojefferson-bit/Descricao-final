// Script de teste simples para debug
require('dotenv').config();
const conexao = require('./banco/conexao');

async function testarConsultaSimples() {
  try {
    console.log('🔍 Testando consulta simples...');
    
    // Teste 1: Consulta básica sem filtros
    console.log('\n=== TESTE 1: Consulta básica ===');
    const sql1 = 'SELECT * FROM produtos LIMIT 5';
    const result1 = await conexao.executarConsulta(sql1);
    console.log('✅ Resultado:', result1.length, 'produtos encontrados');
    
    // Teste 2: Consulta com filtro de marca
    console.log('\n=== TESTE 2: Filtro por marca ===');
    const sql2 = 'SELECT * FROM produtos WHERE marca = ? LIMIT 5';
    const result2 = await conexao.executarConsulta(sql2, ['nike']);
    console.log('✅ Resultado:', result2.length, 'produtos Nike encontrados');
    
    // Teste 3: Consulta com filtro de estoque
    console.log('\n=== TESTE 3: Filtro por estoque ===');
    const sql3 = 'SELECT * FROM produtos WHERE quantidade_estoque > 0 LIMIT 5';
    const result3 = await conexao.executarConsulta(sql3);
    console.log('✅ Resultado:', result3.length, 'produtos em estoque');
    
    // Teste 4: Combinação que estava falhando
    console.log('\n=== TESTE 4: Filtros combinados ===');
    const sql4 = 'SELECT * FROM produtos WHERE marca = ? AND quantidade_estoque > 0 LIMIT ?';
    const result4 = await conexao.executarConsulta(sql4, ['nike', 5]);
    console.log('✅ Resultado:', result4.length, 'produtos Nike em estoque');
    
    if (result4.length > 0) {
      console.log('📦 Primeiro produto:', {
        id: result4[0].id,
        marca: result4[0].marca,
        nome: result4[0].nome,
        estoque: result4[0].quantidade_estoque
      });
    }
    
  } catch (erro) {
    console.error('❌ Erro no teste:', erro.message);
    console.error('🔍 SQL State:', erro.sqlState);
    console.error('🔍 SQL Message:', erro.sqlMessage);
  }
}

testarConsultaSimples();
