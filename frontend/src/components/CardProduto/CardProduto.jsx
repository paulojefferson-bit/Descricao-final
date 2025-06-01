/**
 * CardProduto
 * 
 * Componente que renderiza um card de produto na visualização em grade.
 * Responsável por exibir as informações principais do produto e permitir
 * interações como adicionar ao carrinho e comparar produtos.
 * 
 * Features:
 * - Exibição de imagem com efeito hover
 * - Badge de desconto
 * - Sistema de avaliação com estrelas
 * - Preços e economia
 * - Botões de ação (carrinho e comparação)
 * - Notificação toast ao adicionar ao carrinho
 */

import React, { useEffect, useState } from 'react';
import { Card, Button, Toast, ToastContainer } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCarrinho } from '../../context/ContextoCarrinho';
import { BsStarFill, BsStarHalf, BsStar, BsCartPlus, BsBarChart, BsDashCircle, BsEye } from 'react-icons/bs';
import './CardProduto.css';

/**
 * Formata o preço para o padrão brasileiro (R$ X,XX)
 * @param {number} valor - Valor a ser formatado
 * @returns {string} Preço formatado
 */
const formatarPreco = (valor) => `R$${valor.toFixed(2).replace('.', ',')}`;

/**
 * Componente que renderiza as estrelas de avaliação
 * @param {Object} props - Propriedades do componente
 * @param {number} props.avaliacao - Nota da avaliação (0-5)
 */
const EstrelasAvaliacao = ({ avaliacao }) => {
  const estrelas = [];
  const completas = Math.floor(avaliacao);
  const meia = avaliacao % 1 >= 0.5;
  
  for (let i = 0; i < completas; i++) {
    estrelas.push(<BsStarFill key={`estrela-${i}`} />);
  }
  
  if (meia) {
    estrelas.push(<BsStarHalf key="meia-estrela" />);
  }
  
  while (estrelas.length < 5) {
    estrelas.push(<BsStar key={`vazia-${estrelas.length}`} />);
  }

  return <>{estrelas}</>;
};

/**
 * Componente principal do card de produto
 */
const CardProduto = ({ produto, estaSelecionado = false, aoAlternarComparacao }) => {
  const { adicionarAoCarrinho } = useCarrinho();
  const [mostrarToast, setMostrarToast] = useState(false);

  // Desestruturação das propriedades do produto
  const {
    id,
    brand: marca,
    name: nome,
    image: imagem,
    oldPrice: precoAntigo,
    currentPrice: precoAtual,
    discount: desconto,
    rating: avaliacao,
    reviewCount: numeroAvaliacoes
  } = produto;

  /**
   * Manipula o evento de adicionar ao carrinho
   * Adiciona o produto e mostra uma notificação
   */
  const handleAdicionarAoCarrinho = () => {
    adicionarAoCarrinho(produto);
    setMostrarToast(true);
  };

  // Controla a exibição do toast
  useEffect(() => {
    if (!mostrarToast) return;
    const timer = setTimeout(() => setMostrarToast(false), 3000);
    return () => clearTimeout(timer);
  }, [mostrarToast]);

  return (
    <>
      <article className="col">
        <div className={`card_produto ${estaSelecionado ? 'card_produto--selected' : ''}`}>
          {/* Badge de Desconto */}
          {desconto > 0 && (
            <div className="card_produto__desconto_area">
              <span className="card_produto__desconto">-{desconto}% OFF</span>
            </div>
          )}

          {/* Área da Imagem com Overlay */}
          <div className="card_produto__area_imagem">
            <Link to={`/produtos/${id}`}>
              <img 
                src={imagem} 
                alt={nome} 
                className="card_produto__imagem" 
              />
              <div className="card_produto__imagem_overlay">
                <span className="card_produto__visualizacao_rapida">
                  <BsEye className="me-1" /> Ver detalhes
                </span>
              </div>
            </Link>
          </div>

          {/* Corpo do Card */}
          <div className="card_produto__corpo">
            {/* Informações do Produto */}
            <p className="card_produto__marca">{marca}</p>
            <h3 className="card_produto__titulo">
              <Link to={`/produtos/${id}`} className="text-decoration-none text-dark">
                {nome}
              </Link>
            </h3>

            {/* Área de Avaliação */}
            <div className="card_produto__avaliacao_area">
              <div className="card_produto__avaliacao_estrelas">
                <EstrelasAvaliacao avaliacao={avaliacao} />
              </div>
              <span className="card_produto__avaliacao_total">
                ({numeroAvaliacoes})
              </span>
            </div>

            {/* Área de Preço */}
            <div className="card_produto__preco_area">
              {precoAntigo && (
                <>
                  <del className="card_produto__preco_antigo">
                    {formatarPreco(precoAntigo)}
                  </del>
                  {desconto > 0 && (
                    <span className="card_produto__economia">
                      Economize {formatarPreco(precoAntigo - precoAtual)}
                    </span>
                  )}
                </>
              )}
              <span className="card_produto__preco_atual">
                {formatarPreco(precoAtual)}
              </span>
            </div>

            {/* Botões de Ação */}
            <div className="d-flex gap-2">
              <button
                className="card_produto__botao_carrinho flex-grow-1"
                onClick={handleAdicionarAoCarrinho}
                aria-label="Adicionar ao carrinho"
              >
                <BsCartPlus className="card_produto__icone_carrinho" /> 
                Adicionar
              </button>

              {aoAlternarComparacao && (
                <button
                  className={`card_produto__botao_comparar ${
                    estaSelecionado ? 'card_produto__botao_comparar--selecionado' : ''
                  }`}
                  onClick={aoAlternarComparacao}
                  aria-label={
                    estaSelecionado ? "Remover da comparação" : "Adicionar à comparação"
                  }
                >
                  {estaSelecionado ? <BsDashCircle /> : <BsBarChart />}
                </button>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Toast de Notificação */}
      <ToastContainer position="bottom-right" className="p-3">
        <Toast 
          onClose={() => setMostrarToast(false)} 
          show={mostrarToast} 
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Produto adicionado</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            {nome} foi adicionado ao carrinho com sucesso!
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default CardProduto;
