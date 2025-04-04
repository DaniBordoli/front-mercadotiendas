import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface ShopRequiredRouteProps {
  children: React.ReactNode;
}

export const ShopRequiredRoute: React.FC<ShopRequiredRouteProps> = ({ children }) => {
  const { isAuthenticated, needsShopSetup } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (needsShopSetup) {
    return <Navigate to="/createshop" replace />;
  }

  return <>{children}</>;
};
