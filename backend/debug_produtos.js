// Script de teste para debug do erro de produtos
require('dotenv').config();
const conexao = require('./banco/conexao');

async function testarConsultaProdutos() {
  try {
    console.log('🔍 Testando consulta de produtos com filtros...');
      // Reproduzir a consulta exata que está falhando
    const filtros = {
      marcas: ['nike'],
      apenas_em_estoque: true,
      limite: 15,
      offset: 0
    };
    
    let sql = `
      SELECT * FROM produtos 
      WHERE 1=1
    `;
    const parametros = [];

    // Filtro por marca
    if (Array.isArray(filtros.marcas) && filtros.marcas.length > 0) {
      const placeholders = filtros.marcas.map(() => '?').join(',');
      sql += ` AND marca IN (${placeholders})`;
      parametros.push(...filtros.marcas);
    }    // Filtro por estoque disponível
    if (filtros.apenas_em_estoque) {
      sql += ` AND quantidade_estoque > 0`;
    }

    // Ordenação
    sql += ` ORDER BY id ASC`;    // Paginação
    if (filtros.limite) {
      sql += ` LIMIT ?`;
      parametros.push(parseInt(filtros.limite));
      
      if (filtros.offset && filtros.offset > 0) {
        sql += ` OFFSET ?`;
        parametros.push(parseInt(filtros.offset));
      }
    }

    console.log('📝 SQL:', sql);
    console.log('🔧 Parâmetros:', parametros);

    const resultados = await conexao.executarConsulta(sql, parametros);
    console.log('✅ Consulta executada com sucesso!');
    console.log('📊 Resultados encontrados:', resultados.length);
    
    if (resultados.length > 0) {      console.log('🔍 Primeiro produto:', {
        id: resultados[0].id,
        marca: resultados[0].marca,
        nome: resultados[0].nome,
        estoque: resultados[0].quantidade_estoque
      });
    }
      } catch (erro) {
    console.error('❌ Erro no teste:', erro);
    console.error('📜 Stack:', erro.stack);
    console.error('🔍 Erro completo:', JSON.stringify(erro, null, 2));
    console.error('🔍 Código do erro:', erro.code);
    console.error('🔍 Número do erro:', erro.errno);
    console.error('🔍 Mensagem SQL:', erro.sqlMessage);
  }
}

// Executar o teste
testarConsultaProdutos();
