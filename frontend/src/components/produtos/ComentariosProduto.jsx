import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const ComentariosProduto = ({ produtoId }) => {
  const { usuario, hasPermission } = useAuth();
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [avaliacao, setAvaliacao] = useState(5);
  const [loading, setLoading] = useState(false);
  const [podeAvaliar, setPodeAvaliar] = useState(false);

  useEffect(() => {
    carregarComentarios();
    verificarPermissaoAvaliar();
  }, [produtoId, usuario]);

  const carregarComentarios = async () => {
    try {
      const response = await fetch(`/api/produtos/${produtoId}/comentarios`);
      if (response.ok) {
        const data = await response.json();
        setComentarios(data);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const verificarPermissaoAvaliar = async () => {
    if (!usuario || !hasPermission('COMENTAR_PRODUTO')) {
      setPodeAvaliar(false);
      return;
    }

    try {
      const response = await fetch(`/api/usuarios/${usuario.id}/pode-avaliar/${produtoId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const { podeAvaliar } = await response.json();
        setPodeAvaliar(podeAvaliar);
      }
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setPodeAvaliar(false);
    }
  };

  const enviarComentario = async (e) => {
    e.preventDefault();
    
    if (!novoComentario.trim()) {
      alert('Digite um comentário válido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/produtos/${produtoId}/comentarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          comentario: novoComentario,
          avaliacao: avaliacao
        })
      });

      if (response.ok) {
        const novoComentarioData = await response.json();
        setComentarios(prev => [novoComentarioData, ...prev]);
        setNovoComentario('');
        setAvaliacao(5);
        alert('Comentário enviado com sucesso!');
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao enviar comentário');
      }
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
      alert('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderEstrelas = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
      />
    ));
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-5">
      <h4>Avaliações e Comentários</h4>
      
      {/* Formulário para novo comentário */}
      {podeAvaliar ? (
        <div className="card mb-4">
          <div className="card-header bg-light">
            <h5><i className="bi bi-chat-dots"></i> Escrever Avaliação</h5>
          </div>
          <div className="card-body">
            <form onSubmit={enviarComentario}>
              <div className="mb-3">
                <label className="form-label">Avaliação</label>
                <div className="d-flex align-items-center">
                  {Array.from({ length: 5 }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      className="btn btn-link p-0 me-1"
                      onClick={() => setAvaliacao(index + 1)}
                    >
                      <i
                        className={`bi ${index < avaliacao ? 'bi-star-fill' : 'bi-star'} text-warning`}
                        style={{ fontSize: '1.5rem' }}
                      />
                    </button>
                  ))}
                  <span className="ms-2">({avaliacao} estrela{avaliacao !== 1 ? 's' : ''})</span>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Comentário</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  placeholder="Compartilhe sua experiência com este produto..."
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send me-2"></i>
                    Enviar Avaliação
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          {!usuario ? (
            <>Faça <a href="/login">login</a> para avaliar este produto.</>
          ) : !hasPermission('COMENTAR_PRODUTO') ? (
            <>Complete seu <a href="/completar-cadastro">cadastro</a> para avaliar produtos.</>
          ) : (
            'Você precisa comprar este produto para poder avaliá-lo.'
          )}
        </div>
      )}

      {/* Lista de comentários */}
      <div className="mt-4">
        {comentarios.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-chat display-1 text-muted"></i>
            <p className="text-muted mt-3">Ainda não há avaliações para este produto.</p>
            {podeAvaliar && <p>Seja o primeiro a avaliar!</p>}
          </div>
        ) : (
          <>
            <h5>Avaliações ({comentarios.length})</h5>
            <div className="mt-3">
              {comentarios.map((comentario) => (
                <div key={comentario.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{comentario.usuario_nome}</h6>
                        <div className="d-flex align-items-center">
                          {renderEstrelas(comentario.avaliacao)}
                          <small className="text-muted ms-2">
                            {formatarData(comentario.data_criacao)}
                          </small>
                        </div>
                      </div>
                      {comentario.compra_verificada && (
                        <span className="badge bg-success">
                          <i className="bi bi-patch-check me-1"></i>
                          Compra Verificada
                        </span>
                      )}
                    </div>
                    <p className="mb-0">{comentario.comentario}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ComentariosProduto;
