# 🏪 Loja de Tênis - Sistema Completo Frontend + Backend

![Status](https://img.shields.io/badge/Status-Produção-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18+-blue)
![MySQL](https://img.shields.io/badge/MySQL-8+-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

Sistema completo de e-commerce para loja de tênis com **frontend React** e **backend Node.js**, incluindo sistema de autenticação hierárquico, carrinho de compras, promoções relâmpago e compliance LGPD.

## 🚀 **Características Principais**

### ⚡ **Frontend (React + Vite)**
- ✅ Interface moderna e responsiva
- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras funcional
- ✅ Sistema de avaliações
- ✅ Páginas de cadastro e login
- ✅ Carrossel de ofertas
- ✅ Design UX/UI otimizado

### 🔧 **Backend (Node.js + Express)**
- ✅ API RESTful completa
- ✅ Autenticação JWT com níveis hierárquicos
- ✅ Sistema de permissões por usuário
- ✅ Rate limiting e segurança
- ✅ Compliance LGPD
- ✅ Logs de auditoria
- ✅ Promoções relâmpago

### 📊 **Banco de Dados (MySQL)**
- ✅ Estrutura otimizada e normalizada
- ✅ Índices para performance
- ✅ Sistema de logs para LGPD
- ✅ Backup e recuperação

## 👥 **Níveis de Usuário**

| Nível | Permissões |
|-------|------------|
| **Visitante** | Visualizar produtos e promoções |
| **Usuário** | Carrinho, compras, avaliações |
| **Colaborador** | Gerenciar produtos e estoque |
| **Supervisor** | Criar promoções relâmpago |
| **Diretor** | Acesso total + logs do sistema |
- 🎨 UI/UX otimizada

### 🔧 Backend (Node.js + Express)
- 🔐 **Sistema de autenticação JWT**
- 👥 **Diferentes níveis de acesso:**
  - Visitante (visualização)
  - Usuário (carrinho + compras)
  - Colaborador (gerenciar produtos)
  - Supervisor (promoções relâmpago)
  - Diretor (acesso total + logs)
- 🛡️ **Segurança:**
  - Rate limiting
  - Helmet para headers de segurança
  - Validação de dados
  - Logs de auditoria
- 📋 **Compliance LGPD**
- ⚡ **Promoções relâmpago**
- 🛒 **Sistema completo de carrinho**

## 🗄️ Banco de Dados

- **MySQL** com estrutura otimizada
- Tabelas: produtos, usuários, carrinho, promoções, logs, etc.
- Índices para performance
- Sistema de auditoria completo

## 🚀 Como Executar

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📋 Variáveis de Ambiente

Crie um arquivo `.env` no backend com:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=projetofgt
JWT_SECRET=sua_chave_secreta
```

## 🛠️ Tecnologias

### Frontend
- React 18
- Vite
- CSS Modules
- React Router

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- Helmet
- Rate Limiting

## 👨‍💻 Desenvolvido por

**FGT - Loja de Tênis**

---

⭐ **Sistema completo, seguro e pronto para produção!**
