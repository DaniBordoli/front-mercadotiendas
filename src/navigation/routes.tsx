import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import CreateShop from '../screens/CreateShop';
import Dashboard from '../screens/Dashboard';
import InfoTienda from '../screens/InfoTienda';
import ResetPassword from '../screens/ResetPassword';
import VerifyPassword from '../screens/VerifyPassword';
import AccountActivation from '../screens/AccountActivation';
import { ProtectedRoute } from '../components/utils/ProtectedRoute';
import { ShopRequiredRoute } from '../components/utils/ShopRequiredRoute';
import { NoShopRoute } from '../components/utils/NoShopRoute';
import ProfileScreen from '../screens/ProfileScreen';

export const publicRoutes = [
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/email-verification',
    element: <VerifyPassword />
  },
  {
    path: '/account-confirm',
    element: <VerifyPassword />
  },
  {
    path: '/password-restore',
    element: <VerifyPassword />
  },
  {
    path: '/activate-account',
    element: <AccountActivation />
  },
  {
    path: '/dashboard', 
    element: <Dashboard />
  }
];

export const privateRoutes = [
  {
    path: '/createshop',
    element: <NoShopRoute><CreateShop /></NoShopRoute>
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

export const redirectRoutes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
];
