import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './HomeColecaoDestaque.modules.css'


const Destaques = () => {
    return (
        <>
            <section className="py-5 bg-light">
                <div className="container">
                    <h4 className="fw-bold mb-4">Coleções em destaque</h4>
                    <div className="row g-3">

                        {/* Card 1 */}
                        <div className="col-md-4 col-12">
                            <div
                                className="card h-100 shadow-sm"
                                style={{
                                    backgroundColor: '#D8E3F2',
                                     backgroundImage:
                                        "url('img/star-wars-storm-trooper-supreme-shirts-supreme-t-shirt-snoopy-clothing-apparel-t-shirt-text-transparent-png-616696 1.svg')",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right',
                                }}
                            >
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <span
                                            className="badge text-dark mb-2"
                                            style={{ backgroundColor: 'rgba(231, 255, 134, 1)' }}
                                        >
                                            30% OFF
                                        </span>                                        <h5 className="fw-bold">
                                            Coleção <br /> Novo drop Supreme
                                        </h5>
                                    </div>
                                    <Link to="/produtos" className="btn btn-light text-danger mt-3 w-50 fw-semibold">
                                        Comprar
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="col-md-4 col-12">
                            <div
                                className="card h-100 shadow-sm"
                                style={{
                                    backgroundColor: '#D8E3F2',
                                    backgroundImage: "url('../img/ddd 1.svg')",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right',
                                }}
                            >
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <span
                                            className="badge text-dark mb-2"
                                            style={{ backgroundColor: 'rgba(231, 255, 134, 1)' }}
                                        >
                                            30% OFF
                                        </span>
                                        <h5 className="fw-bold">
                                            Coleção <br /> Adidas
                                        </h5>
                                    </div>
                                    <button className="btn btn-light text-danger mt-3 w-50 fw-semibold">
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="col-md-4 col-12">
                            <div
                                className="card h-100 shadow-sm"
                                style={{
                                    backgroundColor: '#D8E3F2',
                                    backgroundImage: "url('img/fooone.svg')",
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right',
                                }}
                            >
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <span
                                            className="badge text-dark mb-2"
                                            style={{ backgroundColor: 'rgba(231, 255, 134, 1)' }}
                                        >
                                            30% OFF
                                        </span>
                                        <h5 className="fw-bold">
                                            Novo <br /> Beats Bass
                                        </h5>
                                    </div>
                                    <button className="btn btn-light text-danger mt-3 w-50 fw-semibold">
                                        Comprar
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Colecoes em destaque2 */}
            <section className="py-5 bg-light text-center">
                <h3 className="fw-bold mb-4">Coleções em destaque</h3>
                <div className="d-flex flex-nowrap overflow-auto px-3 gap-3 justify-content-center">
                    {/* Item 1 */}
                    <div className="collection-item text-center flex-shrink-0" style={{ width: '120px' }}>
                        <div
                            className="rounded-circle bg-white shadow p-3 mx-auto"
                            style={{ width: '100px', height: '100px' }}>
                            <img
                                src="../img/Group camisa.svg"
                                alt="Camisetas"
                                className="img-fluid"
                                style={{ height: '60px' }}/>
                        </div>
                        <p className="mt-2 fw-semibold">Camisetas</p>
                    </div>

                    {/* Item 2 */}
                    <div className="collection-item text-center flex-shrink-0" style={{ width: '120px' }}>
                        <div
                            className="rounded-circle bg-white shadow p-3 mx-auto"
                            style={{ width: '100px', height: '100px' }}
                        >                            <img
                                src="../img/calça.svg"
                                alt="Calças"
                                className="img-fluid"
                                style={{ height: '60px' }}
                            />
                        </div>
                        <p className="mt-2 fw-semibold">Calças</p>
                    </div>

                    {/* Item 3 */}
                    <div className="collection-item text-center flex-shrink-0" style={{ width: '120px' }}>
                        <div
                            className="rounded-circle bg-white shadow p-3 mx-auto"
                            style={{ width: '100px', height: '100px' }}
                        >
                            <img
                                src="img/calça.svg"
                                alt="Bonés"
                                className="img-fluid"
                                style={{ height: '60px' }}
                            />
                        </div>
                        <p className="mt-2 fw-semibold">Bonés</p>
                    </div>

                    {/* Item 4 */}
                    <div className="collection-item text-center flex-shrink-0" style={{ width: '120px' }}>
                        <div
                            className="rounded-circle bg-white shadow p-3 mx-auto"
                            style={{ width: '100px', height: '100px' }}
                        >
                            <img
                                src="../img/fonecole.svg"
                                alt="Headphones"
                                className="img-fluid"
                                style={{ height: '60px' }}
                            />
                        </div>
                        <p className="mt-2 fw-semibold">Headphones</p>
                    </div>

                    {/* Item 5 */}
                    <div className="collection-item text-center flex-shrink-0" style={{ width: '120px' }}>
                        <div
                            className="rounded-circle bg-white shadow p-3 mx-auto"
                            style={{ width: '100px', height: '100px' }}
                        >
                            <img
                                src="../img/sneakers.svg"
                                alt="Tênis"
                                className="img-fluid"
                                style={{ height: '60px' }}
                            />
                        </div>
                        <p className="mt-2 fw-semibold">Tênis</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Destaques;
