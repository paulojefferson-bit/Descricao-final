import api from './api.js';

// Serviços relacionados a produtos
export const produtosService = {
  // Buscar todos os produtos
  buscarTodos: (filtros = {}) => api.get('/produtos', filtros),
  
  // Buscar produto por ID
  buscarPorId: (id) => api.get(`/produtos/${id}`),
  
  // Criar produto (apenas colaborador+)
  criar: (dadosProduto) => api.post('/produtos', dadosProduto),
  
  // Atualizar produto (apenas colaborador+)
  atualizar: (id, dadosProduto) => api.put(`/produtos/${id}`, dadosProduto),
  
  // Deletar produto (apenas colaborador+)
  deletar: (id) => api.delete(`/produtos/${id}`),
  
  // Atualizar estoque (apenas colaborador+)
  atualizarEstoque: (id, estoque) => api.patch(`/produtos/${id}/estoque`, { estoque }),
  
  // Obter estatísticas (apenas colaborador+)
  obterEstatisticas: () => api.get('/produtos/admin/estatisticas'),
};

// Serviços relacionados à autenticação
export const authService = {
  // Registrar novo usuário
  registrar: (dadosUsuario) => api.post('/auth/registrar', dadosUsuario),
  
  // Fazer login
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    if (response.sucesso && response.dados.token) {
      api.setToken(response.dados.token);
    }
    return response;
  },
  
  // Fazer logout
  logout: () => {
    api.clearToken();
    return Promise.resolve({ sucesso: true });
  },
  
  // Verificar token
  verificarToken: (token) => api.post('/auth/verificar-token', { token }),
  
  // Obter perfil do usuário
  obterPerfil: () => api.get('/auth/perfil'),
  
  // Atualizar perfil
  atualizarPerfil: (dadosPerfil) => api.put('/auth/perfil', dadosPerfil),
  
  // Alterar senha
  alterarSenha: (senhas) => api.put('/auth/alterar-senha', senhas),
  
  // Deletar conta
  deletarConta: (senhaConfirmacao) => api.delete('/auth/deletar-conta', { senha_confirmacao: senhaConfirmacao }),
  
  // Exportar dados (LGPD)
  exportarDados: () => api.get('/auth/exportar-dados'),
};

// Serviços relacionados ao carrinho
export const carrinhoService = {
  // Obter carrinho do usuário
  obter: () => api.get('/carrinho'),
  
  // Adicionar item ao carrinho
  adicionarItem: (item) => api.post('/carrinho/adicionar', item),
  
  // Atualizar quantidade de item
  atualizarItem: (itemId, quantidade) => api.put(`/carrinho/${itemId}`, { quantidade }),
  
  // Remover item do carrinho
  removerItem: (itemId) => api.delete(`/carrinho/${itemId}`),
  
  // Limpar carrinho
  limpar: () => api.delete('/carrinho'),
  
  // Validar carrinho antes da compra
  validar: () => api.post('/carrinho/validar'),
  
  // Atualizar preços dos itens
  atualizarPrecos: () => api.post('/carrinho/atualizar-precos'),
  
  // Finalizar compra
  finalizarCompra: (dadosCompra) => api.post('/carrinho/finalizar', dadosCompra),
  
  // Obter resumo do carrinho
  obterResumo: () => api.get('/carrinho/resumo'),
};

// Serviços relacionados a promoções
export const promocoesService = {
  // Buscar promoções ativas (público)
  buscarAtivas: () => api.get('/promocoes'),
  
  // Buscar promoção por ID
  buscarPorId: (id) => api.get(`/promocoes/${id}`),
  
  // Comprar produto em promoção
  comprar: (id, quantidade) => api.post(`/promocoes/${id}/comprar`, { quantidade }),
  
  // Admin: Buscar todas as promoções (apenas supervisor+)
  buscarTodas: (filtros = {}) => api.get('/promocoes/admin/todas', filtros),
  
  // Admin: Criar promoção (apenas supervisor+)
  criar: (dadosPromocao) => api.post('/promocoes', dadosPromocao),
  
  // Admin: Atualizar promoção (apenas supervisor+)
  atualizar: (id, dadosPromocao) => api.put(`/promocoes/${id}`, dadosPromocao),
  
  // Admin: Deletar promoção (apenas supervisor+)
  deletar: (id) => api.delete(`/promocoes/${id}`),
  
  // Admin: Alterar status da promoção (apenas supervisor+)
  alterarStatus: (id, ativa) => api.patch(`/promocoes/${id}/status`, { ativa }),
  
  // Admin: Obter estatísticas (apenas supervisor+)
  obterEstatisticas: () => api.get('/promocoes/admin/estatisticas'),
  
  // Admin: Buscar promoções próximas do vencimento (apenas supervisor+)
  buscarProximasExpiracao: (horas = 24) => api.get('/promocoes/admin/proximas-expiracao', { horas }),
  
  // Admin: Desativar promoções expiradas (apenas supervisor+)
  desativarExpiradas: () => api.post('/promocoes/admin/desativar-expiradas'),
};

// Serviços administrativos
export const adminService = {
  // Dashboard principal (apenas colaborador+)
  obterDashboard: () => api.get('/admin/dashboard'),
  
  // Gerenciar usuários (apenas diretor)
  buscarUsuarios: (filtros = {}) => api.get('/admin/usuarios', filtros),
  
  // Alterar nível de acesso de usuário (apenas diretor)
  alterarNivelAcesso: (id, nivelAcesso) => api.put(`/admin/usuarios/${id}/nivel-acesso`, { nivel_acesso: nivelAcesso }),
  
  // Alterar status de usuário (apenas diretor)
  alterarStatusUsuario: (id, ativo) => api.put(`/admin/usuarios/${id}/status`, { ativo }),
  
  // Visualizar logs do sistema (apenas diretor)
  buscarLogs: (filtros = {}) => api.get('/admin/logs', filtros),
  
  // Relatórios
  relatorios: {
    // Relatório de vendas (apenas supervisor+)
    vendas: (filtros = {}) => api.get('/admin/relatorios/vendas', filtros),
    
    // Relatório de estoque (apenas colaborador+)
    estoque: () => api.get('/admin/relatorios/estoque'),
  },
  
  // Fazer backup dos dados (apenas diretor)
  backup: () => api.post('/admin/backup'),
  
  // Obter informações do sistema (apenas diretor)
  obterInfoSistema: () => api.get('/admin/sistema/info'),
};

// Serviços gerais da API
export const apiService = {
  // Verificar status da API
  verificarStatus: () => api.get('/health'),
  
  // Obter informações da API
  obterInfo: () => api.get('/info'),
};
