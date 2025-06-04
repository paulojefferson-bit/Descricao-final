// Container de notificações
import React from 'react';
import { useNotifications } from '../../context/NotificationContext';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'error':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-circle-fill';
      case 'info':
      default:
        return 'bi-info-circle-fill';
    }
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
      default:
        return 'alert-info';
    }
  };

  return (
    <div 
      className="position-fixed top-0 end-0 p-3" 
      style={{ 
        zIndex: 9999,
        maxWidth: '400px',
        width: '100%'
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`alert ${getAlertClass(notification.type)} alert-dismissible fade show mb-2`}
          role="alert"
          style={{
            animation: 'slideInRight 0.3s ease-out',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="d-flex align-items-start">
            <i className={`bi ${getIcon(notification.type)} me-2 mt-1`}></i>
            <div className="flex-grow-1">
              {notification.title && (
                <div className="fw-bold mb-1">{notification.title}</div>
              )}
              <div>{notification.message}</div>
            </div>
            <button
              type="button"
              className="btn-close ms-2"
              onClick={() => removeNotification(notification.id)}
              aria-label="Fechar"
            ></button>
          </div>
        </div>
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationContainer;
