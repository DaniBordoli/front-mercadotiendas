import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores';

export const useAuthRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useAuthStore(state => state.user);
    const isLoading = useAuthStore(state => state.isLoading);
    const needsProfileCompletion = useAuthStore(state => state.needsProfileCompletion);

    useEffect(() => {
        if (isLoading) return;

        const authOnlyRoutes = ['/my-shop', '/createshop', '/personal-form'];
        const isAuthOnlyRoute = authOnlyRoutes.includes(location.pathname);
        const isLoginPage = location.pathname === '/login';

        if (!user && isAuthOnlyRoute) {
            // Si no hay usuario y es una ruta que requiere autenticación
            navigate('/login');
        } else if (user) {
            if (needsProfileCompletion && location.pathname !== '/complete-profile') {
                // Si necesita completar el perfil y no está en esa página
                navigate('/complete-profile');
            } else if (isLoginPage) {
                // Si está autenticado y está en login, llevarlo a home
                navigate('/');
            }
        }
    }, [user, isLoading, navigate, location, needsProfileCompletion]);
};
