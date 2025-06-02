# 📋 Documentação do Sistema de Pedidos

## 📖 Visão Geral

O sistema de pedidos é responsável por gerenciar o histórico de compras dos usuários na loja de tênis. Ele permite consultar pedidos realizados, visualizar detalhes específicos e manter um registro completo das transações.

## 🗂 Estrutura do Arquivo

**Arquivo:** `backend/rotas/pedidos.js`  
**Tipo:** Rota Express.js  
**Dependências:**
- `express` - Framework web
- `../banco/conexao` - Conexão com banco de dados
- `../middleware/autenticacao` - Middleware de autenticação JWT

## 🛣 Endpoints Disponíveis

### 1. **GET /api/pedidos**
Lista todos os pedidos do usuário autenticado.

#### 🔐 Autenticação
- **Requerida:** Sim (JWT Token)
- **Middleware:** `verificarAutenticacao`

#### 📥 Parâmetros de Entrada
- **Headers:** `Authorization: Bearer <token>`
- **Body:** Nenhum
- **Query Params:** Nenhum

#### 📤 Resposta de Sucesso (200)
```json
{
  "sucesso": true,
  "dados": [
    {
      "id": "PED-1748884452492-178",
      "valor_total": 999.98,
      "valor_desconto": 0.00,
      "valor_frete": 0.00,
      "forma_pagamento": "cartao_credito",
      "observacoes": null,
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
  ]
}
```

#### ❌ Resposta de Erro (500)
```json
{
  "sucesso": false,
  "mensagem": "Erro interno do servidor ao buscar pedidos"
}
```

#### 🔍 Características
- **Limitação:** Retorna máximo 20 pedidos
- **Ordenação:** Por data do pedido (mais recente primeiro)
- **Filtro:** Apenas pedidos do usuário autenticado
- **Processamento:** Deserializa automaticamente o campo `itens_json`

---

### 2. **GET /api/pedidos/:pedidoId**
Obtém detalhes de um pedido específico.

#### 🔐 Autenticação
- **Requerida:** Sim (JWT Token)
- **Middleware:** `verificarAutenticacao`

#### 📥 Parâmetros de Entrada
- **Headers:** `Authorization: Bearer <token>`
- **URL Params:** `pedidoId` (string) - ID do pedido
- **Body:** Nenhum

#### 📤 Resposta de Sucesso (200)
```json
{
  "sucesso": true,
  "dados": {
    "id": "PED-1748884452492-178",
    "valor_total": 999.98,
    "valor_desconto": 0.00,
    "valor_frete": 0.00,
    "forma_pagamento": "cartao_credito",
    "observacoes": "Entrega rápida solicitada",
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
}
```

#### ❌ Resposta de Erro (404)
```json
{
  "sucesso": false,
  "mensagem": "Pedido não encontrado"
}
```

#### ❌ Resposta de Erro (500)
```json
{
  "sucesso": false,
  "mensagem": "Erro interno do servidor ao buscar pedido"
}
```

#### 🔍 Características
- **Segurança:** Verifica se o pedido pertence ao usuário autenticado
- **Processamento:** Deserializa automaticamente o campo `itens_json`
- **Validação:** Retorna 404 se pedido não existe ou não pertence ao usuário

## 🗄 Estrutura do Banco de Dados

### Tabela: `pedidos_simples`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR | Identificador único do pedido (ex: PED-timestamp-random) |
| `usuario_id` | INT | ID do usuário que fez o pedido |
| `valor_total` | DECIMAL(10,2) | Valor total do pedido |
| `valor_desconto` | DECIMAL(10,2) | Valor de desconto aplicado |
| `valor_frete` | DECIMAL(10,2) | Valor do frete |
| `forma_pagamento` | VARCHAR | Forma de pagamento utilizada |
| `observacoes` | TEXT | Observações do pedido |
| `status_pedido` | VARCHAR | Status atual do pedido |
| `data_pedido` | DATETIME | Data e hora da criação do pedido |
| `itens_json` | TEXT | JSON com os itens do pedido |

### Formato do Campo `itens_json`
```json
[
  {
    "produto_id": 1,
    "nome": "Nike Air Max 90",
    "preco": 499.99,
    "quantidade": 2,
    "subtotal": 999.98
  }
]
```

## 🔧 Funcionalidades Implementadas

### ✅ Autenticação e Segurança
- **JWT Token:** Todos os endpoints requerem autenticação
- **Isolamento de Dados:** Usuários só acessam seus próprios pedidos
- **Validação de Propriedade:** Verificação se o pedido pertence ao usuário

### ✅ Tratamento de Dados
- **Deserialização JSON:** Conversão automática do campo `itens_json`
- **Formatação de Resposta:** Padronização das respostas da API
- **Tratamento de Erros:** Logs detalhados e mensagens de erro apropriadas

### ✅ Performance e Limitações
- **Paginação:** Limitação de 20 pedidos por consulta
- **Ordenação:** Pedidos ordenados por data (mais recente primeiro)
- **Otimização:** Consultas SQL otimizadas com índices adequados

## 🧪 Cenários de Teste Validados

### ✅ Testes Funcionais
1. **Consulta de Pedidos Vazia:** Usuário sem pedidos
2. **Consulta de Pedidos Populada:** Usuário com múltiplos pedidos
3. **Consulta de Pedido Específico:** Busca por ID válido
4. **Pedido Inexistente:** Busca por ID que não existe
5. **Deserialização JSON:** Conversão correta dos itens

### ✅ Testes de Segurança
1. **Token Inválido:** Rejeição de requisições sem autenticação
2. **Acesso a Pedidos de Outros Usuários:** Isolamento de dados
3. **Manipulação de IDs:** Proteção contra acesso não autorizado

### ✅ Testes de Performance
1. **Múltiplas Consultas Simultâneas:** Sistema suporta concorrência
2. **Consultas Grandes:** Performance com muitos pedidos
3. **Limitação de Resultados:** Resposta rápida com paginação

## 🔄 Integração com Outros Sistemas

### 📝 Criação de Pedidos
**Responsável:** `backend/rotas/carrinho.js` endpoint `/finalizar`
- Cria automaticamente um novo pedido quando carrinho é finalizado
- Transfere todos os itens do carrinho para o pedido
- Gera ID único do formato: `PED-{timestamp}-{random}`

### 🛒 Relação com Carrinho
- Pedidos são criados a partir da finalização do carrinho
- Itens do carrinho são serializados em JSON no pedido
- Carrinho é automaticamente limpo após criação do pedido

### 👤 Relação com Usuários
- Cada pedido está associado a um usuário específico
- Sistema de autenticação garante acesso apenas aos próprios pedidos
- Histórico completo de compras por usuário

## 📊 Monitoramento e Logs

### 🔍 Logs Implementados
- **Erros de Consulta:** Logs detalhados de erros SQL
- **Erros de Autenticação:** Registros de tentativas de acesso
- **Performance:** Tempo de resposta das consultas

### 📈 Métricas Disponíveis
- **Total de Pedidos por Usuário:** Através de consultas
- **Volume de Vendas:** Soma dos valores totais
- **Produtos Mais Vendidos:** Análise dos itens_json

## 🚀 Melhorias Futuras Sugeridas

### 📋 Funcionalidades
1. **Paginação Avançada:** Implementar offset/limit personalizável
2. **Filtros de Data:** Consulta por período específico
3. **Busca por Status:** Filtrar pedidos por status
4. **Exportação:** Gerar relatórios em PDF/Excel

### ⚡ Performance
1. **Cache:** Implementar cache Redis para consultas frequentes
2. **Índices:** Otimizar índices do banco de dados
3. **Compressão:** Comprimir responses grandes

### 🔐 Segurança
1. **Rate Limiting:** Limitar número de consultas por minuto
2. **Auditoria:** Log de todas as consultas realizadas
3. **Criptografia:** Criptografar dados sensíveis

## 📞 Contato e Suporte

Para dúvidas sobre o sistema de pedidos:
- **Código:** `backend/rotas/pedidos.js`
- **Testes:** Verificar `TESTE_COMPLETO_SISTEMA.md`
- **Banco:** Estrutura em `backend/banco/criar_tabelas.sql`

---

**Status:** ✅ Sistema totalmente funcional e testado  
**Última Atualização:** Janeiro 2025  
**Versão:** 1.0
