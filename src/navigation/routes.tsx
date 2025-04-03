import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import CreateShop from '../screens/CreateShop';
import Dashboard from '../screens/Dashboard';
import InfoTienda from '../screens/InfoTienda';
import ResetPassword from '../screens/ResetPassword';
import VerifyPassword from '../screens/VerifyPassword';

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
];

// Rutas privadas (requieren autenticación)
export const privateRoutes = [
  {
    path: '/createshop',
    element: <CreateShop />
  },
  {
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/informacion-tienda',
    element: <InfoTienda />
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
