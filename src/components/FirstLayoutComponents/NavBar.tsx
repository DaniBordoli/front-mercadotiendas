import React, { useEffect } from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useShopStore } from '../../stores/slices/shopStore';
import { useAuthStore } from '../../stores';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

interface NavBarProps {
  navbarLinks?: { label: string; href: string }[];
  navbarTitle?: string;
  navbarTitleColor?: string;
  navbarLinksColor?: string;
  navbarIconsColor?: string;
  backgroundColor?: string;
  textColor?: string;
  fontType?: string;
  logoUrl?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  navbarLinks,
  navbarTitle = 'ShopSmart',
  navbarTitleColor,
  navbarLinksColor,
  navbarIconsColor,
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  fontType = 'Arial',
  logoUrl = '/logo.png',
}) => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const { shop, getShop, setShop } = useShopStore();
  const { isAuthenticated, user } = useAuthStore();
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);

  // Usar el logo del store si está disponible, sino usar el prop logoUrl
  const currentLogoUrl = editableVariables.logoUrl || logoUrl;

  // Crear enlaces dinámicos basados en si estamos en vista de tienda o no
  const getNavbarLinks = () => {
    const defaultLinks = [
      { label: 'Inicio', href: '/first-layout' },
      { label: 'Tienda', href: '/first-layout/shop-layout' },
      { label: 'Contacto', href: '/first-layout/contact-layout' },
      { label: 'Acerca de', href: '/first-layout/aboutus-layout' },
    ];
    
    if (shopId) {
      return [
        { label: 'Inicio', href: `/shop/${shopId}` },
        { label: 'Tienda', href: `/shop/${shopId}/tienda` },
        { label: 'Contacto', href: `/shop/${shopId}/contacto` },
        { label: 'Acerca de', href: `/shop/${shopId}/acerca-de` },
      ];
    }
    
    return navbarLinks && navbarLinks.length > 0 ? navbarLinks : defaultLinks;
  };
  
  const currentNavbarLinks = getNavbarLinks();

  useEffect(() => {
    if (user?.shop && !shop) {
      setShop(user.shop);
      return; 
    }
    
    if (isAuthenticated && !shop && !user?.shop) {
      getShop().catch(() => {
      });
    }
  }, [isAuthenticated, shop, getShop, user?.shop, setShop]);


  const shopFromStore = shop?.name;
  const shopFromUser = user?.shop?.name;
  const displayTitle = shopFromStore || shopFromUser || navbarTitle;

  return (
    <nav className="w-full shadow-sm" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div className="flex items-center gap-4">
          <img 
            src="/logo.png" 
            alt="Dashboard Logo" 
            className="h-8 w-8 object-contain cursor-pointer"
            onClick={() => navigate('/dashboard')}
          />
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              // Si estamos en ShopView, ir a la página principal de esa tienda
              if (shopId) {
                navigate(`/shop/${shopId}`);
              } else {
                navigate('/first-layout');
              }
            }}
          >
            <img 
              src={currentLogoUrl} 
              alt="Logo" 
              className="h-8 w-8 object-contain"
              onError={(e) => {
                
                e.currentTarget.src = '/logo.png';
              }}
            />
            <div
              className="text-2xl font-bold"
              style={{ color: navbarTitleColor || textColor, fontFamily: fontType }}
            >
              {displayTitle}
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          {currentNavbarLinks.map((link, idx) => (
            <a
              key={idx}
              className="hover:text-blue-500 cursor-pointer font-medium transition-colors duration-200"
              style={{ 
                color: navbarLinksColor || textColor || '#374151', // Fallback a un gris oscuro
                fontFamily: fontType 
              }}
              onClick={() => {
                if (link.href.startsWith('/')) {
                  navigate(link.href);
                }
              }}
              href={link.href.startsWith('/') ? undefined : link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-4">
          <FaUser 
            onClick={() => navigate('/data-profile')} 
            className="text-xl cursor-pointer hover:opacity-75 transition-opacity" 
            style={{ color: navbarIconsColor || textColor || '#374151' }} 
          />
          <div className="relative cursor-pointer hover:opacity-75 transition-opacity" onClick={() => {
            // Si estamos en ShopView, ir al carrito de esa tienda
            if (shopId) {
              navigate(`/shop/${shopId}/carrito`);
            } else {
              navigate('/cart-list');
            }
          }}>
            <FaShoppingCart 
              className="text-xl" 
              style={{ color: navbarIconsColor || textColor || '#374151' }} 
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold"
                style={{ minWidth: 18, minHeight: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
