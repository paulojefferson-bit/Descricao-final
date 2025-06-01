const mysql = require('mysql2/promise');
const conexao = require('../banco/conexao');

class Produto {
  constructor(dados) {
    this.id = dados.id;
    this.marca = dados.marca;
    this.nome = dados.nome;
    this.imagem = dados.imagem;
    this.preco_antigo = dados.preco_antigo;
    this.preco_atual = dados.preco_atual;
    this.desconto = dados.desconto;
    this.avaliacao = dados.avaliacao;
    this.numero_avaliacoes = dados.numero_avaliacoes;
    this.categoria = dados.categoria;
    this.genero = dados.genero;
    this.condicao = dados.condicao;
    this.estoque = dados.quantidade_estoque;
    this.descricao = dados.descricao;
    this.tamanhos_disponiveis = dados.tamanhos_disponiveis;
    this.cores_disponiveis = dados.cores_disponiveis;
    this.peso = dados.peso;
    this.material = dados.material;
    this.origem = dados.origem;
    this.garantia_meses = dados.garantia_meses;
    this.data_criacao = dados.data_criacao;
    this.data_atualizacao = dados.data_atualizacao;
  }

  // Buscar todos os produtos com filtros
  static async buscarTodos(filtros = {}) {
    try {
      let sql = `
        SELECT * FROM produtos 
        WHERE 1=1
      `;
      const parametros = [];

      // Filtro por termo de pesquisa
      if (filtros.termo_pesquisa) {
        sql += ` AND (nome LIKE ? OR marca LIKE ?)`;
        parametros.push(`%${filtros.termo_pesquisa}%`, `%${filtros.termo_pesquisa}%`);
      }

      // Filtro por marca
      if (filtros.marcas && filtros.marcas.length > 0) {
        const placeholders = filtros.marcas.map(() => '?').join(',');
        sql += ` AND marca IN (${placeholders})`;
        parametros.push(...filtros.marcas);
      }

      // Filtro por categoria
      if (filtros.categorias && filtros.categorias.length > 0) {
        const placeholders = filtros.categorias.map(() => '?').join(',');
        sql += ` AND categoria IN (${placeholders})`;
        parametros.push(...filtros.categorias);
      }

      // Filtro por gênero
      if (filtros.generos && filtros.generos.length > 0) {
        const placeholders = filtros.generos.map(() => '?').join(',');
        sql += ` AND genero IN (${placeholders})`;
        parametros.push(...filtros.generos);
      }

      // Filtro por condição
      if (filtros.condicao) {
        sql += ` AND condicao = ?`;
        parametros.push(filtros.condicao);
      }

      // Filtro por faixa de preço
      if (filtros.preco_min) {
        sql += ` AND preco_atual >= ?`;
        parametros.push(filtros.preco_min);
      }

      if (filtros.preco_max) {
        sql += ` AND preco_atual <= ?`;
        parametros.push(filtros.preco_max);
      }

      // Filtro por avaliação mínima
      if (filtros.avaliacao_minima) {
        sql += ` AND avaliacao >= ?`;
        parametros.push(filtros.avaliacao_minima);
      }

      // Filtro por estoque disponível
      if (filtros.apenas_em_estoque) {
        sql += ` AND quantidade_estoque > 0`;
      }

      // Ordenação
      if (filtros.ordenar_por) {
        switch (filtros.ordenar_por) {
          case 'preco_asc':
            sql += ` ORDER BY preco_atual ASC`;
            break;
          case 'preco_desc':
            sql += ` ORDER BY preco_atual DESC`;
            break;
          case 'nome_asc':
            sql += ` ORDER BY nome ASC`;
            break;
          case 'nome_desc':
            sql += ` ORDER BY nome DESC`;
            break;
          case 'avaliacao_desc':
            sql += ` ORDER BY avaliacao DESC`;
            break;
          case 'mais_recente':
            sql += ` ORDER BY data_criacao DESC`;
            break;
          default:
            sql += ` ORDER BY id ASC`;
        }
      } else {
        sql += ` ORDER BY id ASC`;
      }

      // Paginação
      if (filtros.limite) {
        sql += ` LIMIT ?`;
        parametros.push(parseInt(filtros.limite));
        
        if (filtros.offset) {
          sql += ` OFFSET ?`;
          parametros.push(parseInt(filtros.offset));
        }
      }

      const resultados = await conexao.executarConsulta(sql, parametros);
      return resultados.map(produto => new Produto(produto));
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro);
      throw new Error('Erro interno do servidor ao buscar produtos');
    }
  }

  // Buscar produto por ID
  static async buscarPorId(id) {
    try {
      const resultados = await conexao.executarConsulta(
        'SELECT * FROM produtos WHERE id = ?',
        [id]
      );
      
      if (resultados.length === 0) {
        return null;
      }
      
      return new Produto(resultados[0]);
    } catch (erro) {
      console.error('Erro ao buscar produto por ID:', erro);
      throw new Error('Erro interno do servidor ao buscar produto');
    }
  }

  // Criar novo produto
  static async criar(dadosProduto) {
    try {
      const sql = `
        INSERT INTO produtos (
          marca, nome, imagem, preco_antigo, preco_atual, desconto,
          avaliacao, numero_avaliacoes, categoria, genero, condicao,
          quantidade_estoque, descricao, tamanhos_disponiveis, cores_disponiveis,
          peso, material, origem, garantia_meses
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const parametros = [
        dadosProduto.marca,
        dadosProduto.nome,
        dadosProduto.imagem || '/tenis_produtos.png',
        dadosProduto.preco_antigo,
        dadosProduto.preco_atual,
        dadosProduto.desconto || 0,
        dadosProduto.avaliacao || 0,
        dadosProduto.numero_avaliacoes || 0,
        dadosProduto.categoria,
        dadosProduto.genero,
        dadosProduto.condicao || 'novo',
        dadosProduto.estoque || 0,
        dadosProduto.descricao || '',
        dadosProduto.tamanhos_disponiveis || '',
        dadosProduto.cores_disponiveis || '',
        dadosProduto.peso || 0,
        dadosProduto.material || '',
        dadosProduto.origem || '',
        dadosProduto.garantia_meses || 12
      ];

      const resultado = await conexao.executarConsulta(sql, parametros);
      return await Produto.buscarPorId(resultado.insertId);
    } catch (erro) {
      console.error('Erro ao criar produto:', erro);
      throw new Error('Erro interno do servidor ao criar produto');
    }
  }

  // Atualizar produto
  async atualizar(dadosAtualizacao) {
    try {
      const campos = [];
      const parametros = [];

      // Construir dinamicamente a query baseada nos campos fornecidos
      Object.keys(dadosAtualizacao).forEach(campo => {
        if (dadosAtualizacao[campo] !== undefined && campo !== 'id') {
          campos.push(`${campo} = ?`);
          parametros.push(dadosAtualizacao[campo]);
        }
      });

      if (campos.length === 0) {
        throw new Error('Nenhum campo para atualizar');
      }

      parametros.push(this.id);

      const sql = `
        UPDATE produtos 
        SET ${campos.join(', ')}
        WHERE id = ?
      `;

      await conexao.executarConsulta(sql, parametros);
      return await Produto.buscarPorId(this.id);
    } catch (erro) {
      console.error('Erro ao atualizar produto:', erro);
      throw new Error('Erro interno do servidor ao atualizar produto');
    }
  }

  // Deletar produto
  async deletar() {
    try {
      await conexao.executarConsulta('DELETE FROM produtos WHERE id = ?', [this.id]);
      return true;
    } catch (erro) {
      console.error('Erro ao deletar produto:', erro);
      throw new Error('Erro interno do servidor ao deletar produto');
    }
  }

  // Atualizar estoque
  async atualizarEstoque(quantidade) {
    try {
      await conexao.executarConsulta(
        'UPDATE produtos SET quantidade_estoque = ? WHERE id = ?',
        [quantidade, this.id]
      );
      this.estoque = quantidade;
      return this;
    } catch (erro) {
      console.error('Erro ao atualizar estoque:', erro);
      throw new Error('Erro interno do servidor ao atualizar estoque');
    }
  }

  // Reduzir estoque (para compras)
  async reduzirEstoque(quantidade) {
    try {
      if (this.estoque < quantidade) {
        throw new Error('Estoque insuficiente');
      }

      const novoEstoque = this.estoque - quantidade;
      await this.atualizarEstoque(novoEstoque);
      return this;
    } catch (erro) {
      console.error('Erro ao reduzir estoque:', erro);
      throw erro;
    }
  }

  // Buscar produtos relacionados (mesma categoria, marca diferente)
  async buscarRelacionados(limite = 4) {
    try {
      const resultados = await conexao.executarConsulta(`
        SELECT * FROM produtos 
        WHERE categoria = ? AND id != ? AND marca != ?
        ORDER BY avaliacao DESC, numero_avaliacoes DESC
        LIMIT ?
      `, [this.categoria, this.id, this.marca, limite]);

      return resultados.map(produto => new Produto(produto));
    } catch (erro) {
      console.error('Erro ao buscar produtos relacionados:', erro);
      throw new Error('Erro interno do servidor ao buscar produtos relacionados');
    }
  }

  // Buscar estatísticas de produtos
  static async obterEstatisticas() {
    try {
      const totalProdutos = await conexao.executarConsulta('SELECT COUNT(*) as total FROM produtos');
      const produtosEstoque = await conexao.executarConsulta('SELECT COUNT(*) as total FROM produtos WHERE estoque > 0');
      const produtosSemEstoque = await conexao.executarConsulta('SELECT COUNT(*) as total FROM produtos WHERE estoque = 0');
      const valorTotalEstoque = await conexao.executarConsulta('SELECT SUM(preco_atual * estoque) as total FROM produtos');
      
      return {
        total_produtos: totalProdutos[0].total,
        produtos_em_estoque: produtosEstoque[0].total,
        produtos_sem_estoque: produtosSemEstoque[0].total,
        valor_total_estoque: valorTotalEstoque[0].total || 0
      };
    } catch (erro) {
      console.error('Erro ao obter estatísticas:', erro);
      throw new Error('Erro interno do servidor ao obter estatísticas');
    }
  }
}

module.exports = Produto;
