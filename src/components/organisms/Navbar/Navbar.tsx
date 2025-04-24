import React, { useState } from 'react';
import { Logo } from '../../atoms/Logo';
import { MdHelp } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaShop, FaUser } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/index';
import { FaShoppingCart } from "react-icons/fa";

export const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white shadow-md px-4 py-2 flex items-start justify-center z-50 fixed">
      <div className="container mx-auto flex justify-between max-w-7xl">
        <div className="flex flex-col max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-2 w-full">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
              <Logo size={28} color="skyblue" />
              <h1 className="text-xl font-bold ml-2 font-space">MercadoTiendas</h1>
            </div>
            <div className="flex-1 max-w-4xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-8 text-gray-600 text-sm justify-center mt-2 ml-52">
            <a href="#" className="hover:text-sky-500 transition-colors">Gestión de ventas</a>
            <div className="relative group">
              <a href="#" className="hover:text-sky-500 transition-colors">Categorias</a>
              <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md border border-gray-200 mt-2 w-48">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 1</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 2</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 3</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 4</li>
                </ul>
              </div>
            </div>
            <a href="#" className="hover:text-sky-500 transition-colors">Cupones</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Productos</a>
            <a href="#" className="hover:text-sky-500 transition-colors">Ofertas</a>
          </div>
        </div>
      </div>
      <div className="flex items-start space-x-6 mt-1 ml-auto pr-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center cursor-pointer hover:text-sky-500 transition-colors">
              <MdHelp className="text-xl mr-2" />
              <span>Enviar consulta</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-sky-500 transition-colors">
              <IoMdInformationCircleOutline className="text-xl mr-2" />
              <span>Tutoriales</span>
            </div>
            <div className="flex items-center cursor-pointer hover:text-sky-500 transition-colors">
              <FaShop className="text-xl mr-2" />
              <span>Ver mi tienda</span>
            </div>
            <div 
              className={`relative flex items-center cursor-pointer transition-colors ${
                isDropdownOpen ? 'text-sky-500' : 'hover:text-sky-500'
              }`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUser className="text-xl mr-2" />
              <span>Mi cuenta</span>
              {isDropdownOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 transition-transform duration-300 ease-in-out transform origin-top scale-y-100"
                  style={{ transform: isDropdownOpen ? 'scaleY(1)' : 'scaleY(0)' }}
                >
                  <ul className="py-2">
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={() => navigate('/my-profile')}
                    >
                      Mi perfil
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Mi plan</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Configurar dominio</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Data fiscal</li>
                    <li 
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
   ) : (
    <div className="flex items-center space-x-6">
      <div 
        className="flex items-center cursor-pointer hover:text-sky-500 transition-colors"
        onClick={() => navigate('/cart')}
      >
        <FaShoppingCart className="text-xl mr-2" />
        <span>Ver mi carrito</span>
      </div>
      <div 
        className="flex items-center cursor-pointer hover:text-sky-500 transition-colors"
        onClick={handleLoginClick}
      >
        <FaUser className="text-xl mr-2" />
        <span>Ingresa</span>
      </div>
    </div>
  )}
      </div>
    </nav>
  );
};