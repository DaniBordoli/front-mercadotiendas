import { Navigate } from 'react-router-dom';
import Register from '../screens/Register';
import Login from '../screens/Login';
import Dashboard from '../screens/Dashboard';
import VerifyPassword from '../screens/VerifyPassword';
import AccountActivation from '../screens/AccountActivation';
import { ProtectedRoute } from '../components/utils/ProtectedRoute';
import { ShopRequiredRoute } from '../components/utils/ShopRequiredRoute';
import { NoShopRoute } from '../components/utils/NoShopRoute';
import ResetPass from '../screens/ResetPass';
import GoogleComplete from '../screens/GoogleComplete';
import CreateShopAIScreen from '../screens/CreateShopAIScreen';
import FirstTemplate from '../screens/templates/FirstTemplate';
import SearchResultsPage from '../screens/SearchResultsPage';
import ProductDetailPage from '../screens/ProductDetailPage';
import SeoMetadata from '../screens/Seo-Metadata';
import Settings from '../screens/Settings';
import DomainInfo from '../screens/DomainInfo';
import DataSalesManagement from '../screens/DataSalesManagement';
import DataDashboard from '../screens/DataDashboard';
import DataPurchaseHistory from '../screens/DataPurchaseHistory';
import DataBilling from '../screens/DataBilling';
import DataPaymentMethod from '../screens/DataPaymentMethod';
import DataSubscription from '../screens/DataSubscription';
import DataShopState from '../screens/DataShopState';
import DataCreateShop from '../screens/DataCreateShop';
import DataShopConfig from '../screens/DataShopConfig';
import DataPersonalInfo from '../screens/DataPersonalInfo';
import ShopCreate from '../screens/ShopCreate';
import FirstLayout from '../screens/LayoutScreens/FirstLayout';
import ShopLayout from '../screens/LayoutScreens/ShopLayout';
import ProductDetailScreen from '../screens/LayoutScreens/ProductDetailScreen';
import CartScreen from '../screens/LayoutScreens/CartScreen';
import ShippingScreen from '../screens/LayoutScreens/ShippingScreen';
import LoginScreen from '../screens/LayoutScreens/LoginScreen';
import RegisterScreen from '../screens/LayoutScreens/RegisterScreen';
import OrderConfirmed from '../screens/LayoutScreens/OrderConfirmed';
import UserProfileScreen from '../screens/LayoutScreens/UserProfileScreen';
import AboutUsScreen from '../screens/LayoutScreens/AboutUsScreen';
import ContactScreen from '../screens/LayoutScreens/ContactScreen';
import LayoutSelection from '../screens/LayoutSelection';
import CartList from '../screens/CartList';
import CartCheckout from '../screens/CartCheckout'
import CartSummary from '../screens/CartSummary';
import CartCompleted from '../screens/CartCompleted';
import MyProductsSection from '../screens/MyProductsSection';
import EditProductScreen from '../screens/EditProductScreen';
import NewProductScreen from '../screens/NewProductScreen';
import DataCatalog from '../screens/DataCatalog';
import PaymentReturn from '../screens/PaymentReturn';
import DataCurrency from '../screens/DataCurrency';


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
    path: '/producto/:id', 
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
    path: '/data-payment-method',
    element: <DataPaymentMethod />
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
  
  {
    path: '/first-layout/shop-layout',
    element: <ShopLayout />
  },  {
    path: '/first-layout/detail-layout',
    element: <ProductDetailScreen />
  },
  {
    path: '/first-layout/detail-layout/:id',
    element: <ProductDetailScreen />
  },
  {
    path: '/first-layout/cart-layout',
    element: <CartScreen />
  },
  {
    path: '/first-layout/shipping-layout',
    element: <ShippingScreen />
  },
  {
    path: '/first-layout/login-layout',
    element: <LoginScreen />
  },
  {
    path: '/first-layout/register-layout',
    element: <RegisterScreen />
  },
  {
    path: '/first-layout/order-layout',
    element: <OrderConfirmed />
  },
  {
    path: '/first-layout/user-layout',
    element: <UserProfileScreen />
  },
  {
    path: '/first-layout/aboutus-layout',
    element: <AboutUsScreen />
  },
  {
    path: '/first-layout/contact-layout',
    element: <ContactScreen />
  },  {
    path: '/cart-list',
    element: <CartList />
  },
  {
    path: '/cart',
    element: <CartList />
  },
   {
    path: '/cart-checkout',
    element: <CartCheckout />
  },
   {
    path: '/cart-summary',
    element: <CartSummary />
  },
  {
    path: '/cart-completed',
    element: <CartCompleted />
  },
    {
    path: '/data-products',
    element: <MyProductsSection />
  },
  {
    path: '/edit-products/:id',
    element: <EditProductScreen />
  },
  {
    path: '/new-product',
    element: <NewProductScreen />
  },
  {
    path: '/data-category',
    element: <DataCatalog />
  },
   {
    path: '/data-currency',
    element: <DataCurrency />
  },
  {
    path: '/payment/return',
    element: <PaymentReturn />
  },
];


export const privateRoutes = [
  {
    path: '/create-shop-ai',
    element: <ProtectedRoute><CreateShopAIScreen /></ProtectedRoute>
  },
   {
    path: '/first-layout',
    element: <ProtectedRoute><FirstLayout /></ProtectedRoute>
  }
  ,
   {
    path: '/layout-select',
    element: <ProtectedRoute><LayoutSelection /></ProtectedRoute>
  }
  ,
   {
    path: '/shop-create',
    element: <ProtectedRoute><ShopCreate /></ProtectedRoute>
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
