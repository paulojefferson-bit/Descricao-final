@echo off
chcp 65001 >nul
echo 🧪 TESTES DO SISTEMA DE PEDIDOS - Windows Batch
echo =============================================
echo.

set BASE_URL=http://localhost:5000
set EMAIL=teste@carrinho.com
set SENHA=123456

echo 🔍 Verificando se o servidor está rodando...
curl -s %BASE_URL%/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Servidor não está rodando em %BASE_URL%
    echo 💡 Certifique-se de que o backend está rodando com: npm run dev
    pause
    exit /b 1
)
echo ✅ Servidor está rodando
echo.

echo 🔐 Fazendo login...
for /f "tokens=*" %%i in ('curl -s -X POST -H "Content-Type: application/json" -d "{\"email\":\"%EMAIL%\",\"senha\":\"%SENHA%\"}" %BASE_URL%/api/auth/login') do set LOGIN_RESPONSE=%%i

:: Extrair token (método simples para demo)
echo %LOGIN_RESPONSE% | findstr "token" >nul
if %errorlevel% neq 0 (
    echo ❌ Erro no login
    pause
    exit /b 1
)
echo ✅ Login realizado com sucesso
echo.

echo 📋 Testando listagem de pedidos...
echo Para teste completo, use o script PowerShell: teste_pedidos.ps1
echo.

echo 💡 COMANDOS DISPONÍVEIS:
echo.
echo 📋 Listar pedidos:
echo curl -H "Authorization: Bearer SEU_TOKEN" %BASE_URL%/api/pedidos
echo.
echo 🔍 Consultar pedido específico:
echo curl -H "Authorization: Bearer SEU_TOKEN" %BASE_URL%/api/pedidos/PED-ID-AQUI
echo.
echo 🚫 Testar pedido inexistente:
echo curl -H "Authorization: Bearer SEU_TOKEN" %BASE_URL%/api/pedidos/PED-INEXISTENTE
echo.
echo 🔐 Testar sem autenticação:
echo curl %BASE_URL%/api/pedidos
echo.

echo 🎯 Para testes completos e automatizados, execute:
echo PowerShell: .\teste_pedidos.ps1
echo Node.js: node teste_pedidos.js
echo.

pause
