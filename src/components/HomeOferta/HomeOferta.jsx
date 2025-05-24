import React from "react";

const OfertaExclusiva = () => {
  return (
    <section
      className="container-fluid mt-5 py-5"
      style={{ backgroundColor: "white" }}
    >
      <div className="row align-items-center">
        <div
          className="col-md-6 col-12 mb-4 mb-md-0 d-flex "
          style={{
            backgroundImage: "url('img/Ellipse 11.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}>
          <img
            src="img/Laye 1.svg"
            className="img-fluid mt-5"
            alt="Air Jordan"
            style={{ maxHeight: "300px" }}
          />
        </div>
        <div className="col-md-6 col-12 text-center text-md-start">
          <small className="text-danger fw-semibold">Oferta exclusiva</small>
          <h4 className="fw-bold mt-2">Air Jordan edição de colecionador</h4>
          <p className="text-muted">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Maxime
            dolorem unde voluptatibus!
          </p>
          <a href="#" className="btn btn-danger">
            Comprar agora
          </a>
        </div>
      </div>
    </section>
  );
};

export default OfertaExclusiva;
