import React from 'react';
import './HomeProdutos.modules.css'

const ProdutosEmAlta = () => {
  // Exemplo de array com produtos repetidos (pode ser substituído por dados reais)
  const produtos = new Array(8).fill({
    id: 1,
    categoria: 'Tênis',
    nome: 'K-Swiss V8 - Masculino',
    imagem: 'img/Layer 1aa 2.svg',
    precoAntigo: '$200',
    precoAtual: '$100',
    desconto: '30% OFF',
  });

  return (
    <section className="container mb-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Produtos em alta</h4>
        <a href="produtos.html" style={{ textDecoration: 'none' }}>Ver todos →</a>
      </div>

      <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-3">
        {produtos.map((produto, index) => (
          <div className="col card-pro" key={index}>
            <div className="card product-card p-3 border-0 rounded-2 text-center bg-white">
              {produto.desconto && (
                <span
                  className="badge badge-sale align-self-start"
                  style={{ backgroundColor: '#ffc107', color: '#000', alignSelf: 'flex-start' }}
                >
                  {produto.desconto}
                </span>
              )}
              <img src={produto.imagem} className="w-100 my-2" alt={produto.nome} />
            </div>
            <div className="mt-2 text-start">
              <h6 style={{ color: '#828080' }}>{produto.categoria}</h6>
              <a href="produtos.html" style={{ textDecoration: 'none', color: '#000' }}>
                {produto.nome}
              </a>
              <p className="text-muted mb-1">
                <s>{produto.precoAntigo}</s>{' '}
                <strong>{produto.precoAtual}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProdutosEmAlta;
