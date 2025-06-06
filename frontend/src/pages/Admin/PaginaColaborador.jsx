import React from 'react';
import ProtecaoRota from '../../components/common/ProtecaoRota';
import DashboardColaborador from '../../components/admin/DashboardColaborador';

const PaginaColaborador = () => {
  return (
    <ProtecaoRota tipoUsuarioMinimo="colaborador">
      <DashboardColaborador />
    </ProtecaoRota>
  );
};

export default PaginaColaborador;
