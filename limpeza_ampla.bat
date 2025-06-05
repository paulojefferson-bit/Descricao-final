@echo off
echo ========================================
echo LIMPEZA AMPLA DO PROJETO PARA GIT
echo ========================================
echo.

echo [1/8] Removendo pastas de documentacao temporaria...
if exist docs rmdir /s /q docs
if exist relatorios rmdir /s /q relatorios
echo   - Pasta docs/ removida
echo   - Pasta relatorios/ removida

echo.
echo [2/8] Removendo pasta de scripts de teste...
if exist scripts rmdir /s /q scripts
echo   - Pasta scripts/ removida (113+ arquivos)

echo.
echo [3/8] Removendo pasta de testes temporarios...
if exist tests rmdir /s /q tests
echo   - Pasta tests/ removida

echo.
echo [4/8] Removendo arquivos duplicados na raiz...
if exist README_MODO_TESTE.md del /q README_MODO_TESTE.md
if exist CODE_REVIEW_CHECKLIST.md del /q CODE_REVIEW_CHECKLIST.md
if exist PULL_REQUEST.md del /q PULL_REQUEST.md
if exist vite.config.js del /q vite.config.js
if exist PREPARACAO_GIT.md del /q PREPARACAO_GIT.md
if exist GUIA_GIT.md del /q GUIA_GIT.md
if exist limpar_projeto.bat del /q limpar_projeto.bat
echo   - Arquivos duplicados removidos

echo.
echo [5/8] Removendo arquivos de teste do frontend...
if exist frontend\index-teste.html del /q frontend\index-teste.html
if exist frontend\README.md del /q frontend\README.md
if exist frontend\.gitignore del /q frontend\.gitignore
echo   - Arquivos de teste do frontend removidos

echo.
echo [6/8] Removendo arquivos sensiveis do backend...
if exist backend\.env del /q backend\.env
if exist backend\.gitignore del /q backend\.gitignore
if exist backend\logs rmdir /s /q backend\logs
echo   - Arquivo .env removido (CRITICO)
echo   - Logs do backend removidos

echo.
echo [7/8] Removendo node_modules e arquivos de build...
if exist node_modules rmdir /s /q node_modules
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist backend\node_modules rmdir /s /q backend\node_modules
if exist frontend\dist rmdir /s /q frontend\dist
if exist frontend\build rmdir /s /q frontend\build
if exist backend\dist rmdir /s /q backend\dist
if exist backend\build rmdir /s /q backend\build
echo   - node_modules removidos
echo   - Arquivos de build removidos

echo.
echo [8/8] Limpando caches e arquivos temporarios...
if exist .vite rmdir /s /q .vite
if exist frontend\.vite rmdir /s /q frontend\.vite
if exist .cache rmdir /s /q .cache
if exist frontend\.cache rmdir /s /q frontend\.cache
del /q *.tmp 2>nul
del /q *.bak 2>nul
del /q *.log 2>nul
echo   - Caches removidos
echo   - Arquivos temporarios removidos

echo.
echo ========================================
echo LIMPEZA CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo O projeto agora tem apenas os arquivos essenciais:
echo   - Codigo fonte (frontend/src/, backend/)
echo   - Arquivos de configuracao (package.json, vite.config.js)
echo   - Documentacao principal (README.md, LICENSE)
echo   - Configuracao Git (.gitignore, .gitattributes)
echo.
echo PROXIMOS PASSOS:
echo   1. git add .
echo   2. git commit -m "Versao limpa do projeto e-commerce"
echo   3. git push
echo.
echo IMPORTANTE: Lembre-se de criar um arquivo .env no backend 
echo antes de executar o projeto localmente!
echo.

pause
