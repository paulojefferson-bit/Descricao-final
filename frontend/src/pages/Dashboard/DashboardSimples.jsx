// Dashboard simplificado para teste
import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import './Dashboard.css';

const DashboardSimples = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <h2>🏠 Dashboard Home</h2>
            <Row>
              <Col md={3}>
                <Card className="admin-card">
                  <Card.Body>
                    <h5>Total de Usuários</h5>
                    <h3 className="text-primary">24</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="admin-card">
                  <Card.Body>
                    <h5>Total de Produtos</h5>
                    <h3 className="text-success">45</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="admin-card">
                  <Card.Body>
                    <h5>Pedidos</h5>
                    <h3 className="text-warning">4</h3>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3}>
                <Card className="admin-card">
                  <Card.Body>
                    <h5>Vendas Hoje</h5>
                    <h3 className="text-info">R$ 1.250</h3>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        );
      case 'usuarios':
        return <h2>👥 Gerenciar Usuários</h2>;
      case 'vendas':
        return <h2>📊 Relatórios de Vendas</h2>;
      case 'estoque':
        return <h2>📦 Relatórios de Estoque</h2>;
      case 'logs':
        return <h2>📋 Visualizar Logs</h2>;
      case 'promocoes':
        return <h2>🎯 Gerenciar Promoções</h2>;
      case 'config':
        return <h2>⚙️ Configurações</h2>;
      default:
        return <h2>🏠 Dashboard Home</h2>;
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        <Col lg={2} className="sidebar">
          <div className="admin-header">
            <h4>🎯 Painel Admin</h4>
          </div>
          <Nav className="flex-column admin-nav">
            <Nav.Link 
              className={activeTab === 'home' ? 'active' : ''} 
              onClick={() => setActiveTab('home')}
            >
              🏠 Dashboard
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'usuarios' ? 'active' : ''} 
              onClick={() => setActiveTab('usuarios')}
            >
              👥 Usuários
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'vendas' ? 'active' : ''} 
              onClick={() => setActiveTab('vendas')}
            >
              📊 Vendas
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'estoque' ? 'active' : ''} 
              onClick={() => setActiveTab('estoque')}
            >
              📦 Estoque
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'logs' ? 'active' : ''} 
              onClick={() => setActiveTab('logs')}
            >
              📋 Logs
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'promocoes' ? 'active' : ''} 
              onClick={() => setActiveTab('promocoes')}
            >
              🎯 Promoções
            </Nav.Link>
            <Nav.Link 
              className={activeTab === 'config' ? 'active' : ''} 
              onClick={() => setActiveTab('config')}
            >
              ⚙️ Configurações
            </Nav.Link>
          </Nav>
        </Col>
        <Col lg={10} className="main-content">
          <div className="content-area">
            {renderContent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardSimples;
