// Dashboard Administrativo - Versão Incremental
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Alert } from 'react-bootstrap';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services';
import DashboardHome from '../../components/admin/DashboardHome';
import GerenciarUsuarios from '../../components/admin/GerenciarUsuarios';
import RelatoriosVendas from '../../components/admin/RelatoriosVendas';
import RelatoriosEstoque from '../../components/admin/RelatoriosEstoque';
import VisualizarLogs from '../../components/admin/VisualizarLogs';
import GerenciarPromocoes from '../../components/admin/GerenciarPromocoes';
import Configuracoes from '../../components/admin/Configuracoes';
import './Dashboard.css';

const DashboardIncremental = () => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      default:
        return <div>Conteúdo em desenvolvimento...</div>;
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <Row>
        {/* Sidebar */}
        <Col md={3} lg={2} className="bg-dark text-white min-vh-100 p-0">
          <div className="p-3">
            <h4 className="text-center mb-4">
              <i className="bi bi-speedometer2 me-2"></i>
              Painel Admin
            </h4>
            <div className="text-center mb-3">
              <div className="user-info">
                <i className="bi bi-person-circle fs-1"></i>
                <div className="mt-2">
                  <small className="d-block">Usuário Teste</small>
                  <small className="text-muted">admin</small>
                </div>
              </div>
            </div>
          </div>

          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
                className="text-white"
              >
                <i className="bi bi-house me-2"></i>
                Dashboard
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Content */}
        <Col md={9} lg={10} className="p-4">
          {renderContent()}
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardIncremental;
