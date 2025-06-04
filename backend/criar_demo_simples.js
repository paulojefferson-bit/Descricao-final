/**
 * Script simplificado para criar usuário demo
 * Este script usa o modelo Usuario existente do backend
 */

const Usuario = require('./modelos/Usuario');

async function criarUsuarioDemo() {
  try {
    console.log('🔄 Iniciando criação de usuário demo...');
    
    // Verificar se usuário demo já existe
    console.log('🔍 Verificando se usuário demo já existe...');
    const usuarioExistente = await Usuario.buscarPorEmail('demo@lojafgt.com');
    
    if (usuarioExistente) {
      console.log('✅ Usuário demo já existe!');
      console.log(`📧 Email: demo@lojafgt.com`);
      console.log(`🔑 Senha: demo123`);
      console.log(`🆔 ID: ${usuarioExistente.id}`);
      return;
    }
    
    // Criar usuário demo
    console.log('👤 Criando usuário demo...');
    const dadosDemo = {
      nome: 'Usuário Demo',
      email: 'demo@lojafgt.com',
      senha: 'demo123',
      nivel_acesso: 'usuario',
      telefone: '(11) 99999-9999',
      aceita_marketing: true
    };
    
    const usuarioDemo = await Usuario.criar(dadosDemo);
    
    console.log('✅ Usuário demo criado com sucesso!');
    console.log(`📧 Email: demo@lojafgt.com`);
    console.log(`🔑 Senha: demo123`);
    console.log(`🆔 ID: ${usuarioDemo.id}`);
    console.log(`👤 Nome: ${usuarioDemo.nome}`);
    
  } catch (error) {
    console.error('❌ Erro ao criar usuário demo:', error);
    
    if (error.message === 'Email já está em uso') {
      console.log('✅ Usuário demo já existe no sistema!');
      console.log(`📧 Email: demo@lojafgt.com`);
      console.log(`🔑 Senha: demo123`);
    } else {
      console.log('💡 Dicas de solução:');
      if (error.message.includes('ER_NO_SUCH_TABLE')) {
        console.log('- Execute o configurador de banco: node banco/configurar_banco.js');
      } else if (error.message.includes('ER_ACCESS_DENIED_ERROR')) {
        console.log('- Verifique as credenciais do banco no arquivo .env');
      } else if (error.message.includes('ECONNREFUSED')) {
        console.log('- Verifique se o MySQL está rodando');
      }
      process.exit(1);
    }
  } finally {
    console.log('🔌 Encerrando script...');
    process.exit(0);
  }
}

// Executar script
criarUsuarioDemo();
