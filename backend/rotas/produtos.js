const express = require('express');
const router = express.Router();
const Produto = require('../modelos/Produto');
const { verificarAutenticacao, verificarPermissao } = require('../middleware/autenticacao');

// GET /api/produtos - Buscar produtos (público)
router.get('/', async (req, res) => {
  try {
    const filtros = {
      termo_pesquisa: req.query.busca,
      marcas: req.query.marcas ? req.query.marcas.split(',') : undefined,
      categorias: req.query.categorias ? req.query.categorias.split(',') : undefined,
      generos: req.query.generos ? req.query.generos.split(',') : undefined,
      condicao: req.query.condicao,
      preco_min: req.query.preco_min ? parseFloat(req.query.preco_min) : undefined,
      preco_max: req.query.preco_max ? parseFloat(req.query.preco_max) : undefined,
      avaliacao_minima: req.query.avaliacao_minima ? parseFloat(req.query.avaliacao_minima) : undefined,
      apenas_em_estoque: req.query.apenas_em_estoque === 'true',
      ordenar_por: req.query.ordenar_por,
      limite: req.query.limite ? parseInt(req.query.limite) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset) : undefined
    };

    const produtos = await Produto.buscarTodos(filtros);
    
    res.json({
      sucesso: true,
      dados: produtos,
      total: produtos.length
    });
  } catch (erro) {
    console.error('Erro ao buscar produtos:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao buscar produtos'
    });
  }
});

// GET /api/produtos/:id - Buscar produto específico (público)
router.get('/:id', async (req, res) => {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    
    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    // Buscar produtos relacionados
    const produtosRelacionados = await produto.buscarRelacionados();
    
    res.json({
      sucesso: true,
      dados: {
        produto,
        produtos_relacionados: produtosRelacionados
      }
    });
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao buscar produto'
    });
  }
});

// POST /api/produtos - Criar produto (apenas colaborador+)
router.post('/', verificarAutenticacao, verificarPermissao('colaborador'), async (req, res) => {
  try {
    const produtoData = {
      marca: req.body.marca,
      nome: req.body.nome,
      imagem: req.body.imagem,
      preco_antigo: parseFloat(req.body.preco_antigo),
      preco_atual: parseFloat(req.body.preco_atual),
      desconto: req.body.desconto ? parseFloat(req.body.desconto) : undefined,
      avaliacao: req.body.avaliacao ? parseFloat(req.body.avaliacao) : undefined,
      numero_avaliacoes: req.body.numero_avaliacoes ? parseInt(req.body.numero_avaliacoes) : undefined,
      categoria: req.body.categoria,
      genero: req.body.genero,
      condicao: req.body.condicao,
      estoque: parseInt(req.body.estoque) || 0,
      descricao: req.body.descricao,
      tamanhos_disponiveis: req.body.tamanhos_disponiveis,
      cores_disponiveis: req.body.cores_disponiveis,
      peso: req.body.peso ? parseFloat(req.body.peso) : undefined,
      material: req.body.material,
      origem: req.body.origem,
      garantia_meses: req.body.garantia_meses ? parseInt(req.body.garantia_meses) : undefined
    };

    // Validações básicas
    if (!produtoData.marca || !produtoData.nome || !produtoData.preco_atual || !produtoData.categoria || !produtoData.genero) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Campos obrigatórios: marca, nome, preco_atual, categoria, genero'
      });
    }

    const produto = await Produto.criar(produtoData);
    
    // Log da ação
    req.logAcao('produto_criado', { produto_id: produto.id, dados: produtoData });
    
    res.status(201).json({
      sucesso: true,
      dados: produto,
      mensagem: 'Produto criado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message || 'Erro interno do servidor ao criar produto'
    });
  }
});

// PUT /api/produtos/:id - Atualizar produto (apenas colaborador+)
router.put('/:id', verificarAutenticacao, verificarPermissao('colaborador'), async (req, res) => {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    
    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    const dadosAtualizacao = {};
    
    // Campos que podem ser atualizados
    const camposPermitidos = [
      'marca', 'nome', 'imagem', 'preco_antigo', 'preco_atual', 'desconto',
      'avaliacao', 'numero_avaliacoes', 'categoria', 'genero', 'condicao',
      'estoque', 'descricao', 'tamanhos_disponiveis', 'cores_disponiveis',
      'peso', 'material', 'origem', 'garantia_meses'
    ];

    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        dadosAtualizacao[campo] = req.body[campo];
      }
    });

    const produtoAtualizado = await produto.atualizar(dadosAtualizacao);
    
    // Log da ação
    req.logAcao('produto_atualizado', { produto_id: produto.id, dados: dadosAtualizacao });
    
    res.json({
      sucesso: true,
      dados: produtoAtualizado,
      mensagem: 'Produto atualizado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message || 'Erro interno do servidor ao atualizar produto'
    });
  }
});

// PATCH /api/produtos/:id/estoque - Atualizar estoque (apenas colaborador+)
router.patch('/:id/estoque', verificarAutenticacao, verificarPermissao('colaborador'), async (req, res) => {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    
    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    const novaQuantidade = parseInt(req.body.estoque);
    
    if (isNaN(novaQuantidade) || novaQuantidade < 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Quantidade de estoque deve ser um número válido e não negativo'
      });
    }

    const produtoAtualizado = await produto.atualizarEstoque(novaQuantidade);
    
    // Log da ação
    req.logAcao('estoque_atualizado', { 
      produto_id: produto.id, 
      estoque_anterior: produto.estoque,
      estoque_novo: novaQuantidade 
    });
    
    res.json({
      sucesso: true,
      dados: produtoAtualizado,
      mensagem: 'Estoque atualizado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao atualizar estoque:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message || 'Erro interno do servidor ao atualizar estoque'
    });
  }
});

// DELETE /api/produtos/:id - Deletar produto (apenas diretor)
router.delete('/:id', verificarAutenticacao, verificarPermissao('diretor'), async (req, res) => {
  try {
    const produto = await Produto.buscarPorId(req.params.id);
    
    if (!produto) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado'
      });
    }

    await produto.deletar();
    
    // Log da ação
    req.logAcao('produto_deletado', { produto_id: produto.id, produto_nome: produto.nome });
    
    res.json({
      sucesso: true,
      mensagem: 'Produto deletado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao deletar produto:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: erro.message || 'Erro interno do servidor ao deletar produto'
    });
  }
});

// GET /api/produtos/estatisticas - Obter estatísticas (apenas colaborador+)
router.get('/admin/estatisticas', verificarAutenticacao, verificarPermissao('colaborador'), async (req, res) => {
  try {
    const estatisticas = await Produto.obterEstatisticas();
    
    res.json({
      sucesso: true,
      dados: estatisticas
    });
  } catch (erro) {
    console.error('Erro ao obter estatísticas:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao obter estatísticas'
    });
  }
});

module.exports = router;
