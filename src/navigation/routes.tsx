import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import CreateShop from '../screens/CreateShop';
import Dashboard from '../screens/Dashboard';

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
