import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

console.log('🔍 Main.jsx com CSS carregando...');

const rootElement = document.getElementById('root');
console.log('🔍 Elemento root:', rootElement);

if (rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  console.log('✅ App com CSS renderizado!');
} else {
  console.error('❌ Elemento root não encontrado!');
}
