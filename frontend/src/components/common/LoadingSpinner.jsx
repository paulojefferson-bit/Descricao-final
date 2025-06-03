// Componente de loading reutilizável
import React from 'react';

const LoadingSpinner = ({ 
  message = 'Carregando...', 
  size = 'md',
  variant = 'primary',
  fullscreen = false 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border spinner-border-lg'
  };

  const containerClasses = fullscreen 
    ? 'd-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white bg-opacity-75'
    : 'd-flex justify-content-center align-items-center p-3';

  return (
    <div className={containerClasses} style={{ zIndex: fullscreen ? 9999 : 1 }}>
      <div className="text-center">
        <div 
          className={`spinner-border text-${variant} ${sizeClasses[size]}`} 
          role="status"
          aria-hidden="true"
        >
          <span className="visually-hidden">Carregando...</span>
        </div>
        {message && (
          <div className="mt-2 text-muted">
            <small>{message}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
