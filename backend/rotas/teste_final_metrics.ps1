# Teste Avançado do Sistema de Pedidos - Versão Simplificada
# Compatível com: Windows PowerShell
# Data: 2025-06-02

Write-Host "🚀 INICIANDO TESTE AVANÇADO DO SISTEMA DE PEDIDOS" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Configurações
$BASE_URL = "http://localhost:5000"
$USUARIO_TESTE = @{
    email = "teste@email.com"
    senha = "123456"
}

# Função para fazer requisições HTTP
function Invoke-ApiRequest {
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

# 1. TESTE DE LOGIN
Write-Host "🔐 1. TESTANDO LOGIN..." -ForegroundColor Yellow

$loginResult = Invoke-ApiRequest -Url "$BASE_URL/api/usuarios/login" -Method "POST" -Body (ConvertTo-Json $USUARIO_TESTE)

if ($loginResult.Success) {
    $token = $loginResult.Data.dados.token
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "   Token obtido: $($token.Substring(0, 20))..." -ForegroundColor Cyan
} else {
    Write-Host "❌ Falha no login: $($loginResult.Error)" -ForegroundColor Red
    Write-Host "❌ Status Code: $($loginResult.StatusCode)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Headers para requisições autenticadas
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. TESTE DE LISTAGEM DE PEDIDOS
Write-Host "📋 2. TESTANDO LISTAGEM DE PEDIDOS..." -ForegroundColor Yellow

$pedidosResult = Invoke-ApiRequest -Url "$BASE_URL/api/pedidos" -Headers $authHeaders

if ($pedidosResult.Success) {
    $pedidos = $pedidosResult.Data.dados
    Write-Host "✅ Pedidos listados com sucesso!" -ForegroundColor Green
    Write-Host "   Quantidade de pedidos: $($pedidos.Count)" -ForegroundColor Cyan
    
    if ($pedidos.Count -gt 0) {
        Write-Host "   Primeiro pedido ID: $($pedidos[0].id)" -ForegroundColor Cyan
        Write-Host "   Status: $($pedidos[0].status_pedido)" -ForegroundColor Cyan
        Write-Host "   Valor: R$ $($pedidos[0].valor_total)" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ Falha ao listar pedidos: $($pedidosResult.Error)" -ForegroundColor Red
    Write-Host "❌ Status Code: $($pedidosResult.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# 3. TESTE DE PEDIDO ESPECÍFICO
if ($pedidosResult.Success -and $pedidos.Count -gt 0) {
    Write-Host "🔍 3. TESTANDO CONSULTA DE PEDIDO ESPECÍFICO..." -ForegroundColor Yellow
    
    $pedidoId = $pedidos[0].id
    $pedidoResult = Invoke-ApiRequest -Url "$BASE_URL/api/pedidos/$pedidoId" -Headers $authHeaders
    
    if ($pedidoResult.Success) {
        $pedido = $pedidoResult.Data.dados
        Write-Host "✅ Pedido específico obtido com sucesso!" -ForegroundColor Green
        Write-Host "   ID: $($pedido.id)" -ForegroundColor Cyan
        Write-Host "   Valor Total: R$ $($pedido.valor_total)" -ForegroundColor Cyan
        Write-Host "   Quantidade de itens: $($pedido.itens.Count)" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Falha ao obter pedido específico: $($pedidoResult.Error)" -ForegroundColor Red
        Write-Host "❌ Status Code: $($pedidoResult.StatusCode)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  3. PULANDO TESTE DE PEDIDO ESPECÍFICO (sem pedidos)" -ForegroundColor Yellow
}

Write-Host ""

# 4. TESTE DE PEDIDO INEXISTENTE
Write-Host "🚫 4. TESTANDO PEDIDO INEXISTENTE..." -ForegroundColor Yellow

$pedidoInexistenteResult = Invoke-ApiRequest -Url "$BASE_URL/api/pedidos/PED-INEXISTENTE-123" -Headers $authHeaders

if ($pedidoInexistenteResult.StatusCode -eq 404) {
    Write-Host "✅ Erro 404 retornado corretamente para pedido inexistente!" -ForegroundColor Green
} else {
    Write-Host "❌ Resposta inesperada para pedido inexistente" -ForegroundColor Red
    Write-Host "❌ Status Code: $($pedidoInexistenteResult.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# 5. TESTE SEM AUTENTICAÇÃO
Write-Host "🔒 5. TESTANDO ACESSO SEM AUTENTICAÇÃO..." -ForegroundColor Yellow

$semAuthResult = Invoke-ApiRequest -Url "$BASE_URL/api/pedidos"

if ($semAuthResult.StatusCode -eq 401) {
    Write-Host "✅ Erro 401 retornado corretamente para acesso não autorizado!" -ForegroundColor Green
} else {
    Write-Host "❌ Resposta inesperada para acesso não autorizado" -ForegroundColor Red
    Write-Host "❌ Status Code: $($semAuthResult.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# 6. TESTE DAS MÉTRICAS ADMINISTRATIVAS
Write-Host "📊 6. TESTANDO MÉTRICAS ADMINISTRATIVAS..." -ForegroundColor Yellow

$metricsResult = Invoke-ApiRequest -Url "$BASE_URL/api/admin/metrics/summary"

if ($metricsResult.Success) {
    $metrics = $metricsResult.Data.dados
    Write-Host "✅ Métricas obtidas com sucesso!" -ForegroundColor Green
    Write-Host "   Total de requisições: $($metrics.requests.total)" -ForegroundColor Cyan
    Write-Host "   Taxa de sucesso: $($metrics.requests.successRate)%" -ForegroundColor Cyan
    Write-Host "   Tempo médio de resposta: $($metrics.performance.averageResponseTime)ms" -ForegroundColor Cyan
} else {
    Write-Host "❌ Falha ao obter métricas: $($metricsResult.Error)" -ForegroundColor Red
    Write-Host "❌ Status Code: $($metricsResult.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# TESTE DO RELATÓRIO DE SAÚDE
$healthResult = Invoke-ApiRequest -Url "$BASE_URL/api/admin/metrics/health"

if ($healthResult.Success) {
    $health = $healthResult.Data.dados
    Write-Host "✅ Relatório de saúde obtido!" -ForegroundColor Green
    Write-Host "   Status: $($health.status)" -ForegroundColor Cyan
    Write-Host "   Issues: $($health.issues.Count)" -ForegroundColor Cyan
    Write-Host "   Recomendações: $($health.recommendations.Count)" -ForegroundColor Cyan
} else {
    Write-Host "❌ Falha ao obter relatório de saúde: $($healthResult.Error)" -ForegroundColor Red
}

Write-Host ""

# 7. RELATÓRIO FINAL
Write-Host "📈 7. RELATÓRIO FINAL" -ForegroundColor Magenta
Write-Host "===================" -ForegroundColor Magenta

$totalTests = 6
$successfulTests = 0

# Contabilizar testes bem-sucedidos
if ($loginResult.Success) { $successfulTests++ }
if ($pedidosResult.Success) { $successfulTests++ }
if ($pedidoResult.Success -or $pedidos.Count -eq 0) { $successfulTests++ }
if ($pedidoInexistenteResult.StatusCode -eq 404) { $successfulTests++ }
if ($semAuthResult.StatusCode -eq 401) { $successfulTests++ }
if ($metricsResult.Success) { $successfulTests++ }

$successRate = [math]::Round(($successfulTests / $totalTests) * 100, 2)

Write-Host "✅ Testes bem-sucedidos: $successfulTests/$totalTests ($successRate%)" -ForegroundColor Green

if ($successRate -ge 90) {
    Write-Host "🎉 SISTEMA FUNCIONANDO PERFEITAMENTE!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "⚠️  SISTEMA FUNCIONANDO COM ALGUMAS LIMITAÇÕES" -ForegroundColor Yellow
} else {
    Write-Host "❌ SISTEMA COM PROBLEMAS CRÍTICOS" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Para monitoramento contínuo:" -ForegroundColor Cyan
Write-Host "   - Acesse: $BASE_URL/api/admin/metrics/dashboard" -ForegroundColor White
Write-Host "   - Logs disponíveis em: backend/logs/" -ForegroundColor White
Write-Host "   - Documentação: DOCUMENTACAO_SISTEMA_PEDIDOS.md" -ForegroundColor White

Write-Host ""
Write-Host "🏁 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
