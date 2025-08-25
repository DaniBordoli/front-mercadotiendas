import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

export const HomeRedirect: React.FC = () => {
  const { user, getCurrentUserMode } = useAuthStore();
  
  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Obtener el modo actual del usuario
  const currentMode = getCurrentUserMode();
  
  // Redirigir según el tipo de usuario
  switch (currentMode) {
    case 'buyer':
    case 'comprador':
      return <Navigate to="/homebuyer" replace />;
    case 'seller':
    case 'vendedor':
      return <Navigate to="/dashboard" replace />;
    case 'influencer':
      return <Navigate to="/user-dashboard" replace />;
    default:
      // Si no hay tipo específico, usar dashboard por defecto
      return <Navigate to="/dashboard" replace />;
  }
};