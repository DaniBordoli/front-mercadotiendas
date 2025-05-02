import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import CreateShop from '../screens/CreateShop';
import Dashboard from '../screens/Dashboard';
import InfoTienda from '../screens/InfoTienda';
import VerifyPassword from '../screens/VerifyPassword';
import AccountActivation from '../screens/AccountActivation';
import { ProtectedRoute } from '../components/utils/ProtectedRoute';
import { ShopRequiredRoute } from '../components/utils/ShopRequiredRoute';
import { NoShopRoute } from '../components/utils/NoShopRoute';
import ProfileScreen from '../screens/ProfileScreen';
import PersonalForm from '../screens/PersonalForm';
import RedesTienda from '../screens/RedesTienda';
import ResetPass from '../screens/ResetPass';
import PersonalInfo from '../screens/PersonalInfo';
import GoogleComplete from '../screens/GoogleComplete';
import CreateShopAIScreen from '../screens/CreateShopAIScreen';
import PurchaseHistory from '../screens/PurchaseHistory';
import Subscription from '../screens/Subscription';
import Billing from '../screens/Billing';
import SalesManagement from '../screens/SalesManagement';
import ShopState from '../screens/ShopState';
import ShopConfig from '../screens/ShopConfig';


export const publicRoutes = [
  {
    path: '/',
    element: <Dashboard />
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
    path: '/reset-password',
    element: <ResetPass />
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
];

export const privateRoutes = [
  {
    path: '/complete-profile',
    element: <ProtectedRoute><GoogleComplete /></ProtectedRoute>
  },
  {
    path: '/createshop',
    element: <NoShopRoute><CreateShop /></NoShopRoute>
  },
  {
    path: '/my-shop',
    element: <ShopRequiredRoute><InfoTienda /></ShopRequiredRoute>
  },
  {
    path: '/informacion-tienda-redes',
    element: <ShopRequiredRoute><RedesTienda /></ShopRequiredRoute>
  },
  {
    path: '/my-profile',
    element: <ShopRequiredRoute><ProfileScreen /></ShopRequiredRoute>
  },
  {
    path: '/personal-form',
    element: <ShopRequiredRoute><PersonalForm /></ShopRequiredRoute>
  },
  {
    path: '/personal-info',
    element: <ShopRequiredRoute><PersonalInfo /></ShopRequiredRoute>
  }
  ,
  {
    path: '/purchase-history',
    element: <ShopRequiredRoute><PurchaseHistory /></ShopRequiredRoute>
  },
  {
    path: '/subscription',
    element: <ShopRequiredRoute><Subscription /></ShopRequiredRoute>
  }
  ,
  {
    path: '/Billing',
    element: <ShopRequiredRoute><Billing /></ShopRequiredRoute>
  }
  ,
  {
    path: '/sales-management',
    element: <ShopRequiredRoute><SalesManagement /></ShopRequiredRoute>
  }
  ,
  {
    path: '/shop-state',
    element: <ShopRequiredRoute><ShopState /></ShopRequiredRoute>
  }
  ,
  {
    path: '/shop-config',
    element: <ShopRequiredRoute><ShopConfig /></ShopRequiredRoute>
  },
  {
    path: '/create-shop-ai',
    element: <ProtectedRoute><CreateShopAIScreen /></ProtectedRoute>
  }
];

export const redirectRoutes = [
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
];
