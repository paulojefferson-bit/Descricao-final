import React from 'react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Cookies from '../components/Cookies/Cookies'

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
      <Cookies/>
      <Footer />
    </>
  );
};

export default MainLayout;
