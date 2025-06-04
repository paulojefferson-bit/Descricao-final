// Componente de Checkout totalmente integrado
import React, { useState, useEffect } from 'react';
import { useCarrinho } from '../../context/ContextoCarrinho';
import { useAuth } from '../../context/AuthContext';
import { usePedidos, useCarrinho as useCarrinhoHooks } from '../../hooks/useApiIntegration';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';

const CheckoutIntegrado = () => {
  const { itensCarrinho } = useCarrinho();
  const { user } = useAuth();
  const { criarPedido, loading: pedidoLoading, error: pedidoError } = usePedidos();
  const { calcularTotais } = useCarrinhoHooks();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Dados, 2: Pagamento, 3: Confirmação
  const [totais, setTotais] = useState({
    subtotal: 0,
    desconto: 0,
    frete: 0,
    total: 0
  });

  const [dadosEntrega, setDadosEntrega] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    cep: user?.endereco?.cep || '',
    rua: user?.endereco?.rua || '',
    numero: user?.endereco?.numero || '',
    complemento: user?.endereco?.complemento || '',
    bairro: user?.endereco?.bairro || '',
    cidade: user?.endereco?.cidade || '',
    estado: user?.endereco?.estado || ''
  });

  const [dadosPagamento, setDadosPagamento] = useState({
    forma_pagamento: 'cartao',
    parcelas: 1,
    cartao: {
      numero: '',
      nome: '',
      validade: '',
      cvv: ''
    },
    pix: {
      aceito: false
    }
  });

  const [errors, setErrors] = useState({});

  // Calcular totais
  useEffect(() => {
    const calcular = async () => {
      try {
        const resultado = await calcularTotais();
        if (resultado.sucesso) {
          setTotais(resultado.dados);
        }
      } catch (error) {
        console.error('Erro ao calcular totais:', error);
      }
    };

    if (itensCarrinho.length > 0) {
      calcular();
    }
  }, [itensCarrinho, calcularTotais]);

  // Redirecionar se carrinho estiver vazio
  useEffect(() => {
    if (itensCarrinho.length === 0) {
      navigate('/carrinho');
    }
  }, [itensCarrinho, navigate]);

  const handleDadosEntregaChange = (e) => {
    const { name, value } = e.target;
    setDadosEntrega(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDadosPagamentoChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('cartao.')) {
      const cartaoField = name.split('.')[1];
      setDadosPagamento(prev => ({
        ...prev,
        cartao: {
          ...prev.cartao,
          [cartaoField]: value
        }
      }));
    } else {
      setDadosPagamento(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!dadosEntrega.nome) newErrors.nome = 'Nome é obrigatório';
    if (!dadosEntrega.email) newErrors.email = 'Email é obrigatório';
    if (!dadosEntrega.cep) newErrors.cep = 'CEP é obrigatório';
    if (!dadosEntrega.rua) newErrors.rua = 'Rua é obrigatória';
    if (!dadosEntrega.numero) newErrors.numero = 'Número é obrigatório';
    if (!dadosEntrega.bairro) newErrors.bairro = 'Bairro é obrigatório';
    if (!dadosEntrega.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!dadosEntrega.estado) newErrors.estado = 'Estado é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (dadosPagamento.forma_pagamento === 'cartao') {
      if (!dadosPagamento.cartao.numero) newErrors['cartao.numero'] = 'Número do cartão é obrigatório';
      if (!dadosPagamento.cartao.nome) newErrors['cartao.nome'] = 'Nome no cartão é obrigatório';
      if (!dadosPagamento.cartao.validade) newErrors['cartao.validade'] = 'Validade é obrigatória';
      if (!dadosPagamento.cartao.cvv) newErrors['cartao.cvv'] = 'CVV é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinalizarPedido = async () => {
    try {
      const dadosPedido = {
        itens: itensCarrinho.map(item => ({
          produto_id: item.produto_id,
          quantidade: item.quantidade,
          preco_unitario: item.preco
        })),
        endereco_entrega: dadosEntrega,
        forma_pagamento: dadosPagamento.forma_pagamento,
        dados_pagamento: dadosPagamento,
        valor_total: totais.total
      };

      const response = await criarPedido(dadosPedido);
      
      if (response.sucesso) {
        navigate('/sucesso', { 
          state: { 
            pedidoId: response.dados.id,
            valor: totais.total 
          } 
        });
      }
    } catch (error) {
      console.error('Erro ao finalizar pedido:', error);
    }
  };

  if (itensCarrinho.length === 0) {
    return <LoadingSpinner message="Redirecionando..." />;
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">
            <i className="bi bi-credit-card me-2"></i>
            Finalizar Compra
          </h2>
        </div>
      </div>

      {/* Indicador de etapas */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="progress" style={{ height: '4px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <small className={step >= 1 ? 'text-primary fw-bold' : 'text-muted'}>
              1. Dados de Entrega
            </small>
            <small className={step >= 2 ? 'text-primary fw-bold' : 'text-muted'}>
              2. Pagamento
            </small>
            <small className={step >= 3 ? 'text-primary fw-bold' : 'text-muted'}>
              3. Confirmação
            </small>
          </div>
        </div>
      </div>

      {pedidoError && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {pedidoError}
        </div>
      )}

      <div className="row">
        {/* Formulário principal */}
        <div className="col-lg-8">
          {/* Etapa 1: Dados de Entrega */}
          {step === 1 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-truck me-2"></i>
                  Dados de Entrega
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome Completo *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                      name="nome"
                      value={dadosEntrega.nome}
                      onChange={handleDadosEntregaChange}
                    />
                    {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      name="email"
                      value={dadosEntrega.email}
                      onChange={handleDadosEntregaChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefone"
                      value={dadosEntrega.telefone}
                      onChange={handleDadosEntregaChange}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">CEP *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cep ? 'is-invalid' : ''}`}
                      name="cep"
                      value={dadosEntrega.cep}
                      onChange={handleDadosEntregaChange}
                      placeholder="00000-000"
                    />
                    {errors.cep && <div className="invalid-feedback">{errors.cep}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-8 mb-3">
                    <label className="form-label">Rua *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.rua ? 'is-invalid' : ''}`}
                      name="rua"
                      value={dadosEntrega.rua}
                      onChange={handleDadosEntregaChange}
                    />
                    {errors.rua && <div className="invalid-feedback">{errors.rua}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Número *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.numero ? 'is-invalid' : ''}`}
                      name="numero"
                      value={dadosEntrega.numero}
                      onChange={handleDadosEntregaChange}
                    />
                    {errors.numero && <div className="invalid-feedback">{errors.numero}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Complemento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="complemento"
                      value={dadosEntrega.complemento}
                      onChange={handleDadosEntregaChange}
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Bairro *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.bairro ? 'is-invalid' : ''}`}
                      name="bairro"
                      value={dadosEntrega.bairro}
                      onChange={handleDadosEntregaChange}
                    />
                    {errors.bairro && <div className="invalid-feedback">{errors.bairro}</div>}
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Cidade *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.cidade ? 'is-invalid' : ''}`}
                      name="cidade"
                      value={dadosEntrega.cidade}
                      onChange={handleDadosEntregaChange}
                    />
                    {errors.cidade && <div className="invalid-feedback">{errors.cidade}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Estado *</label>
                    <select
                      className={`form-select ${errors.estado ? 'is-invalid' : ''}`}
                      name="estado"
                      value={dadosEntrega.estado}
                      onChange={handleDadosEntregaChange}
                    >
                      <option value="">Selecione...</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      {/* Adicionar outros estados */}
                    </select>
                    {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Etapa 2: Pagamento */}
          {step === 2 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  Forma de Pagamento
                </h5>
              </div>
              <div className="card-body">
                {/* Seleção da forma de pagamento */}
                <div className="mb-4">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="forma_pagamento"
                          value="cartao"
                          checked={dadosPagamento.forma_pagamento === 'cartao'}
                          onChange={handleDadosPagamentoChange}
                        />
                        <label className="form-check-label">
                          <i className="bi bi-credit-card me-2"></i>
                          Cartão de Crédito
                        </label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="forma_pagamento"
                          value="pix"
                          checked={dadosPagamento.forma_pagamento === 'pix'}
                          onChange={handleDadosPagamentoChange}
                        />
                        <label className="form-check-label">
                          <i className="bi bi-qr-code me-2"></i>
                          PIX
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dados do cartão */}
                {dadosPagamento.forma_pagamento === 'cartao' && (
                  <div>
                    <div className="row">
                      <div className="col-md-8 mb-3">
                        <label className="form-label">Número do Cartão *</label>
                        <input
                          type="text"
                          className={`form-control ${errors['cartao.numero'] ? 'is-invalid' : ''}`}
                          name="cartao.numero"
                          value={dadosPagamento.cartao.numero}
                          onChange={handleDadosPagamentoChange}
                          placeholder="0000 0000 0000 0000"
                          maxLength="19"
                        />
                        {errors['cartao.numero'] && <div className="invalid-feedback">{errors['cartao.numero']}</div>}
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">CVV *</label>
                        <input
                          type="text"
                          className={`form-control ${errors['cartao.cvv'] ? 'is-invalid' : ''}`}
                          name="cartao.cvv"
                          value={dadosPagamento.cartao.cvv}
                          onChange={handleDadosPagamentoChange}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors['cartao.cvv'] && <div className="invalid-feedback">{errors['cartao.cvv']}</div>}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-8 mb-3">
                        <label className="form-label">Nome no Cartão *</label>
                        <input
                          type="text"
                          className={`form-control ${errors['cartao.nome'] ? 'is-invalid' : ''}`}
                          name="cartao.nome"
                          value={dadosPagamento.cartao.nome}
                          onChange={handleDadosPagamentoChange}
                          placeholder="Nome como está no cartão"
                        />
                        {errors['cartao.nome'] && <div className="invalid-feedback">{errors['cartao.nome']}</div>}
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Validade *</label>
                        <input
                          type="text"
                          className={`form-control ${errors['cartao.validade'] ? 'is-invalid' : ''}`}
                          name="cartao.validade"
                          value={dadosPagamento.cartao.validade}
                          onChange={handleDadosPagamentoChange}
                          placeholder="MM/AA"
                          maxLength="5"
                        />
                        {errors['cartao.validade'] && <div className="invalid-feedback">{errors['cartao.validade']}</div>}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Parcelas</label>
                        <select
                          className="form-select"
                          name="parcelas"
                          value={dadosPagamento.parcelas}
                          onChange={handleDadosPagamentoChange}
                        >
                          <option value="1">1x de R$ {totais.total.toFixed(2)} sem juros</option>
                          <option value="2">2x de R$ {(totais.total / 2).toFixed(2)} sem juros</option>
                          <option value="3">3x de R$ {(totais.total / 3).toFixed(2)} sem juros</option>
                          <option value="4">4x de R$ {(totais.total / 4).toFixed(2)} sem juros</option>
                          <option value="5">5x de R$ {(totais.total / 5).toFixed(2)} sem juros</option>
                          <option value="6">6x de R$ {(totais.total / 6).toFixed(2)} sem juros</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações do PIX */}
                {dadosPagamento.forma_pagamento === 'pix' && (
                  <div className="alert alert-info">
                    <h6><i className="bi bi-info-circle me-2"></i>Pagamento via PIX</h6>
                    <p className="mb-0">
                      Após confirmar o pedido, você receberá o código PIX para pagamento.
                      O pedido será processado automaticamente após a confirmação do pagamento.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Etapa 3: Confirmação */}
          {step === 3 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Confirmação do Pedido
                </h5>
              </div>
              <div className="card-body">
                <h6>Dados de Entrega:</h6>
                <p className="text-muted mb-3">
                  {dadosEntrega.nome}<br />
                  {dadosEntrega.rua}, {dadosEntrega.numero} {dadosEntrega.complemento && ` - ${dadosEntrega.complemento}`}<br />
                  {dadosEntrega.bairro}, {dadosEntrega.cidade} - {dadosEntrega.estado}<br />
                  CEP: {dadosEntrega.cep}<br />
                  {dadosEntrega.telefone && `Tel: ${dadosEntrega.telefone}`}
                </p>

                <h6>Forma de Pagamento:</h6>
                <p className="text-muted mb-3">
                  {dadosPagamento.forma_pagamento === 'cartao' ? (
                    <>
                      Cartão de Crédito<br />
                      {dadosPagamento.parcelas}x de R$ {(totais.total / dadosPagamento.parcelas).toFixed(2)}
                    </>
                  ) : (
                    'PIX - Pagamento à vista'
                  )}
                </p>

                <h6>Itens do Pedido:</h6>
                <div className="table-responsive mb-3">
                  <table className="table table-sm">
                    <tbody>
                      {itensCarrinho.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nome}</td>
                          <td>{item.quantidade}x</td>
                          <td className="text-end">R$ {(item.preco * item.quantidade).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Verifique todos os dados antes de finalizar o pedido.
                </div>
              </div>
            </div>
          )}

          {/* Botões de navegação */}
          <div className="d-flex justify-content-between mt-4">
            <button
              className="btn btn-outline-secondary"
              onClick={handlePrevStep}
              disabled={step === 1}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Voltar
            </button>

            {step < 3 ? (
              <button
                className="btn btn-primary"
                onClick={handleNextStep}
              >
                Continuar
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            ) : (
              <button
                className="btn btn-success btn-lg"
                onClick={handleFinalizarPedido}
                disabled={pedidoLoading}
              >
                {pedidoLoading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    Processando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2-circle me-2"></i>
                    Finalizar Pedido
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Resumo lateral */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top">
            <div className="card-header">
              <h6 className="mb-0">Resumo do Pedido</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>R$ {totais.subtotal.toFixed(2)}</span>
              </div>
              
              {totais.desconto > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Desconto:</span>
                  <span>-R$ {totais.desconto.toFixed(2)}</span>
                </div>
              )}
              
              <div className="d-flex justify-content-between mb-2">
                <span>Frete:</span>
                <span>
                  {totais.frete === 0 ? 'Grátis' : `R$ ${totais.frete.toFixed(2)}`}
                </span>
              </div>
              
              <hr />
              
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong className="text-primary fs-5">
                  R$ {totais.total.toFixed(2)}
                </strong>
              </div>

              <small className="text-muted mt-2 d-block">
                {itensCarrinho.length} {itensCarrinho.length === 1 ? 'item' : 'itens'}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutIntegrado;
