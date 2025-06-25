import React, { useEffect } from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';
import { useShopStore } from '../../stores/slices/shopStore';
import { useAuthStore } from '../../stores';

interface NavBarProps {
  navbarLinks?: { label: string; href: string }[];
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  fontType?: string;
  logoUrl?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  navbarLinks = [
    { label: 'Home', href: '/first-layout' },
    { label: 'Shop', href: '/first-layout/shop-layout' },
    { label: 'Contact', href: '/first-layout/contact-layout' },
  ],
  title = 'ShopSmarttt',
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  fontType = 'Arial',
  logoUrl = '/logo.png',
}) => {
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const { shop, getShop, setShop } = useShopStore();
  const { isAuthenticated, user } = useAuthStore();

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
  const displayTitle = shopFromStore || shopFromUser || title;

  return (
    <nav className="w-full shadow-sm" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div
          className="flex items-center gap-3 ml-8 cursor-pointer"
          onClick={() => navigate('/first-layout')}
        >
          <img 
            src={logoUrl} 
            alt="Logo" 
            className="h-8 w-8 object-contain"
            onError={(e) => {
              // Fallback al logo por defecto si hay error cargando el logo personalizado
              e.currentTarget.src = '/logo.png';
            }}
          />
          <div
            className="text-2xl font-bold"
            style={{ color: textColor, fontFamily: fontType }}
          >
            {displayTitle}
          </div>
        </div>
        <div className="flex gap-4">
          {navbarLinks.map((link, idx) => (
            <a
              key={idx}
              className="hover:text-blue-500 cursor-pointer"
              style={{ color: textColor, fontFamily: fontType }}
              onClick={() => link.href.startsWith('/') ? navigate(link.href.startsWith('/first-layout') ? link.href : `/first-layout${link.href}`) : undefined}
              href={link.href.startsWith('/') ? undefined : link.href}
            >
              {link.label}
            </a>
          ))}
        </div>        <div className="flex gap-4">
          <FaUser onClick={() => navigate('/first-layout/user-layout')} className="text-xl cursor-pointer" style={{ color: textColor }} />
          <div className="relative cursor-pointer" onClick={() => navigate('/cart-list')}>
            <FaShoppingCart className="text-xl" style={{ color: textColor }} />
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
