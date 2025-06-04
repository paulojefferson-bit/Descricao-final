import { useEffect, useState } from "react"

function FormCep({ formDados, setFormDados }) {

const [cep, setCep] = useState('')


  useEffect(() => {
    const fetchEndereco = async () => {
      if (cep.length !== 8) return;

      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
          alert('CEP não encontrado.');
          return;
        }

        setFormDados((prev) =>({
          ...prev,
          entrega: {
            ...prev.entrega,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            cep: data.cep,
            complemento: data.complemento

          }
        }))
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
      }
    };

    fetchEndereco();
  }, [cep, setFormDados]);

  const handleCepChange = (e) => {
    const valor = e.target.value.replace(/\D/g, ''); // remove tudo que não for número
    setCep(valor);
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormDados((prev) => ({
      ...prev,
      entrega: {
        ...prev.entrega,
        [name]:value
      }
    }))
  }
  
        

    return(          
            <div className="bg-white my-3 mb-2 d-flex flex-column p-5">
                    <h5>Informações de Entrega</h5>
                    <hr />

                    <label htmlFor="cep">CEP *</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="cep"
                      required
                      placeholder="Insira seu CEP sem o traço"
                      pattern="[0-9]{1,8}"
                      maxLength={8}
                      value={cep}
                      onChange={handleCepChange}
                    />

                    <label htmlFor="rua">Rua *</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="rua"
                      required
                      placeholder="Insira seu endereço"
                      minLength="10"
                      maxLength="80"
                      value={formDados.entrega.rua || ''}
                      onChange={handleChange}
                    />
                    

                    <label htmlFor="bairro">Bairro *</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="bairro"
                      id="bairro"
                      required
                      placeholder="Insira seu bairro"
                      minLength="5"
                      maxLength="20"
                      value={formDados.entrega.bairro || ''}
                      onChange={handleChange}
                    />

                    <label htmlFor="cidade">Cidade *</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="cidade"
                      required
                      placeholder="Insira sua cidade"
                      minLength="5"
                      maxLength="20"
                      value={formDados.entrega.cidade || ''}
                      onChange={handleChange}
                    />

                    <label htmlFor="complemento">Complemento</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="complemento"
                      id="complemento"
                      placeholder="Insira complemento"
                      minLength="4"
                      maxLength="20"
                      value={formDados.entrega.complemento || ''}
                      onChange={handleChange}
                    />
                  </div>
          
    
    )
}

export default FormCep