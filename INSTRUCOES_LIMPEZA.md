# 🧹 INSTRUÇÕES DE LIMPEZA FINAL

## SITUAÇÃO ATUAL:
- **350 arquivos** no projeto (27.88 MB)
- **190+ arquivos desnecessários** para o Git (scripts, docs, tests)
- Após limpeza: **~160 arquivos essenciais** restantes

## PASSOS PARA LIMPEZA COMPLETA:

### 1️⃣ Execute o Script de Limpeza
```cmd
limpeza_ampla.bat
```

### 2️⃣ Verifique o Resultado
Após a limpeza, você deve ter apenas:
- Código fonte (frontend/src/, backend/)
- Configurações (package.json, vite.config.js, etc.)
- Documentação essencial (README.md, LICENSE)

### 3️⃣ Envie para o Git
```bash
git add .
git commit -m "Versão limpa do projeto e-commerce com correção do carrinho"
git push
```

### 4️⃣ Para Desenvolver Localmente (após clonar)
```bash
# 1. Frontend
cd frontend
npm install
npm run dev

# 2. Backend (nova aba do terminal)
cd backend
npm install

# 3. Criar arquivo .env no backend com:
# DB_HOST=localhost
# DB_USER=seu_usuario
# DB_PASS=sua_senha
# DB_NAME=seu_banco
# JWT_SECRET=sua_chave_secreta

npm start
```

## ✅ BENEFÍCIOS DA LIMPEZA:
- Repositório **80% menor**
- Clone **muito mais rápido**
- Sem arquivos sensíveis (`.env`)
- Estrutura **profissional**
- Pronto para **produção**

## ⚠️ ÚLTIMO LEMBRETE:
O arquivo `.env` do backend será removido (por segurança). Você precisará recriá-lo com suas configurações locais após clonar o repositório.

---
**Execute `limpeza_ampla.bat` quando estiver pronto!**
