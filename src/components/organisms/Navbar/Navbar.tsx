import React, { useState } from 'react';
import { Logo } from '../../atoms/Logo';
import { MdHelp } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaShop, FaUser } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/index';

export const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-white shadow-md px-4 py-4 flex items-center justify-between z-50 relative">
      <div className="flex items-center">
        <Logo size={32} color="skyblue" />
        <h1 className="text-2xl font-bold ml-2 text-sky-500">MercadoTienda</h1>
      </div>
      <div className="flex items-center space-x-6">
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
      </div>
    </nav>
  );
};
