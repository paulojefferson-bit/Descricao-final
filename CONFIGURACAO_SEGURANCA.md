# CONFIGURAÇÃO DE SEGURANÇA - MODO DESENVOLVIMENTO vs PRODUÇÃO

## STATUS ATUAL: MODO DESENVOLVIMENTO 🔧

Este arquivo documenta as configurações de segurança que estão **DESABILITADAS** durante o desenvolvimento e como reabilitá-las para produção.

---

## RECURSOS DE SEGURANÇA DESABILITADOS PARA TESTES

### 1. JWT (JSON Web Tokens)
**Status:** ⚠️ DESABILITADO/SIMPLIFICADO
**Motivo:** Facilitar testes sem necessidade de autenticação completa
**Local:** `backend/middleware/auth.js` ou rotas protegidas

**Para REABILITAR em produção:**
```javascript
// Criar arquivo .env
JWT_SECRET=sua_chave_secreta_super_forte_aqui_123456789

// No código (exemplo):
const jwt = require('jsonwebtoken');
const verificarToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }
    // Verificar e decodificar token...
};
```

### 2. bcrypt (Hash de Senhas)
**Status:** ⚠️ SIMPLIFICADO
**Motivo:** Senhas podem estar em texto simples para testes
**Local:** `backend/modelos/Usuario.js`

**Para REABILITAR em produção:**
```javascript
const bcrypt = require('bcrypt');

// Ao criar usuário:
const senhaHash = await bcrypt.hash(senha, 12);

// Ao verificar login:
const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
```

### 3. Helmet (Headers de Segurança)
**Status:** ⚠️ DESABILITADO
**Motivo:** Headers de segurança relaxados para desenvolvimento
**Local:** `backend/servidor.js`

**Para REABILITAR em produção:**
```javascript
const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"]
        }
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));
```

### 4. CORS (Cross-Origin Resource Sharing)
**Status:** ⚠️ PERMISSIVO
**Motivo:** Aceita qualquer origem para desenvolvimento
**Local:** `backend/servidor.js`

**Para REABILITAR em produção:**
```javascript
const cors = require('cors');
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://seudominio.com',
    credentials: true,
    optionsSuccessStatus: 200
}));
```

### 5. Rate Limiting
**Status:** ⚠️ DESABILITADO
**Motivo:** Sem limite de requisições para testes

**Para REABILITAR em produção:**
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 requisições por IP
    message: 'Muitas tentativas, tente novamente em 15 minutos'
});
app.use('/api/', limiter);
```

### 6. Validação de Input
**Status:** ⚠️ SIMPLIFICADA
**Motivo:** Validações básicas apenas

**Para REABILITAR em produção:**
```javascript
const { body, validationResult } = require('express-validator');

const validarComentario = [
    body('comentario').isLength({ min: 10, max: 500 }).trim().escape(),
    body('avaliacao').isInt({ min: 1, max: 5 }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
```

---

## CHECKLIST PARA PRODUÇÃO 🚀

### ✅ ANTES DE DEPLOY:

1. **[ ]** Criar arquivo `.env` com variáveis seguras:
   ```bash
   JWT_SECRET=chave_super_secreta_256_bits
   DB_PASSWORD=senha_forte_banco
   SESSION_SECRET=outra_chave_secreta
   NODE_ENV=production
   ```

2. **[ ]** Reabilitar autenticação JWT completa
3. **[ ]** Ativar hash bcrypt para senhas (salt rounds 12+)
4. **[ ]** Configurar Helmet com políticas restritivas
5. **[ ]** Restringir CORS apenas para domínios autorizados
6. **[ ]** Implementar rate limiting
7. **[ ]** Adicionar validação rigorosa de inputs
8. **[ ]** Configurar logs de segurança
9. **[ ]** Ativar HTTPS/SSL
10. **[ ]** Configurar variáveis de ambiente seguras

### 🔧 CONFIGURAÇÕES INTERMEDIÁRIAS (STAGING):

1. **[ ]** Testar com autenticação ativada
2. **[ ]** Validar todos os endpoints protegidos
3. **[ ]** Testar rate limiting
4. **[ ]** Verificar logs de segurança
5. **[ ]** Testar CORS restritivo

---

## COMANDOS ÚTEIS PARA SEGURANÇA

### Instalar dependências de segurança:
```bash
npm install helmet bcrypt jsonwebtoken express-rate-limit express-validator cors
```

### Verificar vulnerabilidades:
```bash
npm audit
npm audit fix
```

### Testar configurações:
```bash
# Verificar headers de segurança
curl -I http://localhost:5000/api/health

# Testar rate limiting
for i in {1..110}; do curl http://localhost:5000/api/health; done
```

---

## STATUS ATUAL DO SISTEMA ✅

### FUNCIONALIDADES TESTADAS E APROVADAS:

1. **✅ Sistema de Comentários:** FUNCIONAL
   - Verificação de compra implementada
   - Apenas usuários que compraram podem comentar
   - Conversão de tipos corrigida (string → number)

2. **✅ Sistema de Hierarquia:** FUNCIONAL
   - 5 níveis: visitante → usuario → colaborador → supervisor → diretor
   - 68 usuários cadastrados com diferentes níveis
   - Dashboard diferenciado funcionando

3. **✅ Banco de Dados:** OPERACIONAL
   - 13 tabelas documentadas
   - 20 pedidos confirmados
   - 6 comentários com compra verificada
   - Índices e relacionamentos corretos

4. **✅ API Endpoints:** FUNCIONAIS
   - Health check: OK
   - Comentários: 4 encontrados para produto 1
   - Verificação manual: 16 usuários com pedidos

### PRONTO PARA PRODUÇÃO APÓS:
- Ativação das configurações de segurança listadas acima
- Testes com autenticação completa
- Configuração de variáveis de ambiente seguras

---

**Data:** Junho 2025  
**Modo:** DESENVOLVIMENTO (Segurança Relaxada)  
**Próximo Passo:** Implementar checklist de segurança para produção
