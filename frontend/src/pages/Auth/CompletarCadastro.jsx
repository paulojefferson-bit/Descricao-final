import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CompletarCadastro = () => {
  const { usuario, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    telefone: '',
    cpf: '',
    dataNascimento: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/completar-cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const dadosAtualizados = await response.json();
        await updateUser(dadosAtualizados.usuario);
        
        alert('Cadastro completado com sucesso! Agora você pode finalizar compras.');
        navigate('/checkout');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao completar cadastro');
      }
    } catch (error) {
      console.error('Erro ao completar cadastro:', error);
      alert('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (usuario?.tipo !== 'visitante') {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="alert alert-info text-center">
              <h4>Cadastro já completo!</h4>
              <p>Você já possui acesso completo ao sistema.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Ir para Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h4><i className="bi bi-person-plus"></i> Completar Cadastro</h4>
              <small>Complete seus dados para ter acesso total ao sistema</small>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                {/* Dados Pessoais */}
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Telefone *</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">CPF *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleChange}
                      required
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Data de Nascimento *</label>
                  <input
                    type="date"
                    className="form-control"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    required
                  />
                </div>

                <hr />
                <h5>Endereço</h5>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">CEP *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco.cep"
                      value={formData.endereco.cep}
                      onChange={handleChange}
                      required
                      placeholder="00000-000"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Cidade *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco.cidade"
                      value={formData.endereco.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-8">
                    <label className="form-label">Rua *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco.rua"
                      value={formData.endereco.rua}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Número *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco.numero"
                      value={formData.endereco.numero}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Bairro *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco.bairro"
                      value={formData.endereco.bairro}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Estado *</label>
                    <select
                      className="form-control"
                      name="endereco.estado"
                      value={formData.endereco.estado}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      {/* Adicione outros estados conforme necessário */}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Complemento</label>
                    <input
                      type="text"
                      className="form-control"
                      name="endereco.complemento"
                      value={formData.endereco.complemento}
                      onChange={handleChange}
                      placeholder="Apt, Bloco, etc."
                    />
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary me-md-2"
                    onClick={() => navigate(-1)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Completar Cadastro
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Benefícios do upgrade */}
          <div className="card mt-4">
            <div className="card-header bg-success text-white">
              <h5><i className="bi bi-star"></i> Benefícios do Cadastro Completo</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle text-success me-2"></i>Finalizar compras</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>Acompanhar pedidos</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>Comentar produtos</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li><i className="bi bi-check-circle text-success me-2"></i>Histórico de compras</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>Lista de desejos</li>
                    <li><i className="bi bi-check-circle text-success me-2"></i>Promoções exclusivas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletarCadastro;
