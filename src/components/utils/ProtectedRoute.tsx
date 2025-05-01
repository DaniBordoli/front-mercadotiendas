import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, needsProfileCompletion } = useAuthStore();
  const pathname = window.location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está en /complete-profile pero no necesita completar el perfil
  if (pathname === '/complete-profile' && !needsProfileCompletion) {
    return <Navigate to="/dashboard" />;
  }

  // Si necesita completar el perfil y no está en /complete-profile
  if (needsProfileCompletion && pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" />;
  }

  return <>{children}</>;
};
