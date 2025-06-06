// Dashboard para debug - testando imports um por vez
import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
// import { useAuth } from '../../context/AuthContext';
// import { adminService } from '../../services';
// import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardHome from '../../components/admin/DashboardHome';
// import GerenciarUsuarios from '../../components/admin/GerenciarUsuarios';
// import RelatoriosVendas from '../../components/admin/RelatoriosVendas';
// import RelatoriosEstoque from '../../components/admin/RelatoriosEstoque';
// import VisualizarLogs from '../../components/admin/VisualizarLogs';
// import GerenciarPromocoes from '../../components/admin/GerenciarPromocoes';
// import Configuracoes from '../../components/admin/Configuracoes';
import './Dashboard.css';

const DashboardDebug = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'usuarios':
        return <h2>👥 Gerenciar Usuários (Em breve)</h2>;
      case 'vendas':
        return <h2>📊 Relatórios de Vendas (Em breve)</h2>;
      case 'estoque':
        return <h2>📦 Relatórios de Estoque (Em breve)</h2>;
      case 'logs':
        return <h2>📋 Visualizar Logs (Em breve)</h2>;
      case 'promocoes':
        return <h2>🎯 Gerenciar Promoções (Em breve)</h2>;
      case 'config':
        return <h2>⚙️ Configurações (Em breve)</h2>;
      default:
        return <DashboardHome />;
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

export default DashboardDebug;
