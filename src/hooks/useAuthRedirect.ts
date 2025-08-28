import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';

export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const isLoading = useAuthStore(state => state.isLoading);
    const isValidating = useAuthStore(state => state.isValidating);

    useEffect(() => {
        // No redirigir mientras se está cargando o validando
        if (isLoading || isValidating) return;

        const publicRoutes = ['/login', '/register', '/reset-password', '/basic-data', '/register-data', '/data-seller', '/data-influencer', '/success', '/role-configuration'];
        const isPublicRoute = publicRoutes.includes(location.pathname);

        if (!isAuthenticated && !isPublicRoute) {
            // Si no está autenticado y no es una ruta pública, redirigir a login
            navigate('/login');
        } else if (isAuthenticated && isPublicRoute) {
            // Si está autenticado y es una ruta pública, redirigir a home
            navigate('/');
        }
    }, [isAuthenticated, isLoading, isValidating, navigate, location]);
};
