// Script de teste para debug de tipos
require('dotenv').config();
const conexao = require('./banco/conexao');

async function testarTipos() {
  try {
    console.log('🔍 Testando diferentes tipos de parâmetros...');
    
    // Teste 1: Só strings
    console.log('\n=== TESTE 1: Só strings ===');
    const sql1 = 'SELECT * FROM produtos WHERE marca = ? AND categoria = ?';
    const result1 = await conexao.executarConsulta(sql1, ['nike', 'tênis']);
    console.log('✅ Resultado:', result1.length, 'produtos encontrados');
    
    // Teste 2: Só números
    console.log('\n=== TESTE 2: Só números ===');
    const sql2 = 'SELECT * FROM produtos WHERE quantidade_estoque > ? LIMIT ?';
    const result2 = await conexao.executarConsulta(sql2, [0, 5]);
    console.log('✅ Resultado:', result2.length, 'produtos encontrados');
    
    // Teste 3: String + número (que estava falhando)
    console.log('\n=== TESTE 3: String + número ===');
    const sql3 = 'SELECT * FROM produtos WHERE marca = ? LIMIT ?';
    const result3 = await conexao.executarConsulta(sql3, ['nike', 5]);
    console.log('✅ Resultado:', result3.length, 'produtos encontrados');
    
    // Teste 4: Convertendo número para string
    console.log('\n=== TESTE 4: Números como string ===');
    const sql4 = 'SELECT * FROM produtos WHERE marca = ? LIMIT ?';
    const result4 = await conexao.executarConsulta(sql4, ['nike', '5']);
    console.log('✅ Resultado:', result4.length, 'produtos encontrados');
    
  } catch (erro) {
    console.error('❌ Erro no teste:', erro.message);
    console.error('🔍 Detalhes:', {
      code: erro.code,
      errno: erro.errno,
      sqlState: erro.sqlState
    });
  }
}

testarTipos();
