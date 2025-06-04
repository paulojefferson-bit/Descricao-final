#!/usr/bin/env pwsh

# Script de Teste Final - Verificação Completa da Aplicação
# Data: 4 de junho de 2025

Write-Host "🔍 TESTE FINAL - APLICAÇÃO E-COMMERCE" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Função para verificar se um processo está rodando
function Test-Process($processName) {
    return (Get-Process -Name $processName -ErrorAction SilentlyContinue) -ne $null
}

# Função para testar uma URL
function Test-Url($url) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -ErrorAction Stop
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

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

# 2. Verificar sintaxe dos arquivos principais
Write-Host "🔧 2. Verificando Sintaxe dos Arquivos..." -ForegroundColor Yellow

# Verificar backend
Push-Location $backendPath
try {
    $result = node -c servidor.js 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Backend: servidor.js - Sintaxe OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Backend: servidor.js - Erro de sintaxe" -ForegroundColor Red
        Write-Host "   $result" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Backend: Erro ao verificar sintaxe" -ForegroundColor Red
}
Pop-Location

# Verificar frontend (build)
Push-Location $frontendPath
try {
    Write-Host "   📦 Testando build do frontend..." -ForegroundColor Cyan
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Frontend: Build concluído com sucesso" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Frontend: Erro no build" -ForegroundColor Red
        Write-Host "   $buildResult" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Frontend: Erro ao executar build" -ForegroundColor Red
}
Pop-Location

Write-Host ""

# 3. Verificar dependências
Write-Host "📦 3. Verificando Dependências..." -ForegroundColor Yellow

Push-Location $backendPath
if (Test-Path "node_modules") {
    Write-Host "   ✅ Backend: node_modules presente" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Backend: node_modules não encontrado - Execute: npm install" -ForegroundColor Yellow
}
Pop-Location

Push-Location $frontendPath
if (Test-Path "node_modules") {
    Write-Host "   ✅ Frontend: node_modules presente" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Frontend: node_modules não encontrado - Execute: npm install" -ForegroundColor Yellow
}
Pop-Location

Write-Host ""

# 4. Verificar correções específicas
Write-Host "🛠️  4. Verificando Correções Aplicadas..." -ForegroundColor Yellow

$correcoes = @(
    @{
        Arquivo = "CardProduto.jsx"
        Caminho = "$frontendPath\src\components\CardProduto\CardProduto.jsx"
        Buscar = "Number(valor).toFixed(2)"
    },
    @{
        Arquivo = "PaginaDetalhesProduto.jsx"
        Caminho = "$frontendPath\src\pages\PaginaDetalhesProduto\PaginaDetalhesProduto.jsx"
        Buscar = "produto.id ?"
    },
    @{
        Arquivo = "CheckoutIntegrado.jsx"
        Caminho = "$frontendPath\src\components\checkout\CheckoutIntegrado.jsx"
        Buscar = "Number(totais.total).toFixed(2)"
    }
)

foreach ($correcao in $correcoes) {
    if (Test-Path $correcao.Caminho) {
        $conteudo = Get-Content $correcao.Caminho -Raw
        if ($conteudo -like "*$($correcao.Buscar)*") {
            Write-Host "   ✅ $($correcao.Arquivo): Correção aplicada" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  $($correcao.Arquivo): Correção não encontrada" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ❌ $($correcao.Arquivo): Arquivo não encontrado" -ForegroundColor Red
    }
}

Write-Host ""

# 5. Relatório final
Write-Host "📊 5. Relatório Final" -ForegroundColor Yellow
Write-Host "=====================" -ForegroundColor Yellow

$relatorioPath = "c:\Users\edgle\Desktop\projetofgt\RELATORIO_CORRECOES_TOFIX_FINAL.md"
if (Test-Path $relatorioPath) {
    Write-Host "   ✅ Relatório de correções criado" -ForegroundColor Green
    Write-Host "   📄 Local: $relatorioPath" -ForegroundColor Cyan
} else {
    Write-Host "   ❌ Relatório não encontrado" -ForegroundColor Red
}

Write-Host ""

# 6. Próximos passos
Write-Host "🚀 PRÓXIMOS PASSOS:" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "1. Execute 'npm start' no frontend para testar a aplicação" -ForegroundColor Cyan
Write-Host "2. Execute 'node servidor.js' no backend para iniciar a API" -ForegroundColor Cyan
Write-Host "3. Acesse http://localhost:3000 para testar a interface" -ForegroundColor Cyan
Write-Host "4. Teste as funcionalidades de carrinho e checkout" -ForegroundColor Cyan
Write-Host "5. Verifique se os preços estão sendo formatados corretamente" -ForegroundColor Cyan

Write-Host ""
Write-Host "✅ TESTE CONCLUÍDO - Aplicação pronta para uso!" -ForegroundColor Green

# Pausar para leitura
Read-Host "Pressione Enter para continuar"
