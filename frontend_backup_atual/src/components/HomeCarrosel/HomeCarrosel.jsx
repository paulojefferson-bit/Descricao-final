import React from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './HomeCarrosel.css';


const CarroseHome = () => {
  return (
    <>
      {/* Carrossel */}
      <div id="promoCarousel" className="carousel slide bg-light py-5" data-bs-ride="carousel">
        <div className="carousel-inner container">

          {/* Slide 1 */}
          <div className="carousel-item active">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p className="text-warning fw-semibold mb-2">Melhores ofertas personalizadas</p>
                <h2 className="fw-bold">Queima de estoque Nike 🔥</h2>
                <p className="text-secondary">
                  Compre agora e receba até metade do mês com frete reduzido em seleção especial.
                </p>
                <Link to="/produtos" className="btn btn-danger">Ver ofertas</Link>
              </div>
              <div className="col-md-6 text-center">
                <div style={{ backgroundImage: "url('img/Ornament 11.svg')", backgroundRepeat: "no-repeat", backgroundPosition: "top"}}>
                  <img src="../img/White-Sneakers-BANENRlipart 1.svg" className="img-fluid w-100" alt="Nike Promo"/>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p className="text-warning fw-semibold mb-2">Ofertas imperdíveis</p>
                <h2 className="fw-bold">Nova coleção Adidas 👟</h2>
                <p className="text-secondary">
                  Confira os modelos mais desejados com descontos exclusivos por tempo limitado.
                </p>
                <Link to="/produtos" className="btn btn-danger">Ver coleção</Link>
              </div>
              <div className="col-md-6 text-center">
                <div
                  style={{
                    backgroundImage: "url('img/Ornament 11.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top"
                  }}
                >
                  <img
                    src="img/White-Sneakers-BANENRlipart 1.svg"
                    className="img-fluid"
                    alt="Adidas Promo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div className="carousel-item mt-1">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start">
                <p className="text-warning fw-semibold mb-2">Só hoje!</p>
                <h2 className="fw-bold">Frete grátis em todo site 🚚</h2>
                <p className="text-secondary">
                  Aproveite para comprar com frete 100% gratuito e mais benefícios exclusivos.
                </p>
                <Link to="/produtos" className="btn btn-danger">Comprar agora</Link>
              </div>
              <div className="col-md-6 text-center">
                <div
                  style={{
                    backgroundImage: "url('img/Ornament 11.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top"
                  }}
                >
                  <img
                    src="img/White-Sneakers-BANENRlipart 1.svg"
                    className="img-fluid"
                    alt="Frete Grátis"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#promoCarousel"
          data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#promoCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Próximo</span>
        </button>

        {/* Indicadores */}
        <div className="carousel-indicators mt-4">
          <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#promoCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
      </div>
    </>
  )
}

export default CarroseHome