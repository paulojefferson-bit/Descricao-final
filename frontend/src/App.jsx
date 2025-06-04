import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Header simplificado para teste
function HeaderSimples() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <a className="navbar-brand" href="/">
          🛍️ Digital Store
        </a>
        <div className="navbar-nav ms-auto">
          <a className="nav-link" href="/produtos">Produtos</a>
          <a className="nav-link" href="/carrinho">Carrinho</a>
        </div>
      </div>
    </nav>
  );
}

// Footer simplificado para teste
function FooterSimples() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p>&copy; 2025 Digital Store. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

// Página inicial
function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="display-4 text-primary">🛍️ Digital Store</h1>
          <p className="lead">Bem-vindo à nossa loja digital!</p>
          <div className="alert alert-success">
            ✅ Sistema funcionando com React 18 + Bootstrap + Router!
          </div>
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">🏠 Home</h5>
                  <p className="card-text">Página inicial funcionando</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">📦 Produtos</h5>
                  <p className="card-text">Catálogo de produtos</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">🛒 Carrinho</h5>
                  <p className="card-text">Carrinho de compras</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Página de produtos (placeholder)
function Produtos() {
  return (
    <div className="container mt-5">
      <h2>📦 Produtos</h2>
      <div className="alert alert-info">
        Página de produtos em desenvolvimento
      </div>
    </div>
  );
}

// Página do carrinho (placeholder)
function Carrinho() {
  return (
    <div className="container mt-5">
      <h2>🛒 Carrinho</h2>
      <div className="alert alert-info">
        Carrinho de compras em desenvolvimento
      </div>
    </div>
  );
}

function App() {
  console.log('🔍 App RESTAURADO sendo renderizado...');
  
  return (
    <BrowserRouter>
      <div className="App">
        <HeaderSimples />
        <main style={{ minHeight: '70vh' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/carrinho" element={<Carrinho />} />
          </Routes>
        </main>
        <FooterSimples />
      </div>
    </BrowserRouter>
  );
}

export default App
