# 📋 Sistema de Pedidos - README

## 🚀 Início Rápido

### Endpoints Disponíveis

```http
GET /api/pedidos              # Lista pedidos do usuário
GET /api/pedidos/:pedidoId    # Detalhes de um pedido específico
```

### Exemplo de Uso

```javascript
// Obter lista de pedidos
const response = await fetch('/api/pedidos', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Obter pedido específico
const pedido = await fetch('/api/pedidos/PED-1748884452492-178', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 🔧 Configuração

### Pré-requisitos
- Node.js instalado
- Banco de dados MySQL configurado
- Tabela `pedidos_simples` criada

### Dependências
```json
{
  "express": "^4.18.2",
  "mysql2": "^3.6.0"
}
```

## 📊 Estrutura de Dados

### Pedido
```json
{
  "id": "PED-1748884452492-178",
  "valor_total": 999.98,
  "valor_desconto": 0.00,
  "valor_frete": 0.00,
  "forma_pagamento": "cartao_credito",
  "observacoes": "Entrega rápida",
  "status_pedido": "confirmado",
  "data_pedido": "2025-01-30T12:30:15.000Z",
  "itens": [
    {
      "produto_id": 1,
      "nome": "Nike Air Max 90",
      "preco": 499.99,
      "quantidade": 2,
      "subtotal": 999.98
    }
  ]
}
```

## 🧪 Testes

### Comandos de Teste - PowerShell (Windows)
```powershell
# Executar suite completa de testes
.\teste_pedidos.ps1

# Executar com parâmetros customizados
.\teste_pedidos.ps1 -BaseUrl "http://localhost:5000" -Email "seu@email.com"

# Testar endpoint específico com Invoke-RestMethod
$headers = @{ Authorization = "Bearer SEU_TOKEN" }
Invoke-RestMethod -Uri "http://localhost:5000/api/pedidos" -Headers $headers

# Testar pedido específico
Invoke-RestMethod -Uri "http://localhost:5000/api/pedidos/PED-123" -Headers $headers
```

### Comandos de Teste - Batch (Windows)
```batch
# Executar testes básicos
teste_pedidos.bat

# Teste manual com curl
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/pedidos
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/pedidos/PED-123
```

### Comandos de Teste - Node.js (Multiplataforma)
```bash
# Executar suite automatizada
node teste_pedidos.js

# Executar testes específicos via código
node -e "const Teste = require('./teste_pedidos'); new Teste().executarTodosTestes();"
```

### Status dos Testes
- ✅ Consulta de pedidos vazia
- ✅ Consulta com múltiplos pedidos
- ✅ Pedido específico válido
- ✅ Pedido inexistente (404)
- ✅ Deserialização de JSON
- ✅ Segurança e autenticação

## 🔐 Segurança

- **Autenticação JWT obrigatória**
- **Isolamento por usuário**
- **Validação de propriedade**
- **Tratamento seguro de erros**

## 📈 Performance

- **Limite:** 20 pedidos por consulta
- **Ordenação:** Por data (mais recente primeiro)
- **Otimização:** Índices no banco de dados
- **Cache:** Recomendado para ambiente de produção

## 🔍 Monitoramento

### Logs Disponíveis
```javascript
console.error('Erro ao buscar pedidos:', erro);
console.error('Erro ao buscar pedido:', erro);
```

### Métricas
- Tempo de resposta
- Taxa de erro
- Número de consultas por usuário

## 🛠 Troubleshooting

### Problemas Comuns

1. **401 Unauthorized**
   - Verificar se token JWT é válido
   - Confirmar header Authorization

2. **404 Not Found**
   - Pedido não existe
   - Pedido pertence a outro usuário

3. **500 Internal Server Error**
   - Erro de conexão com banco
   - Problema na deserialização JSON

### Debug - PowerShell
```powershell
# Ativar logs detalhados
$env:DEBUG = "app:pedidos"
npm start

# Verificar status do servidor
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Testar conectividade
Test-NetConnection -ComputerName localhost -Port 5000
```

### Debug - Batch
```batch
# Definir variável de debug
set DEBUG=app:pedidos
npm start

# Testar conectividade básica
ping localhost
curl -s http://localhost:5000/api/health
```

## 📁 Arquivos Relacionados

- `backend/rotas/pedidos.js` - Rotas principais
- `backend/banco/conexao.js` - Conexão com banco
- `backend/middleware/autenticacao.js` - Autenticação
- `backend/rotas/carrinho.js` - Criação de pedidos

## 🔄 Integração

### Como os Pedidos são Criados
1. Usuário finaliza carrinho (`/api/carrinho/finalizar`)
2. Sistema cria pedido automaticamente
3. Itens são serializados em JSON
4. Carrinho é limpo
5. Pedido fica disponível para consulta

### Frontend Integration
```javascript
// Exemplo React
const { data: pedidos } = useFetch('/api/pedidos');
const { data: pedido } = useFetch(`/api/pedidos/${pedidoId}`);
```

## 📞 Suporte

- **Documentação Completa:** `DOCUMENTACAO_SISTEMA_PEDIDOS.md`
- **Testes:** `TESTE_COMPLETO_SISTEMA.md`
- **Issues:** Reportar problemas no repositório

---

**Última Atualização:** Janeiro 2025  
**Versão:** 1.0  
**Status:** ✅ Produção
