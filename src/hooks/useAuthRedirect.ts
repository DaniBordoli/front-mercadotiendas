import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';

export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore(state => state.user);
    const isLoading = useAuthStore(state => state.isLoading);

    useEffect(() => {
        if (isLoading) return;

        const publicRoutes = ['/login', '/register', '/reset-password', '/basic-data', '/register-data', '/data-seller', '/data-influencer', '/success', '/role-configuration'];
        const isPublicRoute = publicRoutes.includes(location.pathname);

        if (!user && !isPublicRoute) {
            // Si no hay usuario y no es una ruta pública, redirigir a login
            navigate('/login');
        } else if (user && isPublicRoute) {
            // Si hay usuario y es una ruta pública, redirigir a home
            navigate('/');
        }
    }, [user, isLoading, navigate, location]);
};
