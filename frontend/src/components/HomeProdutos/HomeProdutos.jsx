import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { produtosService } from '../../services';
import './HomeProdutos.modules.css';

const ProdutosEmAlta = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarProdutosEmAlta = async () => {
      try {
        setCarregando(true);
        // Buscar produtos mais vendidos ou com melhor avaliação
        const resposta = await produtosService.buscarTodos({
          // Usando o nome correto do parâmetro conforme esperado pelo backend
          ordenar_por: 'avaliacao_desc',
          limite: 8
        });

        if (resposta.sucesso) {
          setProdutos(resposta.dados || []);
        } else {
          setErro('Erro ao carregar produtos');
        }
      } catch (error) {
        console.error('Erro ao buscar produtos em alta:', error);
        setErro('Erro ao carregar produtos');
      } finally {
        setCarregando(false);
      }
    };

    buscarProdutosEmAlta();
  }, []);

  if (carregando) {
    return (
      <section className="container mb-5">
        <div className="d-flex justify-content-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </section>
    );
  }

  if (erro) {
    return (
      <section className="container mb-5">
        <div className="alert alert-warning" role="alert">
          {erro}
        </div>
      </section>
    );
  }

  if (produtos.length === 0) {
    return (
      <section className="container mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold mb-0">Produtos em alta</h4>
          <Link to="/produtos" style={{ textDecoration: 'none' }}>Ver todos →</Link>
        </div>
        <div className="alert alert-info">
          Nenhum produto em destaque no momento
        </div>
      </section>
    );
  }

  return (
    <section className="container mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Produtos em alta</h4>
        <Link to="/produtos" style={{ textDecoration: 'none' }}>Ver todos →</Link>
      </div>

      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
        {produtos.map((produto) => (
          <div className="col card-pro" key={produto.id}>
            <div className="card product-card p-3 border-0 rounded-2 text-center bg-white">
              {produto.desconto && produto.desconto > 0 && (
                <span
                  className="badge badge-sale align-self-start"
                  style={{ backgroundColor: '#ffc107', color: '#000', alignSelf: 'flex-start' }}
                >
                  {produto.desconto}% OFF
                </span>
              )}
              <img 
                src={produto.imagem || '/tenis_produtos.png'} 
                className="w-100 my-2" 
                alt={produto.nome}
                onError={(e) => {e.target.src = '/tenis_produtos.png'}}
              />
            </div>
            <div className="mt-2 text-start">
              <h6 style={{ color: '#828080' }}>{produto.categoria || 'Tênis'}</h6>
              <Link to={`/produto/${produto.id}`} style={{ textDecoration: 'none', color: '#000' }}>
                {produto.nome}
              </Link>              <p className="text-muted mb-1">
                {produto.preco_antigo && <s>R$ {Number(produto.preco_antigo).toFixed(2)}</s>}{' '}
                <strong>R$ {Number(produto.preco_atual).toFixed(2)}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProdutosEmAlta;
