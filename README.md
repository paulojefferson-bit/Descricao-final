# Sistema E-commerce FGT

Sistema completo de e-commerce com frontend React e backend Node.js/Express.

## 🗂️ Estrutura do Projeto

```
projetofgt/
├── frontend/           # Aplicação React
├── backend/           # API Node.js/Express
├── docs/              # Documentação completa
├── scripts/           # Scripts de utilitários e testes
├── relatorios/        # Relatórios de desenvolvimento
├── logs/              # Logs do sistema
└── tests/             # Testes automatizados
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- MySQL 8.0+
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd projetofgt
```

2. **Instale as dependências**
```bash
# Dependências raiz
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configure o banco de dados**
   - Consulte `docs/GUIA_INSTALACAO_COMPLETO.md` para configuração detalhada
   - Execute os scripts SQL em `scripts/`

4. **Inicie o sistema**
```bash
# Na raiz do projeto
npm run dev
```

## 📚 Documentação

- **Instalação Completa**: `docs/GUIA_INSTALACAO_COMPLETO.md`
- **Manual de APIs**: `docs/MANUAL_APIS_COMPLETO.md`
- **Troubleshooting**: `docs/GUIA_TROUBLESHOOTING_COMPLETO.md`
- **Sistema de Pedidos**: `docs/SISTEMA_PEDIDOS_COMPLETO.md`

## 🛠️ Scripts Úteis

### Desenvolvimento
```bash
npm run dev          # Inicia frontend e backend
npm run build        # Build de produção
npm run test         # Executa testes
```

### Utilitários (pasta scripts/)
- `iniciar_sistema.ps1` - Inicia o sistema completo
- `teste_completo.ps1` - Executa todos os testes
- `limpar_backend.ps1` - Limpa dados de teste

## 🏗️ Tecnologias

### Frontend
- React 18
- Vite
- React Router
- Axios
- CSS Modules

### Backend
- Node.js
- Express.js
- MySQL
- JWT
- bcrypt
- multer

## 📊 Status do Projeto

✅ **Frontend**: Sistema de produtos, carrinho e checkout funcionais  
✅ **Backend**: APIs completas com autenticação e autorização  
✅ **Database**: Estrutura normalizada e otimizada  
✅ **Testes**: Cobertura de casos principais  

## 🐛 Problemas Conhecidos

- ✅ **TypeError toFixed()**: Corrigido em todos os componentes
- ✅ **CORS**: Configurado para desenvolvimento e produção
- ✅ **Rate Limiting**: Implementado e testado

## 📝 Logs e Relatórios

- **Logs do sistema**: `logs/`
- **Relatórios de desenvolvimento**: `relatorios/`
- **Documentação de correções**: `docs/RELATORIO_*.md`

## 🤝 Contribuição

1. Consulte a documentação em `docs/`
2. Execute os testes antes de submeter: `npm run test`
3. Mantenha o código limpo e bem documentado

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

---

Para mais informações detalhadas, consulte a documentação na pasta `docs/`.