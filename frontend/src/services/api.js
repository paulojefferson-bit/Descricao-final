// 🚨 ARQUIVO MODIFICADO PARA MODO TESTE - REVISAR ANTES DA PRODUÇÃO! 🚨
// Configuração da API
const API_BASE_URL = 'http://localhost:5000/api';

// Classe para gerenciar requisições à API
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }
  // Método para fazer requisições HTTP
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Adicionar token de autenticação se disponível
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    } else {
      // Se não há token, usar modo de teste
      config.headers['X-Test-Mode'] = 'true';
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('Erro na API:', error);
      throw error;
    }
  }

  // Métodos HTTP básicos
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Métodos de autenticação
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('token');
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }  // Verificar se está autenticado (modo de teste sempre considera autenticado)
  isAuthenticated() {
    // Em modo de desenvolvimento/teste, sempre consideramos autenticado para facilitar testes
    // Mas verificamos se há token para decidir o tipo de autenticação
    const hasToken = this.token || localStorage.getItem('token');
    console.log('🔐 Verificando autenticação:', { hasToken: !!hasToken, token: hasToken });
    return !!hasToken; // Retorna true apenas se houver token
  }
}

// Instância global da API
const api = new ApiService();

export default api;
