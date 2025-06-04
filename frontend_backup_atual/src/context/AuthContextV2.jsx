// Contexto de autenticação aprimorado com notificações
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { authService } from '../services/integracaoService';
import { useNotifications } from './NotificationContext';

// Estados da autenticação
const authInitialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  loginAttempts: 0
};

// Actions do reducer
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  INCREMENT_ATTEMPTS: 'INCREMENT_ATTEMPTS',
  RESET_ATTEMPTS: 'RESET_ATTEMPTS'
};

// Reducer para gerenciar estado da autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
        loginAttempts: 0
      };

    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
        loginAttempts: state.loginAttempts + 1
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
        loginAttempts: 0
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };

    case AUTH_ACTIONS.INCREMENT_ATTEMPTS:
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1
      };

    case AUTH_ACTIONS.RESET_ATTEMPTS:
      return {
        ...state,
        loginAttempts: 0
      };

    default:
      return state;
  }
};

// Criação do contexto
const AuthContext = createContext();

// Hook para usar o contexto de autenticação
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

// Provedor do contexto de autenticação
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, authInitialState);
  const { showSuccess, showError, showWarning } = useNotifications();

  // Verificar autenticação ao inicializar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        
        const isLoggedIn = authService.isLoggedIn();
        const currentUser = authService.getCurrentUser();
        
        if (isLoggedIn && currentUser) {
          dispatch({ 
            type: AUTH_ACTIONS.LOGIN_SUCCESS, 
            payload: { user: currentUser } 
          });
        } else {
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      } finally {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Função de login
  const login = useCallback(async (email, senha) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.login(email, senha);
      
      if (response.sucesso) {
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_SUCCESS, 
          payload: { user: response.usuario } 
        });
        
        showSuccess(`Bem-vindo(a), ${response.usuario.nome}!`, 'Login Realizado');
        
        return response;
      } else {
        const errorMessage = response.mensagem || 'Credenciais inválidas';
        dispatch({ 
          type: AUTH_ACTIONS.LOGIN_ERROR, 
          payload: errorMessage 
        });
        
        if (state.loginAttempts >= 2) {
          showWarning('Muitas tentativas de login. Verifique suas credenciais.', 'Atenção');
        } else {
          showError(errorMessage, 'Erro no Login');
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Erro ao fazer login';
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_ERROR, 
        payload: errorMessage 
      });
      
      if (state.loginAttempts >= 2) {
        showWarning('Muitas tentativas de login. Aguarde alguns minutos.', 'Bloqueio Temporário');
      } else {
        showError(errorMessage, 'Erro no Login');
      }
      
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, [showSuccess, showError, showWarning, state.loginAttempts]);

  // Função de registro
  const register = useCallback(async (dadosUsuario) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.register(dadosUsuario);
      
      if (response.sucesso) {
        showSuccess('Conta criada com sucesso! Faça login para continuar.', 'Cadastro Realizado');
        return response;
      } else {
        const errorMessage = response.mensagem || 'Erro ao criar conta';
        showError(errorMessage, 'Erro no Cadastro');
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || 'Erro ao criar conta';
      showError(errorMessage, 'Erro no Cadastro');
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  }, [showSuccess, showError]);

  // Função de logout
  const logout = useCallback(() => {
    try {
      authService.logout();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      showSuccess('Logout realizado com sucesso!', 'Até logo');
    } catch (error) {
      console.error('Erro no logout:', error);
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, [showSuccess]);

  // Função para atualizar dados do usuário
  const updateUser = useCallback((userData) => {
    dispatch({ 
      type: AUTH_ACTIONS.UPDATE_USER, 
      payload: userData 
    });
    
    // Atualizar no localStorage também
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('usuario', JSON.stringify(updatedUser));
    }
  }, []);

  // Função para limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Função para resetar tentativas de login
  const resetLoginAttempts = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.RESET_ATTEMPTS });
  }, []);

  // Função para verificar permissões
  const hasPermission = useCallback((permission) => {
    if (!state.user) return false;
    
    // Implementar lógica de permissões se necessário
    const userPermissions = state.user.permissoes || [];
    return userPermissions.includes(permission);
  }, [state.user]);

  // Valor do contexto
  const value = {
    // Estado
    ...state,
    
    // Funções
    login,
    register,
    logout,
    updateUser,
    clearError,
    resetLoginAttempts,
    hasPermission,
    
    // Computados
    isBlocked: state.loginAttempts >= 3,
    canRetry: state.loginAttempts < 3
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
