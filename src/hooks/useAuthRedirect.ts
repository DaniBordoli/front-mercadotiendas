import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';

export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isLoading, getCurrentUserMode } = useAuthStore();

    useEffect(() => {
        if (isLoading) return;

        const publicRoutes = ['/login', '/register', '/reset-password'];
        const isPublicRoute = publicRoutes.includes(location.pathname);

        if (!user && !isPublicRoute) {
            // Si no hay usuario y no es una ruta pública, redirigir a login
            navigate('/login');
        } else if (user && isPublicRoute) {
            // Si hay usuario y es una ruta pública, redirigir según su tipo
            const currentMode = getCurrentUserMode();
            
            switch (currentMode) {
                case 'buyer':
                case 'comprador':
                    navigate('/homebuyer');
                    break;
                case 'seller':
                case 'vendedor':
                    navigate('/dashboard');
                    break;
                case 'influencer':
                    navigate('/user-dashboard');
                    break;
                default:
                    navigate('/dashboard');
                    break;
            }
        }
    }, [user, isLoading, navigate, location, getCurrentUserMode]);
};
