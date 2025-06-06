import React from 'react';
import ProtecaoCheckout from '../../components/common/ProtecaoCheckout';
import CheckoutPage from './CheckoutPage';

const CheckoutProtegido = () => {
  return (
    <ProtecaoCheckout>
      <CheckoutPage />
    </ProtecaoCheckout>
  );
};

export default CheckoutProtegido;
