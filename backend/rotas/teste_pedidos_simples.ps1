# Script PowerShell para testar sistema de pedidos
# Versao simplificada - sem emojis para evitar problemas de codificacao

param(
    [string]$BaseUrl = "http://localhost:5000",
    [string]$Email = "teste@carrinho.com",
    [string]$Senha = "123456"
)

Write-Host "TESTES DO SISTEMA DE PEDIDOS" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Funcao para fazer requisicoes HTTP
function Invoke-ApiRequest {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [object]$Body = $null
    )
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            ContentType = "application/json"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        return @{ Success = $true; Data = $response; StatusCode = 200 }
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        return @{ Success = $false; Error = $_.Exception.Message; StatusCode = $statusCode }
    }
}

# Verificar se servidor esta rodando
Write-Host "Verificando servidor..." -ForegroundColor Yellow
$healthCheck = Invoke-ApiRequest -Url "$BaseUrl/api/health"

if (-not $healthCheck.Success) {
    Write-Host "ERRO: Servidor nao esta rodando em $BaseUrl" -ForegroundColor Red
    Write-Host "Certifique-se de que o backend esta rodando" -ForegroundColor Yellow
    exit 1
}

Write-Host "OK: Servidor esta rodando" -ForegroundColor Green
Write-Host ""

# Fazer login
Write-Host "Fazendo login..." -ForegroundColor Yellow

$loginData = @{
    email = $Email
    senha = $Senha
}

$loginResult = Invoke-ApiRequest -Url "$BaseUrl/api/auth/login" -Method "POST" -Body $loginData

if (-not $loginResult.Success) {
    Write-Host "ERRO: Falha no login - $($loginResult.Error)" -ForegroundColor Red
    exit 1
}

$token = $loginResult.Data.dados.token
Write-Host "OK: Login realizado com sucesso" -ForegroundColor Green
Write-Host ""

# Testar listagem de pedidos
Write-Host "Testando listagem de pedidos..." -ForegroundColor Yellow

$headers = @{ Authorization = "Bearer $token" }
$pedidosResult = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos" -Headers $headers

if ($pedidosResult.Success) {
    $pedidos = $pedidosResult.Data.dados
    Write-Host "OK: Listagem funcionando - $($pedidos.Count) pedidos encontrados" -ForegroundColor Green
    
    # Validar estrutura se houver pedidos
    if ($pedidos.Count -gt 0) {
        $pedido = $pedidos[0]
        $camposObrigatorios = @('id', 'valor_total', 'status_pedido', 'data_pedido', 'itens')
        
        Write-Host "Validando estrutura do pedido:" -ForegroundColor Gray
        foreach ($campo in $camposObrigatorios) {
            if ($pedido.PSObject.Properties.Name -contains $campo) {
                Write-Host "  OK: Campo '$campo' presente" -ForegroundColor Green
            } else {
                Write-Host "  ERRO: Campo '$campo' ausente" -ForegroundColor Red
            }
        }
        
        $primeiroId = $pedidos[0].id
    } else {
        Write-Host "  INFO: Nenhum pedido encontrado" -ForegroundColor Yellow
        $primeiroId = $null
    }
} else {
    Write-Host "ERRO: Falha na listagem - $($pedidosResult.Error)" -ForegroundColor Red
    $primeiroId = $null
}
Write-Host ""

# Testar pedido especifico se houver pedidos
if ($primeiroId) {
    Write-Host "Testando consulta de pedido especifico..." -ForegroundColor Yellow
    
    $pedidoResult = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos/$primeiroId" -Headers $headers
    
    if ($pedidoResult.Success) {
        $pedido = $pedidoResult.Data.dados
        Write-Host "OK: Consulta especifica funcionando - Pedido $($pedido.id)" -ForegroundColor Green
        
        # Validacoes
        if ($pedido.id -eq $primeiroId) {
            Write-Host "  OK: ID correto" -ForegroundColor Green
        } else {
            Write-Host "  ERRO: ID incorreto" -ForegroundColor Red
        }
        
        if ($pedido.itens -is [array]) {
            Write-Host "  OK: Itens deserializados corretamente" -ForegroundColor Green
        } else {
            Write-Host "  ERRO: Problema na deserializacao dos itens" -ForegroundColor Red
        }
    } else {
        Write-Host "ERRO: Falha na consulta especifica - $($pedidoResult.Error)" -ForegroundColor Red
    }
    Write-Host ""
}

# Testar pedido inexistente
Write-Host "Testando pedido inexistente..." -ForegroundColor Yellow

$pedidoInexistente = "PED-INEXISTENTE-12345"
$inexistenteResult = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos/$pedidoInexistente" -Headers $headers

if ($inexistenteResult.Success) {
    Write-Host "ERRO: Deveria ter retornado 404 mas retornou sucesso" -ForegroundColor Red
} else {
    if ($inexistenteResult.StatusCode -eq 404) {
        Write-Host "OK: Pedido inexistente rejeitado corretamente (404)" -ForegroundColor Green
    } else {
        Write-Host "AVISO: Erro inesperado - $($inexistenteResult.Error)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Testar autenticacao
Write-Host "Testando autenticacao..." -ForegroundColor Yellow

# Teste sem token
$semTokenResult = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos"

if ($semTokenResult.Success) {
    Write-Host "ERRO: Acesso sem token foi permitido" -ForegroundColor Red
} else {
    if ($semTokenResult.StatusCode -eq 401) {
        Write-Host "OK: Acesso sem token rejeitado corretamente (401)" -ForegroundColor Green
    }
}

# Teste com token invalido
$headersInvalidos = @{ Authorization = "Bearer token-invalido" }
$tokenInvalidoResult = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos" -Headers $headersInvalidos

if ($tokenInvalidoResult.Success) {
    Write-Host "ERRO: Token invalido foi aceito" -ForegroundColor Red
} else {
    if ($tokenInvalidoResult.StatusCode -eq 401) {
        Write-Host "OK: Token invalido rejeitado corretamente (401)" -ForegroundColor Green
    }
}
Write-Host ""

# Teste de performance
Write-Host "Testando performance..." -ForegroundColor Yellow

$numeroTestes = 3
$tempos = @()

for ($i = 1; $i -le $numeroTestes; $i++) {
    $inicio = Get-Date
    $perfResult = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos" -Headers $headers
    $fim = Get-Date
    
    if ($perfResult.Success) {
        $tempo = ($fim - $inicio).TotalMilliseconds
        $tempos += $tempo
        Write-Host "  Teste $i : $([math]::Round($tempo, 2))ms" -ForegroundColor Gray
    }
}

if ($tempos.Count -gt 0) {
    $tempoMedio = ($tempos | Measure-Object -Average).Average
    $tempoMaximo = ($tempos | Measure-Object -Maximum).Maximum
    
    Write-Host "OK: Performance testada - Media: $([math]::Round($tempoMedio, 2))ms | Maximo: $([math]::Round($tempoMaximo, 2))ms" -ForegroundColor Green
    
    if ($tempoMedio -lt 1000) {
        Write-Host "  OK: Tempo medio aceitavel (menor que 1s)" -ForegroundColor Green
    } else {
        Write-Host "  AVISO: Tempo medio alto (maior que 1s)" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "CONCLUSAO:" -ForegroundColor Cyan
Write-Host "Todos os testes do sistema de pedidos foram executados!" -ForegroundColor Green
Write-Host "Verifique os resultados acima para validar o funcionamento." -ForegroundColor Gray
Write-Host ""
