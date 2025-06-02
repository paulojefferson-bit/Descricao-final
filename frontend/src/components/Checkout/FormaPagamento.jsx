import { useState } from "react"
import visaImg from '../../assets/cartaoLogo/visa.png'
import mastercardImg from '../../assets/cartaoLogo/master.png'
import amexImg from '../../assets/cartaoLogo/amex.png'
import eloImg from '../../assets/cartaoLogo/elo.png'
import hipercardImg from '../../assets/cartaoLogo/hipercard.png'

const FormaPagamento = ({ formDados, setFormDados}) => {

  const handleMetodoChange = (e) => {
    const metodoSelecionado = e.target.value
    setFormDados((prev) => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        metodo: metodoSelecionado        
      }
    }))
  }

  const metodo = formDados.pagamento.metodo

  const bandeirasImgs = {
    visa: visaImg,
    mastercard: mastercardImg,
    amex: amexImg,
    elo: eloImg,
    hipercard: hipercardImg,
  };

  const detectarBandeira = (numero) => {
    const bandeiras = {
      visa: /^4[0-9]{0,}$/,
      mastercard: /^5[1-5][0-9]{0,}$/,
      amex: /^3[47][0-9]{0,}$/,
      elo: /^6(?:011|5[0-9]{2})[0-9]{0,}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{0,}$/,
      hipercard: /^(38|60)[0-9]{0,}$/,
    };

    for (let nome in bandeiras) {
      if (bandeiras[nome].test(numero)) {
        return nome;
      }
    }

    return null;
  };

  const [numeroCartao, setNumeroCartao] = useState('')
  const [bandeira, setBandeira] = useState(null)

  const handleNumeroCartaoChange = (e) => {
    const valor = e.target.value.replace(/\D/g, '');
    setNumeroCartao(valor);

    setFormDados((prev) => ({
      ...prev,
      pagamento: {
        ...prev.pagamento,
        cartao: { 
          ...prev.pagamento.cartao,
          numeroCartao: valor

        }
      }

    }))

    

    const detectada = detectarBandeira(valor)
    setBandeira(detectada)
    
    console.log('Número:', valor, 'Bandeira detectada:', detectada); // Para debug
  };

  const handleNomeCartaoChange = (e) => {
  const valor = e.target.value;
  setFormDados((prev) => ({
    ...prev,
    pagamento: {
      ...prev.pagamento,
      cartao: {
        ...prev.pagamento.cartao,
        nomeCartao: valor
      }
    }
  }));
}


  const getImagemBandeira = (nome) => {
    return bandeirasImgs[nome] || null;
  };

  return (
    <div>
      <div className="bg-white my-3 mb-2 d-flex flex-column p-5 gap-2">
        <h3 className="fw-bold">Informações de Pagamento</h3>
        <hr />

        <h4>Forma de pagamento</h4>
        <div className="d-flex flex-column flex-md-row gap-5 mb-2">
          <div className="d-flex gap-2">
            <input
              type="radio"
              name="metodo"
              id="cartao"
              value="cartao"
              checked={formDados.pagamento.metodo === "cartao"}
              onChange={handleMetodoChange}
            />
            <label htmlFor="cartao">Cartão de Crédito ou Débito</label>
          </div>

          <div className="d-flex gap-2">
            <input
              type="radio"
              name="metodo"
              id="pix"
              value="pix"
              checked={formDados.pagamento.metodo === "pix"}
              onChange={handleMetodoChange}
            />
            <label htmlFor="pix">Pix</label>
          </div>

          <div className="d-flex gap-2">
            <input
              type="radio"
              name="metodo"
              id="boleto"
              value="boleto"
              checked={formDados.pagamento.metodo === 'boleto'}
              onChange={handleMetodoChange}
            />
            <label htmlFor="boleto">Boleto</label>
          </div>
        </div>

        <div>
          {metodo === "cartao" && (
            <div>
              <label htmlFor="nomeCartao">Nome do Cartão *</label>
              <input
                className="form-control opacity-50"
                type="text"
                name="nomeCartao"
                id="nomeCartao"
                minLength={10}
                maxLength={50}
                required
                placeholder="Insira o nome do Cartão"
                onChange={handleNomeCartaoChange}
                value={formDados.pagamento.cartao.nomeCartao}
              />

              <div className="mt-3 ">
                <div className="d-flex flex-column flex-md-row justify-content-between">
                  <div>
                    <label htmlFor="numeroCartao">Numero do Cartão *</label>
                    <input
                      className="form-control opacity-50"
                      type="text"
                      name="numeroCartao"
                      id="numeroCartao"
                      required
                      placeholder="Insira o numero do Cartão"
                      minLength={16}
                      maxLength={16}
                      onChange={handleNumeroCartaoChange}
                      value={numeroCartao}
                    />

                    {bandeira && (
                      <img 
                        src={getImagemBandeira(bandeira)}
                        alt={`Bandeira ${bandeira}`}
                        style={{ 
                          width: '40px', 
                          height: 'auto',
                          marginTop: '10px'
                        }}
                        onError={(e) => {
                          console.error('Erro ao carregar imagem da bandeira:', bandeira);
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                  </div>
                  <div>
                    <label htmlFor="validadeCartao">
                      Data de validade do Cartão
                    </label>
                    <input
                      className="form-control opacity-50"
                      type="date"
                      name="validadeCartao"
                      id="validadeCartao"
                      required
                      placeholder="Insira a validade do Cartão"
                    />
                  </div>
                </div>
              </div>
              <label htmlFor="ccv"> CVV *</label>
              <input
                type="text"
                name="ccv"
                id="ccv"
                required
                placeholder="Insira o CVV"
                className="form-control opacity-50"
                pattern="[0-9]{1,3}"
                minLength={3}
                maxLength={3}
              />
            </div>
          )}

          {metodo === 'boleto' && (
              <div className='mt-5'>
                  <h3 className='text-center'>O <strong>boleto </strong> será gerado após a finalização do cadastro.</h3>                  
              </div>
          )}

          {metodo === 'pix' && (
             <div className='mt-5'>
                  <h3 className='text-center'>O <strong>QR CODE </strong> será gerado após a finalização do cadastro.</h3>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormaPagamento