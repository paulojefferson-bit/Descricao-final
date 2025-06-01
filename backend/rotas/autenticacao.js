const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/Usuario');
const { verificarAutenticacao, verificarPermissao } = require('../middleware/autenticacao');

// POST /api/auth/registrar - Registrar novo usuário
router.post('/registrar', async (req, res) => {
  try {
    const { nome, email, senha, confirmar_senha } = req.body;

    // Validações básicas
    if (!nome || !email || !senha || !confirmar_senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Todos os campos são obrigatórios'
      });
    }

    if (senha !== confirmar_senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senhas não coincidem'
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha deve ter pelo menos 6 caracteres'
      });
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email inválido'
      });
    }

    const dadosUsuario = {
      nome: nome.trim(),
      email: email.toLowerCase().trim(),
      senha,
      nivel_acesso: 'usuario', // Usuário padrão
      telefone: req.body.telefone,
      data_nascimento: req.body.data_nascimento,
      endereco_completo: req.body.endereco_completo,
      cidade: req.body.cidade,
      estado: req.body.estado,
      cep: req.body.cep,
      aceita_marketing: req.body.aceita_marketing === true
    };

    const usuario = await Usuario.criar(dadosUsuario);
    
    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: usuario.id, 
        email: usuario.email, 
        nivelAcesso: usuario.nivel_acesso 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    res.status(201).json({
      sucesso: true,
      dados: {
        usuario,
        token
      },
      mensagem: 'Usuário registrado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao registrar usuário:', erro);
    
    if (erro.message === 'Email já está em uso') {
      return res.status(409).json({
        sucesso: false,
        mensagem: 'Este email já está em uso'
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao registrar usuário'
    });
  }
});

// POST /api/auth/login - Fazer login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validações básicas
    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Email e senha são obrigatórios'
      });
    }

    const resultado = await Usuario.autenticar(email.toLowerCase().trim(), senha);
    
    res.json({
      sucesso: true,
      dados: resultado,
      mensagem: 'Login realizado com sucesso'
    });
  } catch (erro) {
    console.error('Erro no login:', erro);
    
    const mensagensErro = {
      'Credenciais inválidas': 'Email ou senha incorretos',
      'Conta desativada': 'Sua conta foi desativada. Entre em contato com o suporte'
    };

    const mensagem = mensagensErro[erro.message] || erro.message || 'Erro interno do servidor';
    const status = erro.message.includes('bloqueada') ? 429 : 
                   erro.message === 'Credenciais inválidas' ? 401 : 
                   erro.message === 'Conta desativada' ? 403 : 500;
    
    res.status(status).json({
      sucesso: false,
      mensagem
    });
  }
});

// POST /api/auth/verificar-token - Verificar se token é válido
router.post('/verificar-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Token é obrigatório'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.buscarPorId(decoded.userId);

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        sucesso: false,
        mensagem: 'Token inválido ou usuário desativado'
      });
    }

    res.json({
      sucesso: true,
      dados: {
        usuario,
        valido: true
      }
    });
  } catch (erro) {
    console.error('Erro ao verificar token:', erro);
    res.status(401).json({
      sucesso: false,
      mensagem: 'Token inválido'
    });
  }
});

// GET /api/auth/perfil - Obter perfil do usuário logado
router.get('/perfil', verificarAutenticacao, async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    res.json({
      sucesso: true,
      dados: usuario
    });
  } catch (erro) {
    console.error('Erro ao obter perfil:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao obter perfil'
    });
  }
});

// PUT /api/auth/perfil - Atualizar perfil do usuário logado
router.put('/perfil', verificarAutenticacao, async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Usuário não encontrado'
      });
    }

    const dadosAtualizacao = {};
    
    // Campos que o usuário pode atualizar
    const camposPermitidos = [
      'nome', 'telefone', 'data_nascimento', 'endereco_completo',
      'cidade', 'estado', 'cep', 'aceita_marketing'
    ];

    camposPermitidos.forEach(campo => {
      if (req.body[campo] !== undefined) {
        dadosAtualizacao[campo] = req.body[campo];
      }
    });

    const usuarioAtualizado = await usuario.atualizar(dadosAtualizacao);
    
    res.json({
      sucesso: true,
      dados: usuarioAtualizado,
      mensagem: 'Perfil atualizado com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao atualizar perfil:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao atualizar perfil'
    });
  }
});

// PUT /api/auth/alterar-senha - Alterar senha do usuário logado
router.put('/alterar-senha', verificarAutenticacao, async (req, res) => {
  try {
    const { senha_atual, nova_senha, confirmar_nova_senha } = req.body;

    // Validações
    if (!senha_atual || !nova_senha || !confirmar_nova_senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Todos os campos são obrigatórios'
      });
    }

    if (nova_senha !== confirmar_nova_senha) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nova senha e confirmação não coincidem'
      });
    }

    if (nova_senha.length < 6) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Nova senha deve ter pelo menos 6 caracteres'
      });
    }

    // Verificar senha atual
    const usuario = await Usuario.buscarPorEmail(req.usuario.email, true);
    const bcrypt = require('bcrypt');
    const senhaValida = await bcrypt.compare(senha_atual, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha atual incorreta'
      });
    }

    // Atualizar senha
    await usuario.atualizar({ senha: nova_senha });
    
    // Log da ação
    req.logAcao('senha_alterada', { usuario_id: usuario.id });
    
    res.json({
      sucesso: true,
      mensagem: 'Senha alterada com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao alterar senha:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao alterar senha'
    });
  }
});

// DELETE /api/auth/deletar-conta - Deletar conta (LGPD)
router.delete('/deletar-conta', verificarAutenticacao, async (req, res) => {
  try {
    const { senha_confirmacao } = req.body;

    if (!senha_confirmacao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Confirmação de senha é obrigatória'
      });
    }

    // Verificar senha
    const usuario = await Usuario.buscarPorEmail(req.usuario.email, true);
    const bcrypt = require('bcrypt');
    const senhaValida = await bcrypt.compare(senha_confirmacao, usuario.senha);

    if (!senhaValida) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Senha incorreta'
      });
    }

    // Log da ação antes de deletar
    req.logAcao('conta_deletada', { 
      usuario_id: usuario.id, 
      email: usuario.email,
      motivo: 'solicitacao_usuario'
    });

    await usuario.deletarConta();
    
    res.json({
      sucesso: true,
      mensagem: 'Conta deletada com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao deletar conta:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao deletar conta'
    });
  }
});

// GET /api/auth/exportar-dados - Exportar dados do usuário (LGPD)
router.get('/exportar-dados', verificarAutenticacao, async (req, res) => {
  try {
    const usuario = await Usuario.buscarPorId(req.usuario.id);
    const dadosExportados = await usuario.exportarDados();
    
    // Log da ação
    req.logAcao('dados_exportados', { usuario_id: usuario.id });
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="dados_usuario_${usuario.id}.json"`);
    
    res.json({
      sucesso: true,
      dados: dadosExportados,
      mensagem: 'Dados exportados com sucesso'
    });
  } catch (erro) {
    console.error('Erro ao exportar dados:', erro);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor ao exportar dados'
    });
  }
});

module.exports = router;
