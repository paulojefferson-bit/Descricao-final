# 🛡️ INSTRUÇÕES PARA RESTAURAR SEGURANÇA

## ⚠️ IMPORTANTE: MODO DE TESTE ATIVO
O servidor está atualmente rodando em **MODO DE TESTE** com os seguintes mecanismos de segurança **DESABILITADOS**:

### Desabilitado para testes:
- ❌ **Helmet** (Content Security Policy)
- ❌ **Rate Limiting** (limitação de requisições)
- ❌ **CORS restritivo** (permite qualquer origem)
- ❌ **Compression**
- ❌ **Logging detalhado**

### Para RESTAURAR a segurança:

1. **Abra o arquivo `servidor.js`**

2. **Descomente as seções marcadas com comentários de desabilitação:**

```javascript
// Restaurar Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      connectSrc: ["'self'"],
    },
  },
}));

// Restaurar CORS restritivo
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://127.0.0.1:5500',
    'null'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Restaurar Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    sucesso: false,
    mensagem: 'Muitas tentativas. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

3. **Remover a configuração de teste:**
   - Substitua `origin: true` por `origin: [lista de origens]`
   - Descomente as linhas de helmet, rate limiting, etc.

4. **Reiniciar o servidor**

### 🚨 NÃO ESQUECER:
- **NUNCA** usar a configuração atual em produção
- **SEMPRE** restaurar a segurança após os testes
- Este modo permite **QUALQUER ORIGEM** acessar a API

### Data de desabilitação: 4 de junho de 2025
### Responsável: Modo de teste para depuração CORS
