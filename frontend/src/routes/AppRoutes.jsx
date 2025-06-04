import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import Cadastro from '../pages/Cadastro';
import PaginaProdutos from '../pages/PaginaProdutos/PaginaProdutos';
import PaginaDetalhesProduto from '../pages/PaginaDetalhesProduto/PaginaDetalhesProduto';
import PaginaCarrinho from '../pages/PaginaCarrinho/PaginaCarrinho';
import CheckoutPage from '../pages/Checkout/CheckoutPage';
import SucessoPage from '../pages/Checkout/SucessoPage';
import TesteAPI from '../components/TesteAPI/TesteAPI';
import Login from '../components/auth/Login';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />      <Route path="/produtos" element={<PaginaProdutos />} />
      <Route path="/produto/:id" element={<PaginaDetalhesProduto />} />
      <Route path="/carrinho" element={<PaginaCarrinho />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/sucesso" element={<SucessoPage />} />
      <Route path="/categorias" element={<h1 className="text-center mt-5">Página em desenvolvimento</h1>} />
      <Route path="/meus-pedidos" element={<h1 className="text-center mt-5">Meus Pedidos</h1>} />
      <Route path="/sobre" element={<h1 className="text-center mt-5">Sobre</h1>} />
      <Route path="/contato" element={<h1 className="text-center mt-5">Contato</h1>} />
      <Route path="/termos" element={<h1 className="text-center mt-5">Termos e Condições</h1>} />
      <Route path="/devolucoes" element={<h1 className="text-center mt-5">Trocas e Devoluções</h1>} />
      <Route path="*" element={<h1 className="text-center mt-5">Página em desenvolvimento</h1>} /> 
    </Routes>
  );
};

export default AppRoutes;
