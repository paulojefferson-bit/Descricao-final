import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './HomePage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import HomeCarrosel from '../../components/HomeCarrosel/HomeCarrosel';
import HomeColecaoDestaque from '../../components/HomeColecaoDestaque/HomeColecaoDestaque';
import HomeProdutos from '../../components/HomeProdutos/HomeProdutos';
import HomeOferta from '../../components/HomeOferta/HomeOferta';




const HomePage = () => {
  return (
    <>
    <HomeCarrosel/>
    <HomeColecaoDestaque/>
    <HomeProdutos/>
    <HomeOferta/>
    
    
    </>
  );
};

export default HomePage;