import { BrowserRouter } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap-icons/font/bootstrap-icons.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from './routes/AppRoutes'
import MainLayout from './layouts/MainLayout'
import { ProvedorCarrinho } from './context/ContextoCarrinho'
import { FormProvider } from './context/FormContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import NotificationContainer from './components/common/NotificationContainer'
// import TesteModoAutenticado from './components/teste/TesteModoAutenticado'

import { BrowserRouter } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <h1>🛍️ Loja de Tênis</h1>
        <p>Sistema funcionando com React Router e Bootstrap!</p>
        <div className="alert alert-success">
          Se você está vendo esta mensagem estilizada, o CSS está carregando corretamente.
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
