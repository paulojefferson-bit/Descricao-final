import styles from './FormResumo.module.css'
import Sneakers from "../../assets/finalizarCompra/Sneakers.svg"

const FormResumo = ({ carrinho = [], subtotal = 0, frete = 0, desconto = 0, total = 0, formatarMoeda }) => {
  // Função padrão de formatação se não for passada
  const formatar = formatarMoeda || ((valor) => `R$ ${Number(valor).toFixed(2).replace('.', ',')}`);

    return (
      <>
        {/* CARD RESUMO (MOBILE) */}
        <fieldset className="d-block d-md-none col-12 bg-white d-flex flex-column p-5">
          <h3>Resumo</h3>
          <hr />
          
          {/* Listar itens do carrinho */}
          <div className="mb-3">
            {carrinho.length > 0 ? (
              carrinho.map((item, index) => (
                <div key={item.id || index} className="d-flex align-items-center gap-3 mb-3">
                  <div className={styles.imgResumo}>
                    <img 
                      src={item.image || Sneakers} 
                      alt={item.name || "Produto"} 
                      style={{ maxWidth: '60px', height: 'auto' }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">{item.name || "Produto sem nome"}</p>
                    <small className="text-muted">
                      Qtd: {item.quantidade} x {formatar(item.currentPrice)}
                    </small>
                  </div>
                  <div>
                    <strong>{formatar(item.currentPrice * item.quantidade)}</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex align-items-center gap-3">
                <div className={styles.imgResumo}>
                  <img src={Sneakers} alt="Nenhum produto" />
                </div>
                <div>
                  <p>Nenhum item no carrinho</p>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <div>
              <p className="opacity-50">Subtotal:</p>
              <p className="opacity-50">Frete:</p>
              <p className="opacity-50">Desconto:</p>
            </div>
            <div>
              <p>{formatar(subtotal)}</p>
              <p>{formatar(frete)}</p>
              <p>{formatar(desconto)}</p>
            </div>
          </div>

          <div className={styles.resumoTotal}>
            <div>
              <h3>Total</h3>
            </div>
            <div>
              <p className="m-0 text-end h3 fw-semibold">{formatar(total)}</p>
              <small className="opacity-50">
                ou 10x de {formatar(total / 10)} sem juros
              </small>
            </div>
          </div>

          <button
            className="btn btn-warning text-white fw-bold p-2"
            type="submit"
            disabled={carrinho.length === 0}
          >            Realizar Pagamento
          </button>
        </fieldset>
        

        {/* CARD RESUMO DESKTOP */}
        <fieldset className="d-none d-md-block bg-white d-flex flex-column p-5">
          <h3>Resumo</h3>
          <hr />
          
          {/* Listar itens do carrinho */}
          <div className="mb-3">
            {carrinho.length > 0 ? (
              carrinho.map((item, index) => (
                <div key={item.id || index} className="d-flex align-items-center gap-3 mb-3">
                  <div className={styles.imgResumo}>
                    <img 
                      src={item.image || Sneakers} 
                      alt={item.name || "Produto"} 
                      style={{ maxWidth: '80px', height: 'auto' }}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <p className="mb-1">{item.name || "Produto sem nome"}</p>
                    <small className="text-muted">
                      Qtd: {item.quantidade} x {formatar(item.currentPrice)}
                    </small>
                  </div>
                  <div>
                    <strong>{formatar(item.currentPrice * item.quantidade)}</strong>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex align-items-center gap-3">
                <div className={styles.imgResumo}>
                  <img src={Sneakers} alt="Nenhum produto" />
                </div>
                <div>
                  <p>Nenhum item no carrinho</p>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div className="d-flex justify-content-between">
            <div>
              <p className="opacity-50">Subtotal:</p>
              <p className="opacity-50">Frete:</p>
              <p className="opacity-50">Desconto:</p>
            </div>
            <div>
              <p>{formatar(subtotal)}</p>
              <p>{formatar(frete)}</p>
              <p>{formatar(desconto)}</p>
            </div>
          </div>

          <div className={styles.resumoTotal}>
            <div>
              <h3>Total</h3>
            </div>
            <div>
              <p className="m-0 text-end h3 fw-semibold">{formatar(total)}</p>
              <small className="opacity-50">
                ou 10x de {formatar(total / 10)} sem juros
              </small>
            </div>
          </div>

          <button
            className="btn btn-warning text-white fw-bold p-2"
            type="submit"
            disabled={carrinho.length === 0}
          >
            Realizar Pagamento
          </button>
        </fieldset>
      </>
    );
}

export default FormResumo