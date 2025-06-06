import React, { useState, useEffect } from 'react';
import { adminService } from '../../services';

const Configuracoes = ({ userPermissions }) => {
    const [configuracoes, setConfiguracoes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState('geral');

    // Verificar permissões
    const canEdit = userPermissions?.includes('editar_configuracoes') || userPermissions?.includes('admin_total');

    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    const carregarConfiguracoes = async () => {
        try {
            setLoading(true);
            const config = await adminService.obterConfiguracoes();
            setConfiguracoes(config);
        } catch (err) {
            setError('Erro ao carregar configurações: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const salvarConfiguracao = async (chave, valor) => {
        if (!canEdit) {
            setError('Você não tem permissão para editar configurações');
            return;
        }

        try {
            setSaving(true);
            await adminService.atualizarConfiguracao(chave, valor);
            setConfiguracoes(prev => ({
                ...prev,
                [chave]: valor
            }));
            setSuccess('Configuração salva com sucesso!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Erro ao salvar configuração: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (chave, valor) => {
        setConfiguracoes(prev => ({
            ...prev,
            [chave]: valor
        }));
    };

    const handleSubmitSection = async (e, secao) => {
        e.preventDefault();
        
        const configsSecao = Object.keys(configuracoes)
            .filter(key => key.startsWith(secao))
            .reduce((obj, key) => {
                obj[key] = configuracoes[key];
                return obj;
            }, {});

        try {
            setSaving(true);
            await adminService.atualizarConfiguracoes(configsSecao);
            setSuccess('Configurações salvas com sucesso!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Erro ao salvar configurações: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const resetToDefaults = async (secao) => {
        if (!window.confirm('Tem certeza que deseja restaurar as configurações padrão desta seção?')) return;

        try {
            setSaving(true);
            await adminService.resetarConfiguracoes(secao);
            await carregarConfiguracoes();
            setSuccess('Configurações restauradas para o padrão!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Erro ao restaurar configurações: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Carregando configurações...</div>;
    }

    return (
        <div className="configuracoes">
            <div className="page-header">
                <h2>Configurações do Sistema</h2>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {!canEdit && (
                <div className="warning-message">
                    Você tem acesso apenas para visualização. Entre em contato com um administrador para fazer alterações.
                </div>
            )}

            <div className="config-container">
                {/* Tabs de Navegação */}
                <div className="config-tabs">
                    <button 
                        className={`tab ${activeTab === 'geral' ? 'active' : ''}`}
                        onClick={() => setActiveTab('geral')}
                    >
                        Geral
                    </button>
                    <button 
                        className={`tab ${activeTab === 'loja' ? 'active' : ''}`}
                        onClick={() => setActiveTab('loja')}
                    >
                        Loja
                    </button>
                    <button 
                        className={`tab ${activeTab === 'pagamento' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pagamento')}
                    >
                        Pagamento
                    </button>
                    <button 
                        className={`tab ${activeTab === 'email' ? 'active' : ''}`}
                        onClick={() => setActiveTab('email')}
                    >
                        E-mail
                    </button>
                    <button 
                        className={`tab ${activeTab === 'seguranca' ? 'active' : ''}`}
                        onClick={() => setActiveTab('seguranca')}
                    >
                        Segurança
                    </button>
                </div>

                {/* Conteúdo das Tabs */}
                <div className="config-content">
                    {/* Configurações Gerais */}
                    {activeTab === 'geral' && (
                        <form onSubmit={(e) => handleSubmitSection(e, 'geral')} className="config-section">
                            <h3>Configurações Gerais</h3>
                            
                            <div className="form-group">
                                <label>Nome do Site:</label>
                                <input
                                    type="text"
                                    value={configuracoes.geral_nome_site || ''}
                                    onChange={(e) => handleInputChange('geral_nome_site', e.target.value)}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Descrição do Site:</label>
                                <textarea
                                    value={configuracoes.geral_descricao_site || ''}
                                    onChange={(e) => handleInputChange('geral_descricao_site', e.target.value)}
                                    disabled={!canEdit}
                                    rows="3"
                                />
                            </div>

                            <div className="form-group">
                                <label>E-mail de Contato:</label>
                                <input
                                    type="email"
                                    value={configuracoes.geral_email_contato || ''}
                                    onChange={(e) => handleInputChange('geral_email_contato', e.target.value)}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Telefone de Contato:</label>
                                <input
                                    type="tel"
                                    value={configuracoes.geral_telefone_contato || ''}
                                    onChange={(e) => handleInputChange('geral_telefone_contato', e.target.value)}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Endereço da Empresa:</label>
                                <textarea
                                    value={configuracoes.geral_endereco_empresa || ''}
                                    onChange={(e) => handleInputChange('geral_endereco_empresa', e.target.value)}
                                    disabled={!canEdit}
                                    rows="3"
                                />
                            </div>

                            <div className="form-actions">
                                {canEdit && (
                                    <>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => resetToDefaults('geral')}
                                        >
                                            Restaurar Padrão
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Configurações da Loja */}
                    {activeTab === 'loja' && (
                        <form onSubmit={(e) => handleSubmitSection(e, 'loja')} className="config-section">
                            <h3>Configurações da Loja</h3>
                            
                            <div className="form-group">
                                <label>Moeda:</label>
                                <select
                                    value={configuracoes.loja_moeda || 'BRL'}
                                    onChange={(e) => handleInputChange('loja_moeda', e.target.value)}
                                    disabled={!canEdit}
                                >
                                    <option value="BRL">Real Brasileiro (R$)</option>
                                    <option value="USD">Dólar Americano ($)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Limite de Produtos por Página:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={configuracoes.loja_produtos_por_pagina || 20}
                                    onChange={(e) => handleInputChange('loja_produtos_por_pagina', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor Mínimo para Frete Grátis (R$):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={configuracoes.loja_frete_gratis_valor || 0}
                                    onChange={(e) => handleInputChange('loja_frete_gratis_valor', parseFloat(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.loja_permitir_avaliacoes || false}
                                        onChange={(e) => handleInputChange('loja_permitir_avaliacoes', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Permitir avaliações de produtos
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.loja_permitir_lista_desejos || false}
                                        onChange={(e) => handleInputChange('loja_permitir_lista_desejos', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Permitir lista de desejos
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Tempo de Estoque Baixo (dias):</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={configuracoes.loja_estoque_baixo_dias || 7}
                                    onChange={(e) => handleInputChange('loja_estoque_baixo_dias', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-actions">
                                {canEdit && (
                                    <>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => resetToDefaults('loja')}
                                        >
                                            Restaurar Padrão
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Configurações de Pagamento */}
                    {activeTab === 'pagamento' && (
                        <form onSubmit={(e) => handleSubmitSection(e, 'pagamento')} className="config-section">
                            <h3>Configurações de Pagamento</h3>
                            
                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.pagamento_cartao_ativo || false}
                                        onChange={(e) => handleInputChange('pagamento_cartao_ativo', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Aceitar pagamento com cartão
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.pagamento_pix_ativo || false}
                                        onChange={(e) => handleInputChange('pagamento_pix_ativo', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Aceitar pagamento via PIX
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.pagamento_boleto_ativo || false}
                                        onChange={(e) => handleInputChange('pagamento_boleto_ativo', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Aceitar pagamento com boleto
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Máximo de Parcelas (Cartão):</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={configuracoes.pagamento_max_parcelas || 12}
                                    onChange={(e) => handleInputChange('pagamento_max_parcelas', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Valor Mínimo de Parcela (R$):</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={configuracoes.pagamento_parcela_minima || 50}
                                    onChange={(e) => handleInputChange('pagamento_parcela_minima', parseFloat(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-actions">
                                {canEdit && (
                                    <>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => resetToDefaults('pagamento')}
                                        >
                                            Restaurar Padrão
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Configurações de E-mail */}
                    {activeTab === 'email' && (
                        <form onSubmit={(e) => handleSubmitSection(e, 'email')} className="config-section">
                            <h3>Configurações de E-mail</h3>
                            
                            <div className="form-group">
                                <label>Servidor SMTP:</label>
                                <input
                                    type="text"
                                    value={configuracoes.email_smtp_servidor || ''}
                                    onChange={(e) => handleInputChange('email_smtp_servidor', e.target.value)}
                                    disabled={!canEdit}
                                    placeholder="smtp.gmail.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>Porta SMTP:</label>
                                <input
                                    type="number"
                                    value={configuracoes.email_smtp_porta || 587}
                                    onChange={(e) => handleInputChange('email_smtp_porta', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>E-mail de Envio:</label>
                                <input
                                    type="email"
                                    value={configuracoes.email_remetente || ''}
                                    onChange={(e) => handleInputChange('email_remetente', e.target.value)}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.email_ssl_ativo || false}
                                        onChange={(e) => handleInputChange('email_ssl_ativo', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Usar SSL/TLS
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.email_notificacoes_pedidos || true}
                                        onChange={(e) => handleInputChange('email_notificacoes_pedidos', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Enviar notificações de pedidos
                                </label>
                            </div>

                            <div className="form-actions">
                                {canEdit && (
                                    <>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => resetToDefaults('email')}
                                        >
                                            Restaurar Padrão
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}

                    {/* Configurações de Segurança */}
                    {activeTab === 'seguranca' && (
                        <form onSubmit={(e) => handleSubmitSection(e, 'seguranca')} className="config-section">
                            <h3>Configurações de Segurança</h3>
                            
                            <div className="form-group">
                                <label>Tempo de Sessão (minutos):</label>
                                <input
                                    type="number"
                                    min="15"
                                    max="1440"
                                    value={configuracoes.seguranca_tempo_sessao || 120}
                                    onChange={(e) => handleInputChange('seguranca_tempo_sessao', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Tentativas de Login (antes de bloquear):</label>
                                <input
                                    type="number"
                                    min="3"
                                    max="10"
                                    value={configuracoes.seguranca_max_tentativas_login || 5}
                                    onChange={(e) => handleInputChange('seguranca_max_tentativas_login', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group">
                                <label>Tempo de Bloqueio (minutos):</label>
                                <input
                                    type="number"
                                    min="5"
                                    max="60"
                                    value={configuracoes.seguranca_tempo_bloqueio || 15}
                                    onChange={(e) => handleInputChange('seguranca_tempo_bloqueio', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.seguranca_requer_senha_forte || true}
                                        onChange={(e) => handleInputChange('seguranca_requer_senha_forte', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Exigir senhas fortes
                                </label>
                            </div>

                            <div className="form-group checkbox-group">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={configuracoes.seguranca_log_atividades || true}
                                        onChange={(e) => handleInputChange('seguranca_log_atividades', e.target.checked)}
                                        disabled={!canEdit}
                                    />
                                    Registrar log de atividades
                                </label>
                            </div>

                            <div className="form-group">
                                <label>Dias para manter logs:</label>
                                <input
                                    type="number"
                                    min="7"
                                    max="365"
                                    value={configuracoes.seguranca_dias_manter_logs || 90}
                                    onChange={(e) => handleInputChange('seguranca_dias_manter_logs', parseInt(e.target.value))}
                                    disabled={!canEdit}
                                />
                            </div>

                            <div className="form-actions">
                                {canEdit && (
                                    <>
                                        <button type="submit" className="btn btn-primary" disabled={saving}>
                                            {saving ? 'Salvando...' : 'Salvar Alterações'}
                                        </button>
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => resetToDefaults('seguranca')}
                                        >
                                            Restaurar Padrão
                                        </button>
                                    </>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Configuracoes;
