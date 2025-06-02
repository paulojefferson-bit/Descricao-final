# 🌐 Guia de Integração Frontend - Sistema de Pedidos

## 📖 Introdução

Este guia demonstra como integrar o sistema de pedidos com aplicações frontend (React, Vue.js, Angular, JavaScript Vanilla).

## 🔧 Configuração Inicial

### 1. Base URL da API
```javascript
const API_BASE = 'http://localhost:3000/api';
// Para produção: 'https://sua-api.com/api'
```

### 2. Configuração de Headers
```javascript
const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
});
```

## 🎯 Implementações por Framework

### React.js

#### Hook Personalizado para Pedidos
```jsx
// hooks/usePedidos.js
import { useState, useEffect } from 'react';

export const usePedidos = (token) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPedidos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/pedidos`, {
        headers: getHeaders(token)
      });
      
      const data = await response.json();
      
      if (data.sucesso) {
        setPedidos(data.dados);
      } else {
        setError(data.mensagem);
      }
    } catch (err) {
      setError('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const buscarPedido = async (pedidoId) => {
    try {
      const response = await fetch(`${API_BASE}/pedidos/${pedidoId}`, {
        headers: getHeaders(token)
      });
      
      const data = await response.json();
      return data.sucesso ? data.dados : null;
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      return null;
    }
  };

  useEffect(() => {
    if (token) {
      buscarPedidos();
    }
  }, [token]);

  return { pedidos, loading, error, buscarPedidos, buscarPedido };
};
```

#### Componente de Lista de Pedidos
```jsx
// components/ListaPedidos.jsx
import React from 'react';
import { usePedidos } from '../hooks/usePedidos';

const ListaPedidos = ({ token }) => {
  const { pedidos, loading, error, buscarPedidos } = usePedidos(token);

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  if (loading) return <div>Carregando pedidos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="lista-pedidos">
      <h2>Meus Pedidos</h2>
      <button onClick={buscarPedidos}>Atualizar</button>
      
      {pedidos.length === 0 ? (
        <p>Nenhum pedido encontrado</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="pedido-card">
              <h3>Pedido: {pedido.id}</h3>
              <p>Data: {formatarData(pedido.data_pedido)}</p>
              <p>Status: {pedido.status_pedido}</p>
              <p>Total: {formatarPreco(pedido.valor_total)}</p>
              <p>Itens: {pedido.itens.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListaPedidos;
```

### Vue.js

#### Composable para Pedidos
```javascript
// composables/usePedidos.js
import { ref, reactive } from 'vue';

export function usePedidos() {
  const pedidos = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const buscarPedidos = async (token) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE}/pedidos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.sucesso) {
        pedidos.value = data.dados;
      } else {
        error.value = data.mensagem;
      }
    } catch (err) {
      error.value = 'Erro ao carregar pedidos';
    } finally {
      loading.value = false;
    }
  };

  return {
    pedidos,
    loading,
    error,
    buscarPedidos
  };
}
```

#### Componente Vue
```vue
<!-- components/ListaPedidos.vue -->
<template>
  <div class="lista-pedidos">
    <h2>Meus Pedidos</h2>
    <button @click="buscarPedidos(token)" :disabled="loading">
      {{ loading ? 'Carregando...' : 'Atualizar' }}
    </button>
    
    <div v-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-if="pedidos.length === 0 && !loading" class="vazio">
      Nenhum pedido encontrado
    </div>
    
    <div v-else class="pedidos-grid">
      <div v-for="pedido in pedidos" :key="pedido.id" class="pedido-card">
        <h3>{{ pedido.id }}</h3>
        <p>Data: {{ formatarData(pedido.data_pedido) }}</p>
        <p>Status: {{ pedido.status_pedido }}</p>
        <p>Total: {{ formatarPreco(pedido.valor_total) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePedidos } from '../composables/usePedidos';

const props = defineProps(['token']);
const { pedidos, loading, error, buscarPedidos } = usePedidos();

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR');
};

const formatarPreco = (valor) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};
</script>
```

### Angular

#### Service para Pedidos
```typescript
// services/pedidos.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Pedido {
  id: string;
  valor_total: number;
  status_pedido: string;
  data_pedido: string;
  itens: any[];
}

interface ApiResponse {
  sucesso: boolean;
  dados: Pedido[];
  mensagem?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl = 'http://localhost:3000/api/pedidos';

  constructor(private http: HttpClient) {}

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  buscarPedidos(token: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.apiUrl, {
      headers: this.getHeaders(token)
    });
  }

  buscarPedido(pedidoId: string, token: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/${pedidoId}`, {
      headers: this.getHeaders(token)
    });
  }
}
```

#### Componente Angular
```typescript
// components/lista-pedidos.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-lista-pedidos',
  template: `
    <div class="lista-pedidos">
      <h2>Meus Pedidos</h2>
      <button (click)="carregarPedidos()" [disabled]="loading">
        {{ loading ? 'Carregando...' : 'Atualizar' }}
      </button>
      
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="pedidos.length === 0 && !loading" class="vazio">
        Nenhum pedido encontrado
      </div>
      
      <div *ngIf="pedidos.length > 0" class="pedidos-grid">
        <div *ngFor="let pedido of pedidos" class="pedido-card">
          <h3>{{ pedido.id }}</h3>
          <p>Data: {{ pedido.data_pedido | date:'shortDate' }}</p>
          <p>Status: {{ pedido.status_pedido }}</p>
          <p>Total: {{ pedido.valor_total | currency:'BRL' }}</p>
        </div>
      </div>
    </div>
  `
})
export class ListaPedidosComponent implements OnInit {
  @Input() token!: string;
  
  pedidos: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
    if (this.token) {
      this.carregarPedidos();
    }
  }

  carregarPedidos() {
    this.loading = true;
    this.error = null;

    this.pedidosService.buscarPedidos(this.token).subscribe({
      next: (response) => {
        if (response.sucesso) {
          this.pedidos = response.dados;
        } else {
          this.error = response.mensagem || 'Erro desconhecido';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erro ao carregar pedidos';
        this.loading = false;
      }
    });
  }
}
```

### JavaScript Vanilla

#### Classe para Gerenciar Pedidos
```javascript
// js/PedidosManager.js
class PedidosManager {
  constructor(apiBase = 'http://localhost:3000/api') {
    this.apiBase = apiBase;
  }

  async buscarPedidos(token) {
    try {
      const response = await fetch(`${this.apiBase}/pedidos`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return { sucesso: false, mensagem: 'Erro de conexão' };
    }
  }

  async buscarPedido(pedidoId, token) {
    try {
      const response = await fetch(`${this.apiBase}/pedidos/${pedidoId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      return { sucesso: false, mensagem: 'Erro de conexão' };
    }
  }

  renderizarPedidos(pedidos, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.error('Container não encontrado:', containerId);
      return;
    }

    if (pedidos.length === 0) {
      container.innerHTML = '<p>Nenhum pedido encontrado</p>';
      return;
    }

    const html = pedidos.map(pedido => `
      <div class="pedido-card" data-pedido-id="${pedido.id}">
        <h3>${pedido.id}</h3>
        <p><strong>Data:</strong> ${this.formatarData(pedido.data_pedido)}</p>
        <p><strong>Status:</strong> ${pedido.status_pedido}</p>
        <p><strong>Total:</strong> ${this.formatarPreco(pedido.valor_total)}</p>
        <p><strong>Itens:</strong> ${pedido.itens.length}</p>
        <button onclick="verDetalhes('${pedido.id}')">Ver Detalhes</button>
      </div>
    `).join('');

    container.innerHTML = html;
  }

  formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  formatarPreco(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }
}

// Exemplo de uso
const pedidosManager = new PedidosManager();

async function carregarPedidos() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Token não encontrado. Faça login novamente.');
    return;
  }

  const loading = document.getElementById('loading');
  loading.style.display = 'block';

  const resultado = await pedidosManager.buscarPedidos(token);
  
  loading.style.display = 'none';

  if (resultado.sucesso) {
    pedidosManager.renderizarPedidos(resultado.dados, 'pedidos-container');
  } else {
    document.getElementById('pedidos-container').innerHTML = 
      `<div class="error">Erro: ${resultado.mensagem}</div>`;
  }
}

async function verDetalhes(pedidoId) {
  const token = localStorage.getItem('token');
  const resultado = await pedidosManager.buscarPedido(pedidoId, token);
  
  if (resultado.sucesso) {
    // Exibir modal ou página de detalhes
    console.log('Detalhes do pedido:', resultado.dados);
  }
}
```

## 🎨 CSS Sugerido

```css
/* styles/pedidos.css */
.lista-pedidos {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.pedidos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.pedido-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s;
}

.pedido-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.pedido-card h3 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
}

.pedido-card p {
  margin: 8px 0;
  color: #666;
}

.error {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #fcc;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```

## 🔧 Tratamento de Erros

### Estados de Erro Comuns
```javascript
const tratarErros = (response, data) => {
  switch (response.status) {
    case 401:
      // Token inválido ou expirado
      localStorage.removeItem('token');
      window.location.href = '/login';
      break;
    case 404:
      // Pedido não encontrado
      return 'Pedido não encontrado';
    case 500:
      // Erro interno do servidor
      return 'Erro interno do servidor';
    default:
      return data.mensagem || 'Erro desconhecido';
  }
};
```

## 🚀 Otimizações Recomendadas

### 1. Cache Local
```javascript
// Implementar cache para evitar requisições desnecessárias
const cache = new Map();

const buscarPedidosComCache = async (token, forceRefresh = false) => {
  const cacheKey = `pedidos_${token}`;
  
  if (!forceRefresh && cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    const agora = Date.now();
    
    // Cache válido por 5 minutos
    if (agora - cached.timestamp < 300000) {
      return cached.data;
    }
  }

  const dados = await buscarPedidos(token);
  
  if (dados.sucesso) {
    cache.set(cacheKey, {
      data: dados,
      timestamp: Date.now()
    });
  }
  
  return dados;
};
```

### 2. Paginação
```javascript
// Para grandes volumes de pedidos
const buscarPedidosPaginados = async (token, pagina = 1, limite = 10) => {
  const response = await fetch(
    `${API_BASE}/pedidos?pagina=${pagina}&limite=${limite}`,
    { headers: getHeaders(token) }
  );
  
  return response.json();
};
```

## 🔍 Debug e Monitoramento

### Console Logs Estruturados
```javascript
const log = {
  info: (msg, data) => console.log(`[PEDIDOS] ${msg}`, data),
  error: (msg, error) => console.error(`[PEDIDOS] ${msg}`, error),
  warn: (msg, data) => console.warn(`[PEDIDOS] ${msg}`, data)
};

// Uso:
log.info('Carregando pedidos', { usuarioId: usuario.id });
log.error('Falha ao carregar pedidos', error);
```

## 📚 Exemplos Completos

Confira os arquivos de exemplo na pasta `exemplos/`:
- `react-example/` - Aplicação React completa
- `vue-example/` - Aplicação Vue.js completa  
- `angular-example/` - Aplicação Angular completa
- `vanilla-example/` - Exemplo em JavaScript puro

---

## 🆘 Suporte

Para dúvidas sobre integração:
1. Verifique os logs no console do navegador
2. Confirme se o token JWT está válido
3. Teste os endpoints diretamente via Postman/Insomnia
4. Consulte a documentação da API em `DOCUMENTACAO_SISTEMA_PEDIDOS.md`
