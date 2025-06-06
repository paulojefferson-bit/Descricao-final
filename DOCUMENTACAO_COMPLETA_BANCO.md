# DOCUMENTAÇÃO COMPLETA DO BANCO DE DADOS - PROJETO FGT

## RESUMO EXECUTIVO
Este documento detalha a estrutura completa do banco de dados do sistema de e-commerce, incluindo todas as tabelas, relacionamentos e funcionalidades implementadas.

**Database:** `projetofgt`  
**Total de Tabelas:** 13  
**Sistema de Comentários:** ✅ IMPLEMENTADO E FUNCIONAL  
**Sistema de Hierarquia:** ✅ IMPLEMENTADO (visitante → usuario → colaborador → supervisor → diretor)  

---

## TABELAS PRINCIPAIS

### 1. TABELA: `usuarios` (68 registros)
**Responsabilidade:** Gestão de usuários e sistema de hierarquia

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | Chave primária |
| nome | varchar(255) | Nome completo do usuário |
| email | varchar(255) | Email único |
| senha_hash | varchar(255) | Senha criptografada |
| tipo_usuario | enum | Tipo principal: visitante, usuario, colaborador, supervisor, diretor |
| tipo | enum | Tipo secundário (compatibilidade) |
| status | enum | Status: ativo, inativo, bloqueado |
| aceite_lgpd | tinyint(1) | Aceite da LGPD |
| data_criacao | timestamp | Data de criação |
| ultimo_login | timestamp | Último acesso |

**Hierarquia de Usuários:**
- **visitante** - Acesso básico
- **usuario** - Usuário padrão (pode fazer compras e comentários)
- **colaborador** - Funcionário básico
- **supervisor** - Gerente de área
- **diretor** - Acesso total ao dashboard

### 2. TABELA: `produtos` (45 registros)
**Responsabilidade:** Catálogo de produtos

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | Chave primária |
| marca | varchar(100) | Marca do produto |
| nome | varchar(255) | Nome do produto |
| preco_atual | decimal(10,2) | Preço atual |
| preco_antigo | decimal(10,2) | Preço anterior |
| desconto | int | Percentual de desconto |
| categoria | varchar(50) | Categoria do produto |
| genero | enum | masculino, feminino, unissex |
| quantidade_estoque | int | Quantidade disponível |

### 3. TABELA: `comentarios_produtos` (6 registros) ⭐ SISTEMA PRINCIPAL
**Responsabilidade:** Sistema de comentários com verificação de compra

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | Chave primária |
| usuario_id | int | FK para usuarios |
| produto_id | int | FK para produtos |
| comentario | text | Texto do comentário |
| avaliacao | tinyint | Nota de 1 a 5 |
| compra_verificada | tinyint(1) | Se o usuário comprou o produto |
| data_criacao | timestamp | Data de criação |
| ativo | tinyint(1) | Se está ativo |

**REGRA CRÍTICA:** Apenas usuários que fizeram compras confirmadas podem comentar.

---

## SISTEMA DE PEDIDOS

### 4. TABELA: `pedidos_simples` (20 registros)
**Responsabilidade:** Pedidos principais do sistema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | varchar(50) | ID único do pedido |
| usuario_id | int | FK para usuarios |
| valor_total | decimal(10,2) | Valor total |
| status_pedido | varchar(20) | Status do pedido |
| itens_json | text | Itens em formato JSON |

### 5. TABELA: `pedidos` (4 registros)
**Responsabilidade:** Sistema de pedidos estruturado

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | Chave primária |
| usuario_id | int | FK para usuarios |
| valor_total | decimal(10,2) | Valor total |
| status_pedido | enum | pendente, confirmado, preparando, enviado, entregue, cancelado |
| forma_pagamento | varchar(50) | Forma de pagamento |

### 6. TABELA: `itens_pedido` (4 registros)
**Responsabilidade:** Itens dos pedidos estruturados

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | int | Chave primária |
| pedido_id | int | FK para pedidos |
| produto_id | int | FK para produtos |
| quantidade | int | Quantidade |
| preco_unitario | decimal(10,2) | Preço unitário |

---

## TABELAS DE SUPORTE

### 7. TABELA: `carrinho` (15 registros)
**Responsabilidade:** Carrinho de compras

### 8. TABELA: `enderecos_usuarios` (23 registros)
**Responsabilidade:** Endereços de entrega

### 9. TABELA: `avaliacoes_produtos` (4 registros)
**Responsabilidade:** Sistema de avaliações (diferente dos comentários)

### 10. TABELA: `promocoes_relampago` (7 registros)
**Responsabilidade:** Promoções especiais

### 11. TABELA: `consentimentos_lgpd` (5 registros)
**Responsabilidade:** Conformidade LGPD

### 12. TABELA: `log_acoes` (0 registros)
**Responsabilidade:** Log de ações dos usuários

### 13. TABELA: `logs_sistema` (0 registros)
**Responsabilidade:** Logs do sistema

---

## VERIFICAÇÃO DE PERMISSÕES - SISTEMA DE COMENTÁRIOS

### LÓGICA IMPLEMENTADA:
1. **Verificação de Compra:** O sistema verifica se o usuário tem pedidos confirmados
2. **Busca em JSON:** Utiliza `JSON_CONTAINS` para verificar se o produto está nos itens do pedido
3. **Conversão de Tipos:** ⚠️ **CRÍTICO** - `produtoId` deve ser convertido de string para number
4. **Status Válidos:** `confirmado`, `preparando`, `enviado`, `entregue`

### CÓDIGO FUNCIONAL:
```javascript
// Em backend/rotas/comentarios.js
const produtoIdNumero = parseInt(produtoId, 10); // CONVERSÃO ESSENCIAL
await Comentario.podeAvaliar(usuarioId, produtoIdNumero);
```

### QUERY DO BANCO:
```sql
SELECT COUNT(*) as count 
FROM pedidos_simples 
WHERE usuario_id = ? 
  AND status_pedido IN ('confirmado', 'preparando', 'enviado', 'entregue')
  AND JSON_CONTAINS(itens_json, JSON_OBJECT('produto_id', ?), '$')
```

---

## CONFIGURAÇÕES DO BANCO

### Conexão (backend/banco/conexao.js):
```javascript
host: 'localhost',
user: 'root',
password: '1234',
database: 'projetofgt',
port: 3306
```

### Índices Importantes:
- `usuarios.email` (UNIQUE)
- `comentarios_produtos.unique_usuario_produto` (UNIQUE)
- `produtos.categoria`, `produtos.marca`, `produtos.genero`
- `pedidos.status_pedido`, `pedidos.usuario_id`

---

## STATUS ATUAL DO SISTEMA

### ✅ FUNCIONALIDADES IMPLEMENTADAS:
1. **Sistema de Usuários:** Hierarquia completa funcionando
2. **Sistema de Produtos:** Catálogo completo com 45 produtos
3. **Sistema de Pedidos:** Dois sistemas (simples e estruturado)
4. **Sistema de Comentários:** FUNCIONAL após correção de tipos
5. **Verificação de Compra:** Implementada e testada
6. **Dashboard do Diretor:** Acessível para tipo_usuario = 'diretor'

### ⚠️ QUESTÕES IDENTIFICADAS:
1. **Duplicação de Campo Tipo:** Existem `tipo` e `tipo_usuario` na tabela usuarios
2. **Dois Sistemas de Pedidos:** `pedidos` e `pedidos_simples` (principal é o simples)
3. **Logs Vazios:** Tabelas de log não estão sendo populadas

### 🔧 CORREÇÕES REALIZADAS:
1. **Bug de Tipo:** Conversão string→number em comentários (RESOLVIDO)
2. **Configuração DB:** Senha e nome do banco corrigidos
3. **Rotas:** Registro de rotas de comentários adicionado
4. **Debug:** Sistema de debug implementado e testado

---

## EXEMPLO DE FLUXO COMPLETO

### 1. Usuário se Registra:
```sql
INSERT INTO usuarios (nome, email, senha_hash, tipo_usuario, tipo) 
VALUES ('João', 'joao@email.com', '$2b$12$...', 'usuario', 'usuario');
```

### 2. Usuário Faz Pedido:
```sql
INSERT INTO pedidos_simples (id, usuario_id, valor_total, status_pedido, itens_json)
VALUES ('PED-123', 10, 499.99, 'confirmado', '[{"produto_id":1,...}]');
```

### 3. Usuário Pode Comentar:
```javascript
// Verificação automática via JSON_CONTAINS
const podeAvaliar = await Comentario.podeAvaliar(10, 1); // true
```

### 4. Comentário é Criado:
```sql
INSERT INTO comentarios_produtos (usuario_id, produto_id, comentario, avaliacao, compra_verificada)
VALUES (10, 1, 'Excelente produto!', 5, 1);
```

---

## CONCLUSÃO

O sistema está **FUNCIONAL** e **COMPLETO**. A estrutura do banco suporta todas as funcionalidades requeridas:

- ✅ Sistema de hierarquia de usuários
- ✅ Sistema de comentários com verificação de compra
- ✅ Controle de permissões
- ✅ Dashboard diferenciado para diretores
- ✅ Compliance LGPD
- ✅ Sistema de logs (estrutura pronta)

**Data da Análise:** Junho 2025  
**Status:** Sistema em produção e operacional
