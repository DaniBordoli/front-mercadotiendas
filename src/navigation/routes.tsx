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
import CartCheckout from '../screens/CartCheckout';
import CartSummary from '../screens/CartSummary';
import CartCompleted from '../screens/CartCompleted';
import MyProductsSection from '../screens/MyProductsSection';
import EditProductScreen from '../screens/EditProductScreen';
import NewProductScreen from '../screens/NewProductScreen';
import DataCatalog from '../screens/DataCatalog';
import PaymentReturn from '../screens/PaymentReturn';
import DataCurrency from '../screens/DataCurrency';
import ShopView from '../screens/ShopView';
import CampaignsListScreen from '../screens/CampaignsListScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import CampaignCreateScreen from '../screens/CampaignCreateScreen';
import CampaignApplicationsScreen from '../screens/CampaignApplicationsScreen';
import CampaignEditScreen from '../screens/CampaignEditScreen';
import MyApplicationsScreen from '../screens/MyApplicationsScreen';
import UserDashboard from '../screens/UserDashboard';
import BecomeInfluencerScreen from '../screens/BecomeInfluencerScreen';
import InfluencerProfileScreen from '../screens/InfluencerProfileScreen';
import BasicData from '../screens/BasicData';
import RegisterData from '../screens/RegisterData';
import DataSeller from '../screens/DataSeller';
import DataInfluencer from '../screens/DataInfluencer';
import RoleConfigurationScreen from '../screens/RoleConfigurationScreen';
import Success from '../screens/Success';
import CategoriesPage from '../screens/CategoriesPage';
import SubcategoriesElectroAudio from '../screens/SubcategoriesElectroAudio';
import SubcategoriaModa from '../screens/SubcategoriaModa';
import HomeBuyer from '../screens/HomeBuyer';


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
    path: '/basic-data',
    element: <BasicData />
  },
  {
    path: '/register-data',
    element: <RegisterData />
  },
  {
    path: '/data-seller',
    element: <DataSeller />
  },
  {
    path: '/data-influencer',
    element: <DataInfluencer />
  },
  {
    path: '/success',
    element: <Success />
  },
  {
    path: '/role-configuration',
    element: <RoleConfigurationScreen />
  },
  {
    path: '/dashboard', 
    element: <Dashboard />
  },
  {
    path: '/homebuyer',
    element: <HomeBuyer />
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
  // Rutas para tiendas individuales con Shop ID
  {
    path: '/shop/:shopId',
    element: <ShopView />
  },
  {
    path: '/shop/:shopId/tienda',
    element: <ShopView />
  },
  {
    path: '/shop/:shopId/producto/:productId',
    element: <ShopView />
  },
  {
    path: '/shop/:shopId/contacto',
    element: <ShopView />
  },
  {
    path: '/shop/:shopId/acerca-de',
    element: <ShopView />
  },
  {
    path: '/shop/:shopId/carrito',
    element: <ShopView />
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
  {
    path: '/payment/return/*',
    element: <PaymentReturn />
  },
  {
    path: '/campaigns',
    element: <CampaignsListScreen />
  },
  {
    path: '/campaigns/:id',
    element: <CampaignDetailScreen />
  },
  {
    path: '/categories',
    element: <CategoriesPage />
  },
  {
    path: '/subcategoriaelectroaudio',
    element: <SubcategoriesElectroAudio />
  },
  {
    path: '/subcategoriamoda',
    element: <SubcategoriaModa />
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
  },
  {
    path: '/campaigns/create',
    element: <ProtectedRoute><CampaignCreateScreen /></ProtectedRoute>
  },
  {
    path: '/campaigns/:id/applications',
    element: <ProtectedRoute><CampaignApplicationsScreen /></ProtectedRoute>
  },
  {
    path: '/campaigns/:id/edit',
    element: <ProtectedRoute><CampaignEditScreen /></ProtectedRoute>
  },
  {
    path: '/my-applications',
    element: <ProtectedRoute><MyApplicationsScreen /></ProtectedRoute>
  },
  {
    path: '/user-dashboard',
    element: <ProtectedRoute><UserDashboard /></ProtectedRoute>
  },
  {
    path: '/become-influencer',
    element: <ProtectedRoute><BecomeInfluencerScreen /></ProtectedRoute>
  },
  {
    path: '/influencer-profile',
    element: <ProtectedRoute><InfluencerProfileScreen /></ProtectedRoute>
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
