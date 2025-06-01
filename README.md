# 🏪 Loja de Tênis - Projeto Completo Front + Back

Sistema completo de e-commerce para loja de tênis desenvolvido com **React + Vite** (frontend) e **Node.js + Express + MySQL** (backend).

## 🎯 Funcionalidades

### 🖥️ Frontend (React + Vite)
- ⚛️ Interface moderna e responsiva
- 🛒 Sistema de carrinho de compras
- 🔍 Filtros e busca de produtos
- 📱 Design mobile-first
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
