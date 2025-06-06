// Componente de Banner de Login Automático
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const LoginAutomaticoBanner = () => {
  const [mostrarBanner, setMostrarBanner] = useState(false);
  const { isAuthenticated, login } = useAuth();
  const location = useLocation();
  useEffect(() => {
    // Limpar estado inconsistente no localStorage que pode causar loop
    const loginEmProgresso = localStorage.getItem('login_em_progresso');
    const timestampProgresso = localStorage.getItem('login_timestamp');
    const agora = Date.now();
    
    // Se login está marcado como "em progresso" por mais de 10 segundos, limpar
    if (loginEmProgresso === 'true') {
      if (!timestampProgresso || (agora - parseInt(timestampProgresso)) > 10000) {
        console.log('Limpando estado de login em progresso antigo');
        localStorage.removeItem('login_em_progresso');
        localStorage.removeItem('login_timestamp');
      }
    }
    
    // Mostrar banner apenas se:
    // 1. Não estiver logado
    // 2. Não tiver visto antes
    // 3. Estiver na página de login ou página inicial
    // 4. Não estiver com login em progresso
    const bannerVisto = localStorage.getItem('banner_login_automatico_visto');
    const paginasPermitidas = ['/', '/login', '/cadastro'];
    const paginaAtual = location.pathname;
    
    if (!isAuthenticated && 
        !bannerVisto && 
        paginasPermitidas.includes(paginaAtual) && 
        loginEmProgresso !== 'true') {
      setMostrarBanner(true);
    } else {
      setMostrarBanner(false);
    }
  }, [isAuthenticated, location.pathname]);  const handleLoginAutomatico = async () => {
    try {
      // Verificações múltiplas para evitar loop
      const loginEmProgresso = localStorage.getItem('login_em_progresso');
      const bannerVisto = localStorage.getItem('banner_login_automatico_visto');
      
      // Se já está em progresso ou banner já foi visto, sair
      if (loginEmProgresso === 'true' || bannerVisto === 'true') {
        console.log('Login já em progresso ou banner já processado');
        return;
      }
      
      // Marcar imediatamente para evitar múltiplas execuções
      localStorage.setItem('login_em_progresso', 'true');
      localStorage.setItem('login_timestamp', Date.now().toString());
      localStorage.setItem('banner_login_automatico_visto', 'true');
      setMostrarBanner(false);
      
      // Fazer login
      const resultado = await login('demo@lojafgt.com', 'demo123');
      
      if (resultado.sucesso) {
        console.log('Login automático realizado com sucesso');
      } else {
        console.log('Falha no login automático:', resultado.mensagem);
      }
      
    } catch (error) {
      console.error('Erro no login automático:', error);
    } finally {
      // Sempre limpar a flag de progresso após um timeout
      setTimeout(() => {
        localStorage.removeItem('login_em_progresso');
        localStorage.removeItem('login_timestamp');
      }, 2000);
    }
  };
  const handleFecharBanner = () => {
    localStorage.setItem('banner_login_automatico_visto', 'true');
    setMostrarBanner(false);
  };

  // Função para resetar o estado do banner (útil para desenvolvimento/teste)
  const resetBannerState = () => {
    localStorage.removeItem('banner_login_automatico_visto');
    localStorage.removeItem('login_em_progresso');
    localStorage.removeItem('login_timestamp');
    setMostrarBanner(false);
  };

  // Limpar estado ao desmontar componente
  useEffect(() => {
    return () => {
      // Cleanup ao desmontar
      const loginEmProgresso = localStorage.getItem('login_em_progresso');
      if (loginEmProgresso === 'true') {
        localStorage.removeItem('login_em_progresso');
        localStorage.removeItem('login_timestamp');
      }
    };
  }, []);

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
