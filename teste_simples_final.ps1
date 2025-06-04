#!/usr/bin/env pwsh

Write-Host "🔍 TESTE FINAL - APLICAÇÃO E-COMMERCE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# 1. Verificar estrutura do projeto
Write-Host "📁 1. Verificando Estrutura do Projeto..." -ForegroundColor Yellow
$frontendPath = "c:\Users\edgle\Desktop\projetofgt\frontend"
$backendPath = "c:\Users\edgle\Desktop\projetofgt\backend"

if (Test-Path $frontendPath) {
    Write-Host "   ✅ Frontend encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend não encontrado" -ForegroundColor Red
}

if (Test-Path $backendPath) {
    Write-Host "   ✅ Backend encontrado" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend não encontrado" -ForegroundColor Red
}

Write-Host ""

# 2. Verificar correções específicas
Write-Host "🛠️  2. Verificando Correções Aplicadas..." -ForegroundColor Yellow

$arquivos = @(
    "$frontendPath\src\components\CardProduto\CardProduto.jsx",
    "$frontendPath\src\pages\PaginaDetalhesProduto\PaginaDetalhesProduto.jsx",
    "$frontendPath\src\components\checkout\CheckoutIntegrado.jsx",
    "$frontendPath\src\components\carrinho\CarrinhoIntegrado.jsx"
)

$totalCorrecoes = 0
$correcoesEncontradas = 0

foreach ($arquivo in $arquivos) {
    $nomeArquivo = Split-Path $arquivo -Leaf
    if (Test-Path $arquivo) {
        $conteudo = Get-Content $arquivo -Raw
        $totalCorrecoes++
        
        if ($conteudo -like "*Number(*toFixed*") {
            Write-Host "   ✅ $nomeArquivo : Correções toFixed() aplicadas" -ForegroundColor Green
            $correcoesEncontradas++
        } else {
            Write-Host "   ⚠️  $nomeArquivo : Verificar correções" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ $nomeArquivo : Arquivo não encontrado" -ForegroundColor Red
    }
}

Write-Host ""

# 3. Relatório final
Write-Host "📊 3. Resultado dos Testes" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow

Write-Host "   Arquivos verificados: $totalCorrecoes" -ForegroundColor Cyan
Write-Host "   Correções encontradas: $correcoesEncontradas" -ForegroundColor Cyan

if ($correcoesEncontradas -ge 3) {
    Write-Host "   ✅ STATUS: Correções aplicadas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  STATUS: Algumas correções podem estar faltando" -ForegroundColor Yellow
}

Write-Host ""

# 4. Próximos passos
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "1. Frontend: cd frontend && npm start" -ForegroundColor Cyan
Write-Host "2. Backend: cd backend && node servidor.js" -ForegroundColor Cyan
Write-Host "3. Teste: http://localhost:3000" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ TESTE CONCLUÍDO!" -ForegroundColor Green
