import adereco from "../../assets/cartaoLogo/adereco.png"
import styles from './CheckoutPage.module.css'
import FormSucessoResumo from "../../components/Checkout/FormSucessoResumo"
import {useForm } from '../../context/FormContext'


const SucessoPage = () => {

    const {formDados} = useForm()
    return(
        <div className={styles.backgroundFormulario}>
            <div className={styles.backgroundConteudo}>
                <div className="p-5">
                    <section className="text-center">
                        <img src={adereco} alt="imagem de festa" />
                        <h3 className="mt-4">Compra realizada com sucesso</h3>
                    </section>
                    <hr />

                    <section>
                        <h5>Informações Pessoais</h5>
                        <p>Nome: {formDados.usuario.nome}</p>
                        <p>CPF: {formDados.usuario.cpf}</p>
                        <p>Email: {formDados.usuario.email} </p>
                        <p>Celular {formDados.usuario.celular}</p>
                    </section>
                    <hr />

                    <section>
                        <h5>Informações de Entrega</h5>
                        <p>Endereço: {formDados.entrega.rua} </p>
                        <p>Bairro: {formDados.entrega.bairro}</p>
                        <p>Cidade: {formDados.entrega.cidade}</p>
                        <p>CEP: {formDados.entrega.cep}</p>
                    </section>
                    <hr />

                    <section>
                        <h5>Informações de Pagamento</h5>
                        <p>Titular do Cartão: {formDados.pagamento.cartao.nomeCartao} </p>
                        <p>Final {formDados.pagamento.cartao.numeroCartao.slice(-4)}</p>
                    </section>
                    <hr />

                </div>
                 <FormSucessoResumo/>
            </div>
            

        </div>
     
    
    )
}

export default SucessoPage