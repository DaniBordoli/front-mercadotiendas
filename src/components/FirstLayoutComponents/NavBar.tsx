import React from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

interface NavBarProps {
  navbarLinks?: { label: string; href: string }[];
  title?: string;
  backgroundColor?: string;
  textColor?: string;
  fontType?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  navbarLinks = [
    { label: 'Home', href: '/first-layout' },
    { label: 'Shop', href: '/first-layout/shop-layout' },
    { label: 'Contact', href: '/first-layout/contact-layout' },
  ],
  title = 'ShopSmart',
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  fontType = 'Arial',
}) => {
  const navigate = useNavigate();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="w-full shadow-sm" style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div
          className="text-2xl ml-8 font-bold cursor-pointer"
          style={{ color: textColor, fontFamily: fontType }}
          onClick={() => navigate('/first-layout')}
        >
          {title}
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
