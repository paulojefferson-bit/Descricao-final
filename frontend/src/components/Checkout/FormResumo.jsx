import styles from './FormResumo.module.css'
import Sneakers from "../../assets/finalizarCompra/Sneakers.svg"

const FormResumo = () => {

    return (
      <>
        {/* CARD RESUMO (MOBILE) */}
        <fieldset className="d-block d-md-none col-12 bg-white d-flex flex-column p-5">
          <h3>Resumo</h3>
          <hr />
          <div className="d-flex align-items-center gap-3">
            <div className={styles.imgResumo}>
              <img src={Sneakers} alt="img de tenis" />
            </div>
            <div>
              <p>Tênis Nike Revolution 6 Next Nature Masculino</p>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <div>
              <p className="opacity-50">subtotal:</p>
              <p className="opacity-50">Frete:</p>
              <p className="opacity-50">Desconto: </p>
            </div>
            <div>
              <p>R$: 219,00</p>
              <p>R$: 0,00</p>
              <p>R$: 30,00</p>
            </div>
          </div>

          <div className={styles.resumoTotal}>
            <div>
              <h3>Total </h3>
            </div>
            <div>
              <p className="m-0 text-end h3 fw-semibold">R$: 219,00</p>
              <small className="opacity-50">
                ou 10x de R$: 21,00 sem juros
              </small>
            </div>
          </div>

          <button
            className="btn btn-warning text-white fw-bold p-2 "
            type="submit"
          >
            Realizar Pagamento
          </button>
        </fieldset>
        

        {/* CARD RESUMO DESKTOP */}
        <fieldset className="d-none d-md-block bg-white d-flex flex-column p-5">
          <h3>Resumo</h3>
          <hr />
          <div className="d-flex align-items-center gap-3">
            <div className={styles.imgResumo}>
              <img src={Sneakers} alt="img de tenis" />
            </div>
            <div>
              <p>Tênis Nike Revolution 6 Next Nature Masculino</p>
            </div>
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <div>
              <p className="opacity-50">Subtotal:</p>
              <p className="opacity-50">Frete:</p>
              <p className="opacity-50">Desconto: </p>
            </div>
            <div>
              <p>R$: 210,00</p>
              <p>R$: 0,00</p>
              <p>R$: 30,00</p>
            </div>
          </div>

          <div className={styles.resumoTotal}>
            <div>
              <h3>Total </h3>
            </div>
            <div>
              <p className="m-0 text-end h3 fw-semibold">R$: 180,00</p>
              <small className="opacity-50">
                ou 10x de R$: 18,00 sem juros
              </small>
            </div>
          </div>

          <button
            className="btn btn-warning text-white fw-bold p-2 "
            type="submit"
          >
            Realizar Pagamento
          </button>
        </fieldset>
      </>
    );
}

export default FormResumo