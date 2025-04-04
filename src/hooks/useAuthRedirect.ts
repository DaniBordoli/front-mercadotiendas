import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import type { AuthStore } from '../types/auth';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated, needsShopSetup, clearError } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      if (needsShopSetup) {
        navigate('/createshop');
      } else {
        navigate('/dashboard');
      }
    }
    return () => clearError();
  }, [isAuthenticated, needsShopSetup, navigate, clearError]);
}
