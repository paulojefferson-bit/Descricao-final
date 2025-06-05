// Componente de Login integrado com o backend
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useUtils } from '../../hooks/useApiIntegration';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [lembrarMe, setLembrarMe] = useState(false);
  
  const { login, register, isAuthenticated, loading, error, clearError } = useAuth();
  const { validarEmail } = useUtils();
  const navigate = useNavigate();

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  // Limpar erro ao montar componente e carregar credenciais salvas
  useEffect(() => {
    clearError();
    
    // Carregar credenciais salvas se "lembrar-me" foi marcado
    const savedEmail = localStorage.getItem('saved_email');
    const savedPassword = localStorage.getItem('saved_password');
    const rememberMe = localStorage.getItem('remember_me') === 'true';
    
    if (rememberMe && savedEmail) {
      setFormData(prev => ({
        ...prev,
        email: savedEmail,
        senha: savedPassword || ''
      }));
      setLembrarMe(true);
      
      // Se tiver senha salva, fazer login automático
      if (savedPassword) {
        setTimeout(() => {
          login(savedEmail, savedPassword);
        }, 500);
      }
    }
  }, [clearError, login]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!validarEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData.email, formData.senha);
      
      if (response.sucesso) {
        // Salvar credenciais se "lembrar-me" estiver marcado
        if (lembrarMe) {
          localStorage.setItem('saved_email', formData.email);
          localStorage.setItem('saved_password', formData.senha);
          localStorage.setItem('remember_me', 'true');
        } else {
          // Limpar credenciais salvas se não estiver marcado
          localStorage.removeItem('saved_email');
          localStorage.removeItem('saved_password');
          localStorage.removeItem('remember_me');
        }
        
        // Login bem-sucedido, usuário será redirecionado pelo useEffect
      }
    } catch (err) {
      console.error('Erro no login:', err);
    }
  };
  // Função para login demo/automático
  const handleDemoLogin = async () => {
    try {
      // Credenciais de usuário demo
      const response = await login('demo@lojafgt.com', 'demo123');
      
      if (response.sucesso) {        // Salvar como lembrado para próxima vez
        localStorage.setItem('saved_email', 'demo@lojafgt.com');
        localStorage.setItem('saved_password', 'demo123');
        localStorage.setItem('remember_me', 'true');
      }
    } catch (err) {
      console.error('Erro no login demo:', err);
      // Se falhar, tentar criar o usuário demo
      try {
        await register({
          nome: 'Usuário Demo',
          email: 'demo@lojafgt.com',
          senha: 'demo123',
          confirmar_senha: 'demo123'
        });
        // Tentar fazer login novamente
        await login('demo@lojafgt.com', 'demo123');
        // Salvar como lembrado
        localStorage.setItem('saved_email', 'demo@lojafgt.com');
        localStorage.setItem('saved_password', 'demo123');
        localStorage.setItem('remember_me', 'true');
      } catch (createErr) {
        console.error('Erro ao criar usuário demo:', createErr);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Entrar</h2>
                <p className="text-muted">Acesse sua conta na Loja FGT</p>
              </div>

              {/* Erro global */}
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              {/* Formulário */}
              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Senha */}
                <div className="mb-3">
                  <label htmlFor="senha" className="form-label fw-semibold">
                    Senha
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errors.senha ? 'is-invalid' : ''}`}
                      id="senha"
                      name="senha"
                      value={formData.senha}
                      onChange={handleChange}
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                    {errors.senha && (
                      <div className="invalid-feedback">
                        {errors.senha}
                      </div>
                    )}
                  </div>
                </div>                {/* Lembrar-me e Esqueci senha */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="lembrarMe"
                      checked={lembrarMe}
                      onChange={(e) => setLembrarMe(e.target.checked)}
                    />
                    <label className="form-check-label text-sm" htmlFor="lembrarMe">
                      Lembrar-me
                    </label>
                  </div>
                  <Link to="/esqueci-senha" className="text-primary text-decoration-none text-sm">
                    Esqueci minha senha
                  </Link>
                </div>

                {/* Botão de submit */}
                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </span>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Entrar
                    </>
                  )}
                </button>                {/* Divisor */}
                <div className="text-center mb-3">
                  <span className="text-muted">ou</span>
                </div>

                {/* Login Demo */}
                <div className="d-grid gap-2 mb-3">
                  <button 
                    type="button" 
                    className="btn btn-success"
                    onClick={handleDemoLogin}
                    disabled={loading}
                  >
                    <i className="bi bi-lightning-charge me-2"></i>
                    Acesso Rápido (Demo)
                  </button>
                </div>

                {/* Login social (opcional) */}
                <div className="d-grid gap-2">
                  <button type="button" className="btn btn-outline-dark" disabled>
                    <i className="bi bi-google me-2"></i>
                    Continuar com Google
                  </button>
                </div>
              </form>

              {/* Link para cadastro */}
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  Não tem uma conta?{' '}
                  <Link to="/cadastro" className="text-primary text-decoration-none fw-semibold">
                    Cadastre-se aqui
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="text-center mt-3">
            <small className="text-muted">
              Ao fazer login, você concorda com nossos{' '}
              <Link to="/termos" className="text-decoration-none">Termos de Uso</Link>
              {' '}e{' '}
              <Link to="/privacidade" className="text-decoration-none">Política de Privacidade</Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
