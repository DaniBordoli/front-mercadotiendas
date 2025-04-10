import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import type { AuthStore } from '../types/auth';

export function useAuthRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated, clearError } = useAuthStore();
  
  const isAuthPage = window.location.pathname === '/login' || 
                    window.location.pathname === '/reset-password';

  useEffect(() => {
    if (isAuthenticated && isAuthPage) {
      navigate('/dashboard');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError, isAuthPage]);
}
