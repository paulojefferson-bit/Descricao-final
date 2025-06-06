import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente para verificar permissões antes de finalizar compra
const ProtecaoCheckout = ({ children }) => {
  const { isAuthenticated, usuario } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Se não estiver logado, redirecionar para login
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          message: 'Para finalizar sua compra, você precisa fazer login.',
          redirectTo: '/checkout'
        }
      });
      return;
    }

    // Se for visitante (não completou cadastro), redirecionar para completar
    if (usuario?.tipo_usuario === 'visitante') {
      navigate('/completar-cadastro', { 
        state: { 
          message: 'Para finalizar compras, você precisa completar seu cadastro.',
          redirectTo: '/checkout'
        }
      });
      return;
    }
  }, [isAuthenticated, usuario, navigate]);

  // Se passou por todas as verificações, mostrar o componente
  if (isAuthenticated && usuario?.tipo_usuario !== 'visitante') {
    return children;
  }

  // Mostrar loading enquanto verifica
  return (
    <div className="container mt-4">
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Verificando permissões...</span>
        </div>
        <p className="mt-2">Verificando suas permissões...</p>
      </div>
    </div>
  );
};

export default ProtecaoCheckout;
