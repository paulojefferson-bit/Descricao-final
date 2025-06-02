# Teste Final - Sistema de Pedidos
Write-Host "TESTE FINAL DO SISTEMA DE PEDIDOS" -ForegroundColor Green

$BASE_URL = "http://localhost:5000"
$USUARIO_TESTE = @{
    email = "teste@email.com"
    senha = "123456"
}

function Test-Api {
    param([string]$Url, [string]$Method = "GET", [hashtable]$Headers = @{}, [string]$Body = $null)
    
    try {
        $params = @{ Uri = $Url; Method = $Method; Headers = $Headers; ContentType = "application/json" }
        if ($Body) { $params.Body = $Body }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response; StatusCode = 200 }
    }
    catch {
        $statusCode = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { 500 }
        return @{ Success = $false; Error = $_.Exception.Message; StatusCode = $statusCode }
    }
}

Write-Host "1. Login..." -ForegroundColor Yellow
$loginResult = Test-Api -Url "$BASE_URL/api/auth/login" -Method "POST" -Body (ConvertTo-Json $USUARIO_TESTE)

if ($loginResult.Success) {
    $token = $loginResult.Data.dados.token
    Write-Host "OK - Login realizado" -ForegroundColor Green
} else {
    Write-Host "ERRO - Login falhou: $($loginResult.Error)" -ForegroundColor Red
    Write-Host "Status Code: $($loginResult.StatusCode)" -ForegroundColor Red
    exit 1
}

$authHeaders = @{ "Authorization" = "Bearer $token"; "Content-Type" = "application/json" }

Write-Host "2. Listagem de Pedidos..." -ForegroundColor Yellow
$pedidosResult = Test-Api -Url "$BASE_URL/api/pedidos" -Headers $authHeaders

if ($pedidosResult.Success) {
    $pedidos = $pedidosResult.Data.dados
    Write-Host "OK - $($pedidos.Count) pedidos encontrados" -ForegroundColor Green
} else {
    Write-Host "ERRO - Listagem falhou" -ForegroundColor Red
}

Write-Host "3. Pedido Especifico..." -ForegroundColor Yellow
if ($pedidosResult.Success -and $pedidos.Count -gt 0) {
    $pedidoId = $pedidos[0].id
    $pedidoResult = Test-Api -Url "$BASE_URL/api/pedidos/$pedidoId" -Headers $authHeaders
    
    if ($pedidoResult.Success) {
        Write-Host "OK - Pedido obtido: $pedidoId" -ForegroundColor Green
    } else {
        Write-Host "ERRO - Pedido falhou" -ForegroundColor Red
    }
} else {
    Write-Host "SKIP - Sem pedidos" -ForegroundColor Yellow
}

Write-Host "4. Teste 404..." -ForegroundColor Yellow
$test404 = Test-Api -Url "$BASE_URL/api/pedidos/INEXISTENTE" -Headers $authHeaders

if ($test404.StatusCode -eq 404) {
    Write-Host "OK - Erro 404 funcionando" -ForegroundColor Green
} else {
    Write-Host "ERRO - Status: $($test404.StatusCode)" -ForegroundColor Red
}

Write-Host "5. Teste 401..." -ForegroundColor Yellow
$test401 = Test-Api -Url "$BASE_URL/api/pedidos"

if ($test401.StatusCode -eq 401) {
    Write-Host "OK - Autenticacao funcionando" -ForegroundColor Green
} else {
    Write-Host "ERRO - Autenticacao problema: $($test401.StatusCode)" -ForegroundColor Red
}

Write-Host "6. Metricas..." -ForegroundColor Yellow
$metricsResult = Test-Api -Url "$BASE_URL/api/admin/metrics/summary"

if ($metricsResult.Success) {
    $metrics = $metricsResult.Data.dados
    Write-Host "OK - Metricas funcionando" -ForegroundColor Green
    Write-Host "   Total requisicoes: $($metrics.requests.total)" -ForegroundColor Cyan
} else {
    Write-Host "ERRO - Metricas falharam" -ForegroundColor Red
}

Write-Host "7. Health Check..." -ForegroundColor Yellow
$healthResult = Test-Api -Url "$BASE_URL/api/admin/metrics/health"

if ($healthResult.Success) {
    Write-Host "OK - Health Check funcionando" -ForegroundColor Green
} else {
    Write-Host "ERRO - Health Check falhou" -ForegroundColor Red
}

Write-Host ""
Write-Host "RELATORIO FINAL" -ForegroundColor Magenta

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

Write-Host "Testes bem-sucedidos: $successCount de $totalTests" -ForegroundColor Green
Write-Host "Taxa de sucesso: $successRate por cento" -ForegroundColor Green

if ($successRate -ge 90) {
    Write-Host "SISTEMA FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "SISTEMA FUNCIONANDO COM LIMITACOES" -ForegroundColor Yellow
} else {
    Write-Host "SISTEMA COM PROBLEMAS CRITICOS" -ForegroundColor Red
}

Write-Host "TESTE CONCLUIDO!" -ForegroundColor Green
