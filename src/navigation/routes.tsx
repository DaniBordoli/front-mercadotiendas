import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import CreateShop from '../screens/CreateShop';
import Dashboard from '../screens/Dashboard';
import InfoTienda from '../screens/InfoTienda';
import ResetPassword from '../screens/ResetPassword';
import VerifyPassword from '../screens/VerifyPassword';
import { ProtectedRoute } from '../components/utils/ProtectedRoute';
import { ShopRequiredRoute } from '../components/utils/ShopRequiredRoute';
import { NoShopRoute } from '../components/utils/NoShopRoute';
import ProfileScreen from '../screens/ProfileScreen';

// Rutas públicas (no requieren autenticación)
export const publicRoutes = [
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  }
  ,
  {
    path: '/reset-password',
    element: <ResetPassword />
  }
  ,
  {
    path: '/email-verification',
    element: <VerifyPassword />
  }
  ,
  {
    path: '/account-confirm',
    element: <VerifyPassword />
  }
  ,
  {
    path: '/password-restore',
    element: <VerifyPassword />
  }
];

// Rutas privadas (requieren autenticación)
export const privateRoutes = [
  {
    path: '/createshop',
    element: <NoShopRoute><CreateShop /></NoShopRoute>
  },
  {
    path: '/dashboard',
    element: <ShopRequiredRoute><Dashboard /></ShopRequiredRoute>
  },
  {
    path: '/informacion-tienda',
    element: <ShopRequiredRoute><InfoTienda /></ShopRequiredRoute>
  },
  {
    path: '/my-profile',
    element: <ShopRequiredRoute><ProfileScreen /></ShopRequiredRoute>
  }
];

// Rutas de redirección
export const redirectRoutes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
];
