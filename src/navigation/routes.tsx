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
import DataSalesManagement from '../screens/DataSalesManagement';
import DataDashboard from '../screens/DataDashboard';
import DataPurchaseHistory from '../screens/DataPurchaseHistory';
import DataBilling from '../screens/DataBilling';
import DataSubscription from '../screens/DataSubscription';
import DataShopState from '../screens/DataShopState';
import DataCreateShop from '../screens/DataCreateShop';
import DataShopConfig from '../screens/DataShopConfig';
import DataPersonalInfo from '../screens/DataPersonalInfo';


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
  },
  {
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
  {
    path: '/data-dashboard', 
    element: <DataDashboard />
  },
  {
    path: '/data-sales-management',
    element: <DataSalesManagement /> 
  },
  {
    path: '/data-purchase-history',
    element: <DataPurchaseHistory />
  },
  {
    path: '/data-billing',
    element: <DataBilling />
  },
  {
    path: '/data-subscription',
    element: <DataSubscription />
  },
  {
    path: '/data-shop-state',
    element: <DataShopState />
  },
  {
    path: '/data-create-shop',
    element: <DataCreateShop />
  },
  {
    path: '/data-shop-config',
    element: <DataShopConfig />
  },
  {
    path: '/data-profile',
    element: <DataPersonalInfo />
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
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
];
