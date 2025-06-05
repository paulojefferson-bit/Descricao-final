// Contexto para sistema de notificações global
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      type: 'info', // info, success, warning, error
      title: '',
      message: '',
      duration: 5000, // 5 segundos por padrão
      autoClose: true,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remover notificação se configurado
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }    return id;
  }, [removeNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniência
  const showSuccess = useCallback((message, title = 'Sucesso') => {
    return addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  }, [addNotification]);

  const showError = useCallback((message, title = 'Erro') => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 6000
    });
  }, [addNotification]);

  const showWarning = useCallback((message, title = 'Atenção') => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  }, [addNotification]);

  const showInfo = useCallback((message, title = 'Informação') => {
    return addNotification({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
