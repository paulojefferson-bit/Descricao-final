// Componente de Banner de Login Automático
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginAutomaticoBanner = () => {
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const { isAuthenticated, login } = useAuth();

  useEffect(() => {
    // Mostrar banner apenas se não estiver logado e não tiver visto antes
    const bannerVisto = localStorage.getItem('banner_login_automatico_visto');
    if (!isAuthenticated && !bannerVisto) {
      setMostrarBanner(true);
    }
  }, [isAuthenticated]);

  const handleLoginAutomatico = async () => {
    try {
      await login('demo@lojafgt.com', 'demo123');
      localStorage.setItem('banner_login_automatico_visto', 'true');
      setMostrarBanner(false);
    } catch (error) {
      console.error('Erro no login automático:', error);
    }
  };

  const handleFecharBanner = () => {
    localStorage.setItem('banner_login_automatico_visto', 'true');
    setMostrarBanner(false);
  };

  if (!mostrarBanner) {
    return null;
  }

  return (
    <div className="alert alert-info alert-dismissible fade show position-fixed" 
         style={{ 
           top: '20px', 
           right: '20px', 
           zIndex: 1050, 
           maxWidth: '400px',
           boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
         }}>
      <div className="d-flex align-items-center">
        <i className="bi bi-lightning-charge-fill text-warning me-2" style={{ fontSize: '1.2rem' }}></i>
        <div className="flex-grow-1">
          <strong>Acesso Rápido Disponível!</strong>
          <br />
          <small className="text-muted">
            Clique para entrar automaticamente e explorar o sistema
          </small>
        </div>
      </div>
      
      <div className="mt-2">
        <button 
          type="button" 
          className="btn btn-success btn-sm me-2"
          onClick={handleLoginAutomatico}
        >
          <i className="bi bi-lightning-charge me-1"></i>
          Entrar Agora
        </button>
        <button 
          type="button" 
          className="btn btn-outline-secondary btn-sm"
          onClick={handleFecharBanner}
        >
          Não, obrigado
        </button>
      </div>
      
      <button 
        type="button" 
        className="btn-close position-absolute" 
        style={{ top: '10px', right: '10px' }}
        onClick={handleFecharBanner}
        aria-label="Fechar"
      ></button>
    </div>
  );
};

export default LoginAutomaticoBanner;
