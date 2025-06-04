import { createContext, useContext, useState } from "react";

const FormContext = createContext()

export const FormProvider = ({ children }) => {
    const [formDados, setFormDados] = useState({
        usuario: {
            nome: '',
            cpf: '',
            email: '',
            celular: ''
        },

        entrega: {
            cep: '',
            rua: '',
            bairro: '',
            cidade: '',
            complemento: ''
        },

        pagamento: {
            metodo: 'cartao',
            cartao: {
                nomeCartao: '',
                numeroCartao: '',
                validade: '',
                cvv: ''
            },

            boleto: {
                nome: '',
                cpf: '',
                vencimento: '',
                valorTotal: ''
            },

            pix: {
                nome: '',
                chave: ''
            }
        }
    })

    return (

        <FormContext.Provider value={{formDados, setFormDados}}>
            {children}
        </FormContext.Provider>
    )
}

export const useForm = () => {
    const context = useContext(FormContext)
    if(!context) {
        throw new Error("useForm deve ser usado dentro de um FormProvider");
        
    }

    return context
}