// Teste gradual dos imports do Dashboard
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';

const DashboardTest = () => {
  const [testStep, setTestStep] = useState(0);
  const [testResults, setTestResults] = useState([]);

  const addTestResult = (step, result, error = null) => {
    setTestResults(prev => [...prev, { step, result, error }]);
  };

  const runTest = async (stepNumber) => {
    try {
      switch (stepNumber) {
        case 1:
          // Teste 1: Import do AuthContext
          const { useAuth } = await import('../../context/AuthContext');
          addTestResult(1, 'AuthContext importado com sucesso');
          break;
        
        case 2:
          // Teste 2: Import do adminService
          const { adminService } = await import('../../services');
          addTestResult(2, 'adminService importado com sucesso');
          break;
        
        case 3:
          // Teste 3: Import do LoadingSpinner
          const LoadingSpinner = await import('../../components/common/LoadingSpinner');
          addTestResult(3, 'LoadingSpinner importado com sucesso');
          break;
        
        case 4:
          // Teste 4: Import do DashboardHome
          const DashboardHome = await import('../../components/admin/DashboardHome');
          addTestResult(4, 'DashboardHome importado com sucesso');
          break;
        
        case 5:
          // Teste 5: Import dos demais componentes admin
          const GerenciarUsuarios = await import('../../components/admin/GerenciarUsuarios');
          const RelatoriosVendas = await import('../../components/admin/RelatoriosVendas');
          const RelatoriosEstoque = await import('../../components/admin/RelatoriosEstoque');
          addTestResult(5, 'Componentes de relatórios importados com sucesso');
          break;
        
        case 6:
          // Teste 6: Import dos componentes restantes
          const VisualizarLogs = await import('../../components/admin/VisualizarLogs');
          const GerenciarPromocoes = await import('../../components/admin/GerenciarPromocoes');
          const Configuracoes = await import('../../components/admin/Configuracoes');
          addTestResult(6, 'Componentes de administração importados com sucesso');
          break;
        
        default:
          addTestResult(stepNumber, 'Teste não definido');
      }
    } catch (error) {
      addTestResult(stepNumber, 'ERRO', error.message);
    }
  };

  return (
    <Container className="py-4">
      <h2>Dashboard - Teste de Imports</h2>
      <p>Este componente testa cada import do Dashboard para identificar o problema.</p>
      
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>Testes de Import</Card.Header>
            <Card.Body>
              {[1, 2, 3, 4, 5, 6].map(step => (
                <div key={step} className="mb-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => runTest(step)}
                    className="me-2"
                  >
                    Teste {step}
                  </Button>
                  <span>
                    {step === 1 && 'AuthContext'}
                    {step === 2 && 'adminService'}
                    {step === 3 && 'LoadingSpinner'}
                    {step === 4 && 'DashboardHome'}
                    {step === 5 && 'Relatórios (Vendas/Estoque)'}
                    {step === 6 && 'Admin (Logs/Promoções/Config)'}
                  </span>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card>
            <Card.Header>Resultados dos Testes</Card.Header>
            <Card.Body>
              {testResults.length === 0 ? (
                <p className="text-muted">Nenhum teste executado ainda</p>
              ) : (
                testResults.map((result, index) => (
                  <Alert
                    key={index}
                    variant={result.error ? 'danger' : 'success'}
                    className="py-2 mb-2"
                  >
                    <strong>Teste {result.step}:</strong> {result.result}
                    {result.error && (
                      <div className="mt-1">
                        <small>Erro: {result.error}</small>
                      </div>
                    )}
                  </Alert>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardTest;
