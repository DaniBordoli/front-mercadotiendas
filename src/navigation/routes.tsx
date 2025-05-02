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
import FirstTemplate from '../screens/templates/FirstTemplate';
import SearchResultsPage from '../screens/SearchResultsPage';
import ProductDetailPage from '../screens/ProductDetailPage';
import PurchaseHistory from '../screens/PurchaseHistory';
import Subscription from '../screens/Subscription';
import Billing from '../screens/Billing';
import SalesManagement from '../screens/SalesManagement';
import ShopState from '../screens/ShopState';
import ShopConfig from '../screens/ShopConfig';
import ShopInfo from '../screens/ShopInfo';
import SeoMetadata from '../screens/Seo-Metadata';
import Settings from '../screens/Settings';
import DomainInfo from '../screens/ShopInfo';


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
  {
    path: '/dashboard', 
    element: <Dashboard />
  },
  {
    path: '/complete-profile', 
    element: <GoogleComplete />
  },  
  {
    path: '/first-template', 
    element: <FirstTemplate />
  },
  {
    path: '/search', 
    element: <SearchResultsPage />
  },
  {
    path: '/producto/:productId', 
    element: <ProductDetailPage />
    path: '/domain-config', 
    element: <DomainInfo />
  },
  {
    path: '/seo-metadata', 
    element: <SeoMetadata />
  },
  {
    path: '/settings', 
    element: <Settings />
  },
];


export const privateRoutes = [
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
