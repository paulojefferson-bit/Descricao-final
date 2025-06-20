import react from 'react'
import './Descricao.css';




const Descricao = () => {

    return (
<>
   
    <section className="produto-container">
      <div className="breadcrumb">
        <a href="#">Home /</a>
        <a href="#">Produtos /</a>
        <a href="#">Tênis /</a>
        <a href="#">Nike /</a>
        <span>Tênis Nike Revolution 6 Next Nature Masculino</span>
      </div>
      <div className="produto">
        <div className="galeria">
          <button className="seta esquerda">{`<`}</button>
          <img
            alt="Tênis Nike"
            className="imagem-principal"
            src="/projetofgt/img/White-Sneakers-BANENRlipart 1.svg"
          />
          <button className="seta direita">{`>`}</button>
        </div>
        <div className="detalhes">
          <h2>Tênis Nike Revolution 6 Next Nature Masculino</h2>
          <p className="categoria">Casual | Nike | REF: 4363289</p>
          <div className="avaliacao">
            <span className="estrelas">★★★★★</span>
            <span className="nota">4.7</span>
            <span className="quantidade">(90 avaliações)</span>
          </div>
          <div className="preco">
            <span className="preco-atual">R$ 219,00</span>
            <span className="preco-antigo">230,00</span>
          </div>
          <p className="descricao">
            Tenis super confortavel,otimo para festas,encontros e onde mas voce
            quiser ir,com um otimo designer, perfeito para pessoas que gostam de
            estar na moda e bem vestidos.
          </p>
          <div className="tamanhos">
            <p>Tamanho</p>
            <button className="tamanho">39</button>
            <button className="tamanho">40</button>
            <button className="tamanho">41</button>
            <button className="tamanho">42</button>
            <button className="tamanho">43</button>
          </div>
          <div className="cores">
            <p>Cores</p>
            <span className="cor azul" />
            <span className="cor rosa" />
            <span className="cor cinza" />
            <span className="cor roxo" />
          </div>
          <button className="comprar">COMPRAR</button>
        </div>
      </div>
    </section>
    <div className="miniaturas">
      <div
        className="thumb ativa"
        style={{
          backgroundColor: "#c3eef7",
        }}>
        <img
          alt="Tênis 1"
          src="/projetofgt/img/White-Sneakers-BANENRlipart 1.svg"
        />
      </div>
      <div
        className="thumb"
        style={{
          backgroundColor: "#ffe3a1",
        }}>
        <img
          alt="Tênis 2"
          src="/projetofgt/img/White-Sneakers-BANENRlipart 1.svg"
        />
      </div>
      <div
        className="thumb"
        style={{
          backgroundColor: "#ffc3bf",
        }}>
        <img
          alt="Tênis 3"
          src="/projetofgt/img/White-Sneakers-BANENRlipart 1.svg"
        />
      </div>
      <div
        className="thumb"
        style={{
          backgroundColor: "#e8cd9f",
        }}>
        <img
          alt="Tênis 4"
          src="/projetofgt/img/White-Sneakers-BANENRlipart 1.svg"
        />
      </div>
      <div
        className="thumb"
        style={{
          backgroundColor: "#f0e7d5",
        }}>
        <img
          alt="Tênis 5"
          src="/projetofgt/img/White-Sneakers-BANENRlipart 1.svg"
        />
      </div>
    </div>
    <section className="produtos-relacionados">
      <div className="section-header">
        <h2>Produtos Relacionados</h2>
        <a className="ver todos" href="#">
          Ver todos →
        </a>
      </div>
      <div className="products-grid">
        <div className="product-card">
          <span className="discount-badge">30% OFF</span>
          <img alt="Tênis K-Swiss V8" src="/projetofgt/img/Layer 1aa 2.svg" />
          <p className="category">Tênis</p>
          <h3 className="nome do produto">K-Swiss V8 - Masculino</h3>
          <p className="price">
            <span className="old-price">$200</span>
            <span className="new-price">$100</span>
          </p>
        </div>
        <div className="product-card">
          <span className="discount-badge">30% OFF</span>
          <img alt="Tênis K-Swiss V8" src="/projetofgt/img/Layer 1aa 2.svg" />
          <p className="category">Tênis</p>
          <h3 className="nome do produto">K-Swiss V8 - Masculino</h3>
          <p className="price">
            <span className="old-price">$200</span>
            <span className="new-price">$100</span>
          </p>
        </div>
        <div className="product-card">
          <span className="discount-badge">30% OFF</span>
          <img alt="Tênis K-Swiss V8" src="/projetofgt/img/Layer 1aa 2.svg" />
          <p className="category">Tênis</p>
          <h3 className="nome do produto">K-Swiss V8 - Masculino</h3>
          <p className="price">
            <span className="old-price">$200</span>
            <span className="new-price">$100</span>
          </p>
        </div>
        <div className="product-card">
          <span className="discount-badge">30% OFF</span>
          <img alt="Tênis K-Swiss V8" src="/projetofgt/img/Layer 1aa 2.svg" />
          <p className="category">Tênis</p>
          <h3 className="nome do produto">K-Swiss V8 - Masculino</h3>
          <p className="price">
            <span className="old-price">$200</span>
            <span className="new-price">$100</span>
          </p>
        </div>
      </div>
    </section>
    



</>
)
}

export default Descricao;