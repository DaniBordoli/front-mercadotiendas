import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface NoShopRouteProps {
  children: React.ReactNode;
}

export function NoShopRoute({ children }: NoShopRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ya no redirigimos basado en si tiene tienda o no
  // Este componente ahora simplemente verifica la autenticación
  return <>{children}</>;
}
