// Script para verificar estrutura da tabela produtos
require('dotenv').config();
const conexao = require('./banco/conexao');

async function verificarEstrutura() {
  try {
    console.log('🔍 Verificando estrutura da tabela produtos...');
    
    const colunas = await conexao.executarConsulta('DESCRIBE produtos');
    
    console.log('📊 Colunas da tabela produtos:');
    colunas.forEach(coluna => {
      console.log(`- ${coluna.Field} (${coluna.Type}) ${coluna.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    // Verificar se existe alguma coluna relacionada a estoque
    const colunasEstoque = colunas.filter(col => 
      col.Field.toLowerCase().includes('estoque') || 
      col.Field.toLowerCase().includes('quantidade') ||
      col.Field.toLowerCase().includes('stock')
    );
    
    console.log('\n📦 Colunas relacionadas a estoque:');
    if (colunasEstoque.length > 0) {
      colunasEstoque.forEach(coluna => {
        console.log(`✅ ${coluna.Field} (${coluna.Type})`);
      });
    } else {
      console.log('❌ Nenhuma coluna de estoque encontrada');
    }
    
  } catch (erro) {
    console.error('❌ Erro:', erro);
  }
}

verificarEstrutura();
