const FormDadosPessoais = ({formDados, setFormDados}) => {
       const handleChange = (e) => {
        const { name, value} = e.target

        let valorFormatado = value;

        if (name === 'nome') {
          valorFormatado = value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "")
        }

        if( name === 'cpf') {
          valorFormatado = value.replace(/\D/g, "")
        }

        if(name === 'celular') {
          const numeros = value.replace(/\D/g, "")

          const numeroCelular = numeros.slice(0,11)

          valorFormatado = numeroCelular.replace( /^(\d{2})(\d{5})(\d{0,4})/,"($1) $2-$3")
        }

        setFormDados((prev) => ({
            ...prev,
            usuario: {
                ...prev.usuario, 
                [name]: valorFormatado
            }
        }))

        }
       
    
    return (
        <>
            <div className="bg-white d-flex flex-column p-5 form-group">
                    <h5>Informações Pessoais</h5>
                    <hr />

                    <label htmlFor="nome">Nome Completo *</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="nome"
                      value={formDados.usuario.nome}
                      onChange={handleChange}
                      required
                      placeholder="Insira seu nome"
                      minLength="10"
                      maxLength="50"
                    />

                    <label htmlFor="cpf">CPF *</label>
                    <input
                      className='form-control opacity-50'
                      type="text"
                      name="cpf"
                      value={formDados.usuario.cpf}
                      onChange={handleChange}
                      required
                      placeholder="Insira seu CPF"
                      pattern="[0-9]{1,11}"
                      minLength={11}
                      maxLength={11}
                    />

                    <label htmlFor="email">Email *</label>
                    <input
                      className='form-control opacity-50'
                      type="email"
                      name="email"
                      value={formDados.usuario.email}
                      onChange={handleChange}
                      required
                      placeholder="Insira seu email"
                      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                      minLength="10"
                      maxLength="50"
                    />

                    <label htmlFor="celular">Celular *</label>
                    <input
                      className='form-control opacity-50'
                      type="tel"
                      name="celular"
                      value={formDados.usuario.celular}
                      onChange={handleChange}
                      required
                      placeholder="Insira seu Número"
                      minLength={15}
                      maxLength={15}

                    />
                  </div>

        </>
    )
}

export default FormDadosPessoais