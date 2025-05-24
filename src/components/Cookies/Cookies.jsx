// src/components/CookiesConsent.jsx
import { useEffect, useState } from 'react';


const CookiesConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookiesAccepted');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="position-fixed bottom-0 w-100 bg-dark text-white py-3 px-4 d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ zIndex: 1050 }}>
      <p className="mb-2 mb-md-0">
        Usamos cookies para garantir a melhor experiência no nosso site. Ao continuar navegando, você concorda com isso.
      </p>
      <button onClick={acceptCookies} className="btn btn-primary btn-sm">
        Aceitar
      </button>
    </div>
  );
};

export default CookiesConsent;
