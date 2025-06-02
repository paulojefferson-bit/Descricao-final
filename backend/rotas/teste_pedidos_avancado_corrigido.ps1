# Teste Avançado do Sistema de Pedidos com Logs e Métricas
# Versão: 2.1 - Corrigida com sistema de monitoramento
# Compatível com: Windows PowerShell
# Data: 2025-01-30

Write-Host "🚀 INICIANDO TESTE AVANÇADO DO SISTEMA DE PEDIDOS" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Configurações
$BASE_URL = "http://localhost:3000"
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

# Função para medir tempo de execução
function Measure-RequestTime {
    param(
        [scriptblock]$ScriptBlock
    )
    
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $result = & $ScriptBlock
    $stopwatch.Stop()
    
    $result.Duration = $stopwatch.ElapsedMilliseconds
    return $result
}

# 1. TESTE DE LOGIN
Write-Host "🔐 1. TESTANDO LOGIN..." -ForegroundColor Yellow

$loginResult = Measure-RequestTime {
    Invoke-ApiRequest -Url "$BASE_URL/api/usuarios/login" -Method "POST" -Body (ConvertTo-Json $USUARIO_TESTE)
}

if ($loginResult.Success) {
    $token = $loginResult.Data.dados.token
    Write-Host "✅ Login realizado com sucesso!" -ForegroundColor Green
    Write-Host "   Token obtido: $($token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "   Tempo: $($loginResult.Duration)ms" -ForegroundColor Cyan
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

# 2. TESTE DE LISTAGEM DE PEDIDOS COM MÉTRICAS
Write-Host "📋 2. TESTANDO LISTAGEM DE PEDIDOS..." -ForegroundColor Yellow

$pedidosResult = Measure-RequestTime {
    Invoke-ApiRequest -Url "$BASE_URL/api/pedidos" -Headers $authHeaders
}

if ($pedidosResult.Success) {
    $pedidos = $pedidosResult.Data.dados
    Write-Host "✅ Pedidos listados com sucesso!" -ForegroundColor Green
    Write-Host "   Quantidade de pedidos: $($pedidos.Count)" -ForegroundColor Cyan
    Write-Host "   Tempo: $($pedidosResult.Duration)ms" -ForegroundColor Cyan
    
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
    $pedidoResult = Measure-RequestTime {
        Invoke-ApiRequest -Url "$BASE_URL/api/pedidos/$pedidoId" -Headers $authHeaders
    }
    
    if ($pedidoResult.Success) {
        $pedido = $pedidoResult.Data.dados
        Write-Host "✅ Pedido específico obtido com sucesso!" -ForegroundColor Green
        Write-Host "   ID: $($pedido.id)" -ForegroundColor Cyan
        Write-Host "   Valor Total: R$ $($pedido.valor_total)" -ForegroundColor Cyan
        Write-Host "   Quantidade de itens: $($pedido.itens.Count)" -ForegroundColor Cyan
        Write-Host "   Tempo: $($pedidoResult.Duration)ms" -ForegroundColor Cyan
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

$pedidoInexistenteResult = Measure-RequestTime {
    Invoke-ApiRequest -Url "$BASE_URL/api/pedidos/PED-INEXISTENTE-123" -Headers $authHeaders
}

if ($pedidoInexistenteResult.StatusCode -eq 404) {
    Write-Host "✅ Erro 404 retornado corretamente para pedido inexistente!" -ForegroundColor Green
    Write-Host "   Tempo: $($pedidoInexistenteResult.Duration)ms" -ForegroundColor Cyan
} else {
    Write-Host "❌ Resposta inesperada para pedido inexistente" -ForegroundColor Red
    Write-Host "❌ Status Code: $($pedidoInexistenteResult.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# 5. TESTE SEM AUTENTICAÇÃO
Write-Host "🔒 5. TESTANDO ACESSO SEM AUTENTICAÇÃO..." -ForegroundColor Yellow

$semAuthResult = Measure-RequestTime {
    Invoke-ApiRequest -Url "$BASE_URL/api/pedidos"
}

if ($semAuthResult.StatusCode -eq 401) {
    Write-Host "✅ Erro 401 retornado corretamente para acesso não autorizado!" -ForegroundColor Green
    Write-Host "   Tempo: $($semAuthResult.Duration)ms" -ForegroundColor Cyan
} else {
    Write-Host "❌ Resposta inesperada para acesso não autorizado" -ForegroundColor Red
    Write-Host "❌ Status Code: $($semAuthResult.StatusCode)" -ForegroundColor Red
}

Write-Host ""

# 6. TESTE DE STRESS - MÚLTIPLAS REQUISIÇÕES
Write-Host "⚡ 6. TESTE DE STRESS - 10 REQUISIÇÕES SIMULTÂNEAS..." -ForegroundColor Yellow

$stressResults = @()
$jobs = @()

# Criar jobs para requisições paralelas
for ($i = 1; $i -le 10; $i++) {
    $job = Start-Job -ScriptBlock {
        param($url, $headers)
        
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        try {
            $response = Invoke-RestMethod -Uri $url -Headers $headers
            $stopwatch.Stop()
            return @{ Success = $true; Duration = $stopwatch.ElapsedMilliseconds; Response = $response }
        }
        catch {
            $stopwatch.Stop()
            return @{ Success = $false; Duration = $stopwatch.ElapsedMilliseconds; Error = $_.Exception.Message }
        }
    } -ArgumentList "$BASE_URL/api/pedidos", $authHeaders
    
    $jobs += $job
}

# Aguardar conclusão de todos os jobs
$jobs | Wait-Job | Out-Null

# Coletar resultados
foreach ($job in $jobs) {
    $result = Receive-Job $job
    $stressResults += $result
    Remove-Job $job
}

$successCount = ($stressResults | Where-Object { $_.Success }).Count
$totalDuration = ($stressResults | Measure-Object -Property Duration -Sum).Sum
$avgDuration = $totalDuration / $stressResults.Count

Write-Host "✅ Teste de stress concluído!" -ForegroundColor Green
Write-Host "   Requisições bem-sucedidas: $successCount/10" -ForegroundColor Cyan
Write-Host "   Tempo médio: $([math]::Round($avgDuration, 2))ms" -ForegroundColor Cyan
Write-Host "   Tempo total: ${totalDuration}ms" -ForegroundColor Cyan

Write-Host ""

# 7. TESTE DAS MÉTRICAS ADMINISTRATIVAS
Write-Host "📊 7. TESTANDO MÉTRICAS ADMINISTRATIVAS..." -ForegroundColor Yellow

# Teste do resumo de métricas
$metricsResult = Measure-RequestTime {
    Invoke-ApiRequest -Url "$BASE_URL/api/admin/metrics/summary"
}

if ($metricsResult.Success) {
    $metrics = $metricsResult.Data.dados
    Write-Host "✅ Métricas obtidas com sucesso!" -ForegroundColor Green
    Write-Host "   Total de requisições: $($metrics.requests.total)" -ForegroundColor Cyan
    Write-Host "   Taxa de sucesso: $($metrics.requests.successRate)%" -ForegroundColor Cyan
    Write-Host "   Tempo médio de resposta: $($metrics.performance.averageResponseTime)ms" -ForegroundColor Cyan
    Write-Host "   Tempo: $($metricsResult.Duration)ms" -ForegroundColor Cyan
} else {
    Write-Host "❌ Falha ao obter métricas: $($metricsResult.Error)" -ForegroundColor Red
}

# Teste do relatório de saúde
$healthResult = Measure-RequestTime {
    Invoke-ApiRequest -Url "$BASE_URL/api/admin/metrics/health"
}

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

# 8. RELATÓRIO FINAL
Write-Host "📈 8. RELATÓRIO FINAL" -ForegroundColor Magenta
Write-Host "===================" -ForegroundColor Magenta

$totalTests = 7
$successfulTests = 0

# Contabilizar testes bem-sucedidos
if ($loginResult.Success) { $successfulTests++ }
if ($pedidosResult.Success) { $successfulTests++ }
if ($pedidoResult.Success -or $pedidos.Count -eq 0) { $successfulTests++ }
if ($pedidoInexistenteResult.StatusCode -eq 404) { $successfulTests++ }
if ($semAuthResult.StatusCode -eq 401) { $successfulTests++ }
if ($successCount -gt 7) { $successfulTests++ } # Pelo menos 70% de sucesso no stress test
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
Write-Host "🔍 Tempos de resposta:" -ForegroundColor Cyan
Write-Host "   Login: $($loginResult.Duration)ms" -ForegroundColor White
Write-Host "   Listar pedidos: $($pedidosResult.Duration)ms" -ForegroundColor White
if ($pedidoResult) {
    Write-Host "   Pedido específico: $($pedidoResult.Duration)ms" -ForegroundColor White
}
Write-Host "   Pedido inexistente: $($pedidoInexistenteResult.Duration)ms" -ForegroundColor White
Write-Host "   Sem autenticação: $($semAuthResult.Duration)ms" -ForegroundColor White
Write-Host "   Stress test (média): $([math]::Round($avgDuration, 2))ms" -ForegroundColor White
Write-Host "   Métricas: $($metricsResult.Duration)ms" -ForegroundColor White

Write-Host ""
Write-Host "📋 Para monitoramento contínuo:" -ForegroundColor Cyan
Write-Host "   - Acesse: $BASE_URL/api/admin/metrics/dashboard" -ForegroundColor White
Write-Host "   - Logs disponíveis em: backend/logs/" -ForegroundColor White
Write-Host "   - Documentação: DOCUMENTACAO_SISTEMA_PEDIDOS.md" -ForegroundColor White

Write-Host ""
Write-Host "🏁 TESTE CONCLUÍDO!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
