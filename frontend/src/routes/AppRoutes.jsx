import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import Cadastro from '../pages/Cadastro';
import PaginaProdutos from '../pages/PaginaProdutos/PaginaProdutos';
import PaginaDetalhesProduto from '../pages/PaginaDetalhesProduto/PaginaDetalhesProduto';
import PaginaCarrinho from '../pages/PaginaCarrinho/PaginaCarrinho';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import SucessoPage from '../pages/Checkout/SucessoPage';

// Novos componentes integrados
import Login from '../components/auth/Login';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import CarrinhoIntegrado from '../components/carrinho/CarrinhoIntegrado';
import CheckoutIntegrado from '../components/checkout/CheckoutIntegrado';
import PerfilUsuario from '../components/usuario/PerfilUsuario';
import ListaProdutos from '../components/produtos/ListaProdutos';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/produtos" element={<PaginaProdutos />} />
      <Route path="/produtos-integrados" element={<ListaProdutos />} />
      <Route path="/produto/:id" element={<PaginaDetalhesProduto />} />
      <Route path="/sobre" element={<h1 className="text-center mt-5">Sobre</h1>} />
      <Route path="/contato" element={<h1 className="text-center mt-5">Contato</h1>} />
      <Route path="/termos" element={<h1 className="text-center mt-5">Termos e Condições</h1>} />
      <Route path="/devolucoes" element={<h1 className="text-center mt-5">Trocas e Devoluções</h1>} />
      
      {/* Rotas de autenticação */}
      <Route 
        path="/login" 
        element={
          <ProtectedRoute requireAuth={false}>
            <Login />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/cadastro" 
        element={
          <ProtectedRoute requireAuth={false}>
            <Cadastro />
          </ProtectedRoute>
        } 
      />

      {/* Rotas do carrinho */}
      <Route path="/carrinho" element={<PaginaCarrinho />} />
      <Route path="/carrinho-integrado" element={<CarrinhoIntegrado />} />
      
      {/* Rotas protegidas */}
      <Route 
        path="/checkout" 
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/checkout-integrado" 
        element={
          <ProtectedRoute>
            <CheckoutIntegrado />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <PerfilUsuario />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/minha-conta" 
        element={
          <ProtectedRoute>
            <PerfilUsuario />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <PerfilUsuario />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/meus-pedidos" 
        element={
          <ProtectedRoute>
            <PerfilUsuario />
          </ProtectedRoute>
        } 
      />
      
      {/* Rota de sucesso */}
      <Route path="/sucesso" element={<SucessoPage />} />
        {/* Rotas de desenvolvimento */}
      <Route path="/categorias" element={<h1 className="text-center mt-5">Página em desenvolvimento</h1>} />
      
      {/* Página 404 */}
      <Route path="*" element={<h1 className="text-center mt-5">Página não encontrada</h1>} /> 
    </Routes>
  );
};

export default AppRoutes;
