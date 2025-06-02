# Teste Final do Sistema de Pedidos com Métricas
# Versão PowerShell Simplificada - Windows
# Data: 2025-06-02

Write-Host "🚀 TESTE FINAL DO SISTEMA DE PEDIDOS" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

$BASE_URL = "http://localhost:5000"
$USUARIO_TESTE = @{
    email = "teste@email.com"
    senha = "123456"
}

function Test-ApiEndpoint {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response; StatusCode = 200 }
    }
    catch {
        $errorResponse = $_.Exception.Response
        $statusCode = if ($errorResponse) { [int]$errorResponse.StatusCode } else { 500 }
        
        return @{ 
            Success = $false; 
            Error = $_.Exception.Message; 
            StatusCode = $statusCode 
        }
    }
}

# 1. LOGIN
Write-Host ""
Write-Host "🔐 1. Testando Login..." -ForegroundColor Yellow

$loginResult = Test-ApiEndpoint -Url "$BASE_URL/api/usuarios/login" -Method "POST" -Body (ConvertTo-Json $USUARIO_TESTE)

if ($loginResult.Success) {
    $token = $loginResult.Data.dados.token
    Write-Host "✅ Login OK - Token obtido" -ForegroundColor Green
} else {
    Write-Host "❌ Login FALHOU: $($loginResult.Error)" -ForegroundColor Red
    exit 1
}

# Headers autenticados
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. LISTAR PEDIDOS
Write-Host ""
Write-Host "📋 2. Testando Listagem de Pedidos..." -ForegroundColor Yellow

$pedidosResult = Test-ApiEndpoint -Url "$BASE_URL/api/pedidos" -Headers $authHeaders

if ($pedidosResult.Success) {
    $pedidos = $pedidosResult.Data.dados
    Write-Host "✅ Listagem OK - $($pedidos.Count) pedidos encontrados" -ForegroundColor Green
} else {
    Write-Host "❌ Listagem FALHOU: $($pedidosResult.Error)" -ForegroundColor Red
}

# 3. PEDIDO ESPECÍFICO
Write-Host ""
Write-Host "🔍 3. Testando Pedido Específico..." -ForegroundColor Yellow

if ($pedidosResult.Success -and $pedidos.Count -gt 0) {
    $pedidoId = $pedidos[0].id
    $pedidoResult = Test-ApiEndpoint -Url "$BASE_URL/api/pedidos/$pedidoId" -Headers $authHeaders
    
    if ($pedidoResult.Success) {
        Write-Host "✅ Pedido específico OK - ID: $pedidoId" -ForegroundColor Green
    } else {
        Write-Host "❌ Pedido específico FALHOU: $($pedidoResult.Error)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Pulando teste - sem pedidos disponíveis" -ForegroundColor Yellow
}

# 4. TESTE 404
Write-Host ""
Write-Host "🚫 4. Testando Erro 404..." -ForegroundColor Yellow

$test404 = Test-ApiEndpoint -Url "$BASE_URL/api/pedidos/INEXISTENTE" -Headers $authHeaders

if ($test404.StatusCode -eq 404) {
    Write-Host "✅ Erro 404 OK - comportamento correto" -ForegroundColor Green
} else {
    Write-Host "❌ Erro 404 FALHOU - Status: $($test404.StatusCode)" -ForegroundColor Red
}

# 5. TESTE 401
Write-Host ""
Write-Host "🔒 5. Testando Erro 401..." -ForegroundColor Yellow

$test401 = Test-ApiEndpoint -Url "$BASE_URL/api/pedidos"

if ($test401.StatusCode -eq 401) {
    Write-Host "✅ Erro 401 OK - autenticação funcionando" -ForegroundColor Green
} else {
    Write-Host "❌ Erro 401 FALHOU - Status: $($test401.StatusCode)" -ForegroundColor Red
}

# 6. MÉTRICAS
Write-Host ""
Write-Host "📊 6. Testando Métricas..." -ForegroundColor Yellow

$metricsResult = Test-ApiEndpoint -Url "$BASE_URL/api/admin/metrics/summary"

if ($metricsResult.Success) {
    $metrics = $metricsResult.Data.dados
    Write-Host "✅ Métricas OK - Total requisições: $($metrics.requests.total)" -ForegroundColor Green
    Write-Host "   Taxa de sucesso: $($metrics.requests.successRate)%" -ForegroundColor Cyan
} else {
    Write-Host "❌ Métricas FALHARAM: $($metricsResult.Error)" -ForegroundColor Red
}

# 7. SAÚDE DO SISTEMA
Write-Host ""
Write-Host "❤️  7. Testando Health Check..." -ForegroundColor Yellow

$healthResult = Test-ApiEndpoint -Url "$BASE_URL/api/admin/metrics/health"

if ($healthResult.Success) {
    $health = $healthResult.Data.dados
    Write-Host "✅ Health Check OK - Status: $($health.status)" -ForegroundColor Green
} else {
    Write-Host "❌ Health Check FALHOU: $($healthResult.Error)" -ForegroundColor Red
}

# RELATÓRIO FINAL
Write-Host ""
Write-Host "📈 RELATÓRIO FINAL" -ForegroundColor Magenta
Write-Host "=================" -ForegroundColor Magenta

$totalTests = 7
$successCount = 0

if ($loginResult.Success) { $successCount++ }
if ($pedidosResult.Success) { $successCount++ }
if ($pedidoResult.Success -or $pedidos.Count -eq 0) { $successCount++ }
if ($test404.StatusCode -eq 404) { $successCount++ }
if ($test401.StatusCode -eq 401) { $successCount++ }
if ($metricsResult.Success) { $successCount++ }
if ($healthResult.Success) { $successCount++ }

$successRate = [math]::Round(($successCount / $totalTests) * 100, 2)

Write-Host ""
Write-Host "✅ Testes bem-sucedidos: $successCount/$totalTests ($successRate%)" -ForegroundColor Green

if ($successRate -ge 90) {
    Write-Host "🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "⚠️  SISTEMA FUNCIONANDO COM LIMITAÇÕES" -ForegroundColor Yellow
} else {
    Write-Host "❌ SISTEMA COM PROBLEMAS CRÍTICOS" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Recursos disponíveis:" -ForegroundColor Cyan
Write-Host "   Dashboard: $BASE_URL/api/admin/metrics/dashboard" -ForegroundColor White
Write-Host "   Logs: backend/logs/" -ForegroundColor White
Write-Host "   Documentação: DOCUMENTACAO_SISTEMA_PEDIDOS.md" -ForegroundColor White

Write-Host ""
Write-Host "🏁 TESTE CONCLUÍDO!" -ForegroundColor Green
