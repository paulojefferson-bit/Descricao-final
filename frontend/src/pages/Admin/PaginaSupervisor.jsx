import React from 'react';
import ProtecaoRota from '../../components/common/ProtecaoRota';
import DashboardSupervisor from '../../components/admin/DashboardSupervisor';

const PaginaSupervisor = () => {
  return (
    <ProtecaoRota tipoUsuarioMinimo="supervisor">
      <DashboardSupervisor />
    </ProtecaoRota>
  );
};

export default PaginaSupervisor;
