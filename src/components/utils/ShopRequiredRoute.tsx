import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface ShopRequiredRouteProps {
  children: React.ReactNode;
}

export const ShopRequiredRoute: React.FC<ShopRequiredRouteProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
