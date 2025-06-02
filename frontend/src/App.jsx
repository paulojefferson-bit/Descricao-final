import { BrowserRouter } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from './routes/AppRoutes'
import MainLayout from './layouts/MainLayout'
import { ProvedorCarrinho } from './context/ContextoCarrinho'
import { FormProvider } from './context/FormContext'

function App() {
  return (
    <ProvedorCarrinho>
      <FormProvider>
        <BrowserRouter>
          <MainLayout>
            <AppRoutes />
          </MainLayout>
        </BrowserRouter>
      </FormProvider>
    </ProvedorCarrinho>
  )
}

export default App
