// Script para verificar se há produtos no banco
require('dotenv').config();
const conexao = require('./banco/conexao');

async function verificarProdutos() {
  try {
    console.log('🔍 Verificando produtos no banco...');
    
    // Contar total de produtos
    const count = await conexao.executarConsulta('SELECT COUNT(*) as total FROM produtos');
    console.log('📊 Total de produtos:', count[0].total);
    
    if (count[0].total > 0) {
      // Buscar alguns produtos
      const produtos = await conexao.executarConsulta('SELECT id, marca, nome, quantidade_estoque FROM produtos LIMIT 5');
      console.log('📦 Primeiros produtos:');
      produtos.forEach((produto, index) => {
        console.log(`  ${index + 1}. ${produto.marca} - ${produto.nome} (estoque: ${produto.quantidade_estoque})`);
      });
      
      // Verificar marcas disponíveis
      const marcas = await conexao.executarConsulta('SELECT DISTINCT marca FROM produtos ORDER BY marca');
      console.log('🏷️ Marcas disponíveis:', marcas.map(m => m.marca).join(', '));
    }
    
  } catch (erro) {
    console.error('❌ Erro:', erro.message);
  }
}

verificarProdutos();
