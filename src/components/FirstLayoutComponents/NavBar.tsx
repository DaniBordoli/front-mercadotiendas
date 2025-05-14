import React from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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
    { label: 'Shop', href: '/shop-layout' },
    { label: 'Contact', href: '/contact-layout' },
  ],
  title = 'ShopSmart',
  backgroundColor = '#FFFFFF',
  textColor = '#000000',
  fontType = 'Arial',
}) => {
  const navigate = useNavigate();

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
              onClick={() => link.href.startsWith('/') ? navigate(link.href) : undefined}
              href={link.href.startsWith('/') ? undefined : link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex gap-4">
          <FaUser onClick={() => navigate('/user-layout')} className="text-xl cursor-pointer" style={{ color: textColor }} />
          <FaShoppingCart onClick={() => navigate('/cart-layout')} className="text-xl cursor-pointer" style={{ color: textColor }} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
