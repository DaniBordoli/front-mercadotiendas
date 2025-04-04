import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

interface NoShopRouteProps {
  children: React.ReactNode;
}

export function NoShopRoute({ children }: NoShopRouteProps) {
  const { isAuthenticated, needsShopSetup } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!needsShopSetup) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
