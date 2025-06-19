import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtecaoRota = ({ children, permissaoRequerida, tipoUsuarioMinimo, redirectTo = "/entrar" }) => {
  const { usuario, hasPermission, isAuthenticated } = useAuth();
  const location = useLocation();

  // Se não está autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se uma permissão específica é requerida
  if (permissaoRequerida && !hasPermission(permissaoRequerida)) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-warning text-center">
              <h4><i className="bi bi-shield-exclamation"></i> Acesso Restrito</h4>
              <p>Você não tem permissão para acessar esta página.</p>
              <p>
                <strong>Permissão necessária:</strong> {permissaoRequerida}<br/>
                <strong>Seu nível atual:</strong> {usuario?.tipo || 'Não autenticado'}
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => window.history.back()}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se um tipo de usuário mínimo é requerido
  if (tipoUsuarioMinimo) {
    const hierarquia = ['visitante', 'usuario', 'colaborador', 'supervisor', 'diretor'];
    const nivelAtual = hierarquia.indexOf(usuario?.tipo || 'visitante');
    const nivelMinimo = hierarquia.indexOf(tipoUsuarioMinimo);

    if (nivelAtual < nivelMinimo) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="alert alert-info text-center">
                <h4><i className="bi bi-person-plus"></i> Upgrade Necessário</h4>
                <p>Para acessar esta funcionalidade, você precisa ser um <strong>{tipoUsuarioMinimo}</strong>.</p>
                <p>
                  <strong>Seu nível atual:</strong> {usuario?.tipo || 'visitante'}<br/>
                  <strong>Nível necessário:</strong> {tipoUsuarioMinimo}
                </p>
                {usuario?.tipo === 'visitante' && (
                  <div className="mt-3">
                    <button 
                      className="btn btn-success me-2"
                      onClick={() => window.location.href = '/cadastro'}
                    >
                      Completar Cadastro
                    </button>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => window.history.back()}
                    >
                      Voltar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtecaoRota;
