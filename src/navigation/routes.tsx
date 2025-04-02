import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import CreateShop from '../screens/CreateShop';

export const routes = [
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/createshop',
    element: <CreateShop />
  }
];
