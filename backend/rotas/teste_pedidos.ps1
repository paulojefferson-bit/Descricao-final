# Script PowerShell para testar endpoints do sistema de pedidos
# Compativel com Windows PowerShell

param(
    [string]$BaseUrl = "http://localhost:5000",
    [string]$Email = "teste@carrinho.com",
    [string]$Senha = "123456"
)

Write-Host "TESTES DO SISTEMA DE PEDIDOS - PowerShell" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Função para fazer requisições HTTP
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

# Função para fazer login e obter token
function Get-AuthToken {
    Write-Host "🔐 Fazendo login..." -ForegroundColor Yellow
    
    $loginData = @{
        email = $Email
        senha = $Senha
    }
    
    $result = Invoke-ApiRequest -Url "$BaseUrl/api/auth/login" -Method "POST" -Body $loginData
      if ($result.Success) {
        Write-Host "LOGIN realizado com sucesso" -ForegroundColor Green
        return $result.Data.token
    } else {
        Write-Host "ERRO no login: $($result.Error)" -ForegroundColor Red
        exit 1
    }
}

# Função para testar listagem de pedidos
function Test-ListarPedidos {
    param([string]$Token)
    
    Write-Host "📋 Testando listagem de pedidos..." -ForegroundColor Yellow
    
    $headers = @{ Authorization = "Bearer $Token" }
    $result = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos" -Headers $headers
    
    if ($result.Success) {
        $pedidos = $result.Data.dados
        Write-Host "✅ Listagem OK - $($pedidos.Count) pedidos encontrados" -ForegroundColor Green
        
        # Validar estrutura
        if ($pedidos.Count -gt 0) {
            $pedido = $pedidos[0]
            $camposObrigatorios = @('id', 'valor_total', 'status_pedido', 'data_pedido', 'itens')
            
            foreach ($campo in $camposObrigatorios) {
                if ($pedido.PSObject.Properties.Name -contains $campo) {
                    Write-Host "  ✅ Campo '$campo' presente" -ForegroundColor Green
                } else {
                    Write-Host "  ❌ Campo '$campo' ausente" -ForegroundColor Red
                }
            }
        }
        
        return $pedidos[0].id
    } else {
        Write-Host "❌ Erro na listagem: $($result.Error)" -ForegroundColor Red
        return $null
    }
}

# Função para testar pedido específico
function Test-PedidoEspecifico {
    param([string]$Token, [string]$PedidoId)
    
    if (-not $PedidoId) {
        Write-Host "⚠️ Nenhum pedido disponível para teste específico" -ForegroundColor Yellow
        return
    }
    
    Write-Host "🔍 Testando consulta de pedido específico..." -ForegroundColor Yellow
    
    $headers = @{ Authorization = "Bearer $Token" }
    $result = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos/$PedidoId" -Headers $headers
    
    if ($result.Success) {
        $pedido = $result.Data.dados
        Write-Host "✅ Consulta específica OK - Pedido $($pedido.id)" -ForegroundColor Green
        
        # Validações
        if ($pedido.id -eq $PedidoId) {
            Write-Host "  ✅ ID correto" -ForegroundColor Green
        } else {
            Write-Host "  ❌ ID incorreto" -ForegroundColor Red
        }
        
        if ($pedido.itens -is [array]) {
            Write-Host "  ✅ Itens deserializados corretamente" -ForegroundColor Green
        } else {
            Write-Host "  ❌ Erro na deserialização dos itens" -ForegroundColor Red
        }
    } else {
        Write-Host "❌ Erro na consulta específica: $($result.Error)" -ForegroundColor Red
    }
}

# Função para testar pedido inexistente
function Test-PedidoInexistente {
    param([string]$Token)
    
    Write-Host "🚫 Testando pedido inexistente..." -ForegroundColor Yellow
    
    $pedidoIdInexistente = "PED-INEXISTENTE-12345"
    $headers = @{ Authorization = "Bearer $Token" }
    $result = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos/$pedidoIdInexistente" -Headers $headers
    
    if ($result.Success) {
        Write-Host "❌ Deveria ter retornado 404 mas retornou sucesso" -ForegroundColor Red
    } else {
        if ($result.StatusCode -eq 404) {
            Write-Host "✅ Pedido inexistente rejeitado corretamente (404)" -ForegroundColor Green
        } else {
            Write-Host "❌ Erro inesperado: $($result.Error)" -ForegroundColor Red
        }
    }
}

# Função para testar autenticação
function Test-Autenticacao {
    Write-Host "🔐 Testando autenticação..." -ForegroundColor Yellow
    
    # Teste sem token
    $result = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos"
    
    if ($result.Success) {
        Write-Host "❌ Acesso sem token foi permitido" -ForegroundColor Red
    } else {
        if ($result.StatusCode -eq 401) {
            Write-Host "✅ Acesso sem token rejeitado corretamente (401)" -ForegroundColor Green
        }
    }
    
    # Teste com token inválido
    $headers = @{ Authorization = "Bearer token-invalido" }
    $result = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos" -Headers $headers
    
    if ($result.Success) {
        Write-Host "❌ Token inválido foi aceito" -ForegroundColor Red
    } else {
        if ($result.StatusCode -eq 401) {
            Write-Host "✅ Token inválido rejeitado corretamente (401)" -ForegroundColor Green
        }
    }
}

# Função para testar performance
function Test-Performance {
    param([string]$Token)
    
    Write-Host "⚡ Testando performance..." -ForegroundColor Yellow
    
    $numeroTestes = 5
    $tempos = @()
    $headers = @{ Authorization = "Bearer $Token" }
    
    for ($i = 1; $i -le $numeroTestes; $i++) {
        $inicio = Get-Date
        $result = Invoke-ApiRequest -Url "$BaseUrl/api/pedidos" -Headers $headers
        $fim = Get-Date
        
        $tempo = ($fim - $inicio).TotalMilliseconds
        $tempos += $tempo
        
        Write-Host "  Teste $i`: $([math]::Round($tempo, 2))ms" -ForegroundColor Gray
    }
    
    $tempoMedio = ($tempos | Measure-Object -Average).Average
    $tempoMaximo = ($tempos | Measure-Object -Maximum).Maximum
    
    Write-Host "✅ Performance OK - Média: $([math]::Round($tempoMedio, 2))ms | Máximo: $([math]::Round($tempoMaximo, 2))ms" -ForegroundColor Green
    
    if ($tempoMedio -lt 1000) {
        Write-Host "  ✅ Tempo médio aceitável (< 1s)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️ Tempo médio alto (> 1s)" -ForegroundColor Yellow
    }
}

# Executar todos os testes
try {
    # Verificar se o servidor está rodando
    Write-Host "🔍 Verificando se o servidor está rodando..." -ForegroundColor Yellow
    $healthCheck = Invoke-ApiRequest -Url "$BaseUrl/api/health"
    
    if (-not $healthCheck.Success) {
        Write-Host "❌ Servidor não está rodando em $BaseUrl" -ForegroundColor Red
        Write-Host "💡 Certifique-se de que o backend está rodando com: npm run dev" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Servidor está rodando" -ForegroundColor Green
    Write-Host ""
    
    # Obter token de autenticação
    $token = Get-AuthToken
    Write-Host ""
    
    # Executar testes
    $pedidoId = Test-ListarPedidos -Token $token
    Write-Host ""
    
    Test-PedidoEspecifico -Token $token -PedidoId $pedidoId
    Write-Host ""
    
    Test-PedidoInexistente -Token $token
    Write-Host ""
    
    Test-Autenticacao
    Write-Host ""
    
    Test-Performance -Token $token
    Write-Host ""
    
    Write-Host "🎉 Todos os testes concluídos!" -ForegroundColor Green
    Write-Host "📊 Sistema de pedidos validado com sucesso!" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erro geral nos testes: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
