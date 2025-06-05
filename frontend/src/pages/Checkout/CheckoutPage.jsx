import FormaPagamento from "../../components/Checkout/FormaPagamento";
import FormCep from "../../components/Checkout/FormCep";
import FormDadosPessoais from "../../components/Checkout/FormDadosPessoais";
import FormResumo from "../../components/Checkout/FormResumo";
import {useNavigate} from 'react-router-dom'
import styles from './CheckoutPage.module.css'
import {useForm} from '../../context/FormContext'
import {useCarrinho} from '../../context/ContextoCarrinho'
import { useEffect } from 'react'
import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const CheckoutPage = () => {

  const {formDados, setFormDados} = useForm()
  const {carrinho, limparCarrinho} = useCarrinho()
  const navigate = useNavigate()

  // Verificar se há itens no carrinho
  useEffect(() => {
    if (carrinho.length === 0) {
      // Opcional: redirecionar automaticamente ou mostrar mensagem
      // navigate('/carrinho');
    }
  }, [carrinho, navigate]);  // Calcular totais do carrinho
  const subtotal = carrinho.reduce((total, item) => {
    const preco = Number(item.currentPrice || item.preco_atual || item.preco_unitario || 0);
    const quantidade = item.quantidade === undefined ? 0 : Number(item.quantidade);
    
    // Verificar se os valores são válidos
    if (isNaN(preco) || isNaN(quantidade)) {
      console.warn('Item do carrinho com valores inválidos:', item);
      return total;
    }
    
    return total + (preco * quantidade);
  }, 0);
  const frete = subtotal > 0 ? 15.90 : 0;
  const desconto = 0; // Você pode implementar lógica de cupons aqui
  const total = subtotal + frete - desconto;
  // Formatador de moeda
  const formatarMoeda = (valor) => {
    const numero = Number(valor);
    if (isNaN(numero) || numero === null || numero === undefined) {
      return 'R$ 0,00';
    }
    return `R$ ${numero.toFixed(2).replace('.', ',')}`;
  };

  const handleSubmit = async (e) => {
      e.preventDefault()
      
      // Validar se há itens no carrinho
      if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        navigate('/produtos');
        return;
      }      // Simulação de processamento de pagamento
      // Em uma implementação real, aqui você enviaria os dados para um processador de pagamento
      
      // Limpar carrinho após finalizar compra
      await limparCarrinho();
      
      navigate('/sucesso')
  }

  // Se carrinho estiver vazio, mostrar mensagem
  if (carrinho.length === 0) {
    return (
      <Container className="my-5 text-center">
        <div className="py-5">
          <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
          <h2>Nenhum item no carrinho</h2>
          <p className="mb-4">Você precisa adicionar produtos ao carrinho antes de finalizar a compra.</p>
          <Button 
            variant="primary" 
            as={Link} 
            to="/produtos"
            size="lg"
          >
            <i className="bi bi-bag me-2"></i>
            Ir às Compras
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
        <form onSubmit={handleSubmit} className={styles.backgroundFormulario}>
          <div className={`container ${styles.conteudoForm}`}>
            <h2 className="fw-bold mt-5 ms-2">Finalizar Compra</h2>
            <div className='row'>
              <fieldset className="col-sm-12 col-md-7">                <FormDadosPessoais formDados={formDados} setFormDados={setFormDados} />
                <FormCep formDados={formDados} setFormDados={setFormDados} />
                <FormaPagamento formDados={formDados} setFormDados={setFormDados} />
                <div className="d-block d-md-none">
                  <FormResumo 
                    carrinho={carrinho}
                    subtotal={subtotal}
                    frete={frete}
                    desconto={desconto}
                    total={total}
                    formatarMoeda={formatarMoeda}
                  />
                </div>
                <div className="bg-white my-3 mb-2 d-flex flex-column p-5">
                          <hr />
                          <div className="d-flex justify-content-between mb-5">
                            <div>
                              <h3>Total</h3>
                            </div>
                            <div>
                              <p className="m-0 text-end text-danger ">{formatarMoeda(total)}</p>
                              <small className="opacity-50">
                                ou 10x de {formatarMoeda(total / 10)} sem juros
                              </small>
                            </div>
                          </div>
                          <button
                            className="btn btn-warning text-white fw-bold p-2 mb-5"
                            type="submit"
                            disabled={carrinho.length === 0}
                          >
                            Realizar Pagamento
                          </button>
                        </div>
              </fieldset>              <fieldset className="col-md-5 d-none d-md-block">
                <FormResumo
                  carrinho={carrinho}
                  subtotal={subtotal}
                  frete={frete}
                  desconto={desconto}
                  total={total}
                  formatarMoeda={formatarMoeda}
                />
              </fieldset>
            </div>
          </div>
        </form>
    </>
  );
};

export default CheckoutPage;
