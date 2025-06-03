// ATENÇÃO: ESTE ARQUIVO É APENAS PARA TESTES E DEVE SER REMOVIDO ANTES DA PRODUÇÃO
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

// Componente para contornar a autenticação durante testes
const TesteModoAutenticado = () => {
  const [modoTeste, setModoTeste] = useState(false);  const { isAuthenticated } = useAuth();
  // Função para ativar o modo de teste
  const ativarModoTeste = () => {
    // Token de teste para um usuário fictício (joao@email.com) com validade de 1 ano
    // Gerado pelo backend usando a mesma chave secreta
    const tokenTeste = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9hb0BlbWFpbC5jb20iLCJ0aXBvX3VzdWFyaW8iOiJ1c3VhcmlvIiwibm9tZSI6Ikpvw6NvIFNpbHZhIiwiaWF0IjoxNzQ4OTA0NTQ3LCJleHAiOjE3ODA0NjIxNDcsImF1ZCI6ImxvamEtdGVuaXMtZnJvbnRlbmQiLCJpc3MiOiJsb2phLXRlbmlzLWFwaSJ9.Ny8na1F4jcqcPLW2aIV-W8rFe4DfAF5f0rm81Gn0uHY";
    
    // Definir token na API
    api.setToken(tokenTeste);
    
    // Salvar dados do usuário teste no localStorage
    const usuarioTeste = {
      id: 1,
      nome: "João Silva (MODO TESTE)",
      email: "joao@email.com",
      tipo_usuario: "usuario"
    };
    localStorage.setItem('usuario', JSON.stringify(usuarioTeste));
    localStorage.setItem('token', tokenTeste);
    
    // Atualizar estado
    setModoTeste(true);
    
    // Recarregar a página para aplicar as mudanças
    window.location.reload();
  };

  // Função para desativar o modo de teste
  const desativarModoTeste = () => {
    // Limpar token e dados do usuário
    api.clearToken();
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    localStorage.removeItem('modo_teste');
    
    // Atualizar estado
    setModoTeste(false);
    
    // Recarregar a página para aplicar as mudanças
    window.location.reload();
  };

  // Verificar se o modo de teste está ativo ao carregar o componente
  useEffect(() => {
    const testModeActive = localStorage.getItem('modo_teste') === 'true';
    setModoTeste(testModeActive);
  }, []);

  // Salvar o estado do modo de teste no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('modo_teste', modoTeste.toString());
  }, [modoTeste]);

  // Estilo para o componente flutuante
  const style = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: modoTeste ? '#f8d7da' : '#d1e7dd',
    color: modoTeste ? '#842029' : '#0f5132',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  };

  // Estilo para o título
  const titleStyle = {
    fontWeight: 'bold',
    marginBottom: '5px'
  };

  // Estilo para o botão
  const buttonStyle = {
    marginTop: '5px',
    padding: '5px 10px',
    border: 'none',
    borderRadius: '3px',
    backgroundColor: modoTeste ? '#dc3545' : '#198754',
    color: 'white',
    cursor: 'pointer'
  };

  return (
    <div style={style}>
      <div style={titleStyle}>
        {modoTeste ? '🔓 MODO TESTE ATIVO' : '🔒 AUTENTICAÇÃO NORMAL'}
      </div>
      <div>
        Status: {isAuthenticated ? 'Autenticado' : 'Não autenticado'}
      </div>
      <button 
        style={buttonStyle}
        onClick={modoTeste ? desativarModoTeste : ativarModoTeste}
      >
        {modoTeste ? 'Desativar Modo Teste' : 'Ativar Modo Teste'}
      </button>
    </div>
  );
};

export default TesteModoAutenticado;
