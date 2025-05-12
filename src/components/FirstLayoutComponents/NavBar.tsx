import React from 'react';
import { FaUser, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full shadow-sm bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
        <div
          className="text-2xl ml-8 font-bold cursor-pointer"
          onClick={() => navigate('/first-layout')}
        >
          ShopSmart
        </div>
        <div className="flex gap-4">
          <a className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/first-layout')}>Home</a>
          <a className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/shop-layout')}>Shop</a>
          <a href="#blog" className="hover:text-blue-500">Blog</a>
          <a href="#pages" className="hover:text-blue-500">Pages</a>
          <a className="hover:text-blue-500 cursor-pointer" onClick={() => navigate('/contact-layout')}>Contact</a>
        </div>
        <div className="flex gap-4">
          <FaUser onClick={() => navigate('/user-layout')} className="text-xl cursor-pointer" />
          <FaShoppingCart onClick={() => navigate('/cart-layout')} className="text-xl cursor-pointer" />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
