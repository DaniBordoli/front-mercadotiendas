import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaChevronDown, FaUser } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';
import { FaShop } from "react-icons/fa6";
import { FaDollarSign } from "react-icons/fa6";
import { MdShoppingBasket } from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import { MdHelp } from "react-icons/md";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="w-72 bg-white shadow-md flex flex-col fixed top-16" style={{ height: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
      <div className="flex items-center p-4 mt-6 text-sky-500">
        <FaHome className="text-2xl mr-8" />
        <span className="text-lg">Inicio</span>
        <FiExternalLink className="text-2xl ml-2 text-black ml-32" />
      </div>
      <div className="p-4 text-xs font-bold">
        lorem.ipsum.com.ar
      </div>
      <div className="p-2 flex items-center justify-between">
        <span className="text-sky-500 text-sm font-bold bg-[#a2daf2] rounded-md px-4 py-1 inline-block">
          Tienda Apagada
        </span>
        <label className="relative inline-flex items-center cursor-pointer ml-4">
          <input type="checkbox" className="sr-only peer" />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-sky-500 peer-checked:bg-sky-500"></div>
          <div className="absolute w-5 h-5 bg-white rounded-full left-1 top-0.5 peer-checked:translate-x-5 transition-transform"></div>
        </label>
      </div>
      <hr className="mt-2 border-gray" />
      <nav className="space-y-4 flex flex-col flex-grow">
        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-full ${openDropdown === 'miTienda' ? 'text-sky-500' : ''}`}
          onClick={() => toggleDropdown('miTienda')}
        >
          <div className="flex items-center w-full px-4">
            <FaShop className={`text-xl mr-4 ${openDropdown === 'miTienda' ? 'text-sky-500' : ''}`} />
            <span className="text-lg font-semibold my-3">Mi tienda</span>
          </div>
          <FaChevronDown className={`${openDropdown === 'miTienda' ? 'transform rotate-180 text-sky-500' : ''} mr-4`} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-100 ${openDropdown === 'miTienda' ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="space-y-2">
            <div className="text-sm cursor-pointer px-4">Submenu 1</div>
            <div className="text-sm cursor-pointer px-4">Submenu 2</div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-full ${openDropdown === 'ventas' ? 'text-sky-500' : ''}`}
          onClick={() => toggleDropdown('ventas')}
        >
          <div className="flex items-center w-full px-4">
            <FaDollarSign className={`text-xl mr-4 ${openDropdown === 'ventas' ? 'text-sky-500' : ''}`} />
            <span className="text-lg font-semibold my-3">Gestión de ventas</span>
          </div>
          <FaChevronDown className={`${openDropdown === 'ventas' ? 'transform rotate-180 text-sky-500' : ''} mr-4`} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-100 ${openDropdown === 'ventas' ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="space-y-2">
            <div className="text-sm cursor-pointer  px-4">Ventas 1</div>
            <div className="text-sm cursor-pointer  px-4">Ventas 2</div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-full ${openDropdown === 'productos' ? 'text-sky-500' : ''}`}
          onClick={() => toggleDropdown('productos')}
        >
          <div className="flex items-center w-full px-4">
            <MdShoppingBasket className={`text-xl mr-4 ${openDropdown === 'productos' ? 'text-sky-500' : ''}`} />
            <span className="text-lg font-semibold my-3">Productos</span>
          </div>
          <FaChevronDown className={`${openDropdown === 'productos' ? 'transform rotate-180 text-sky-500 transition-transform duration-200' : 'transition-transform duration-200'} mr-4`} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-100 ${openDropdown === 'productos' ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="space-y-2">
            <div className="text-sm cursor-pointer px-4">Producto 1</div>
            <div className="text-sm cursor-pointer px-4">Producto 2</div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-full ${openDropdown === 'potenciar' ? 'text-sky-500' : ''}`}
          onClick={() => toggleDropdown('potenciar')}
        >
          <div className="flex items-center w-full px-4">
            <FiTrendingUp className={`text-xl mr-4 ${openDropdown === 'potenciar' ? 'text-sky-500' : ''}`} />
            <span className="text-lg font-semibold my-3">Potenciar mi tienda</span>
          </div>
          <FaChevronDown className={`${openDropdown === 'potenciar' ? 'transform rotate-180 text-sky-500 transition-transform duration-200' : 'transition-transform duration-200'} mr-4`} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-100 ${openDropdown === 'potenciar' ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="space-y-2">
            <div className="text-sm cursor-pointer px-4">Potenciar 1</div>
            <div className="text-sm cursor-pointer px-4">Potenciar 2</div>
          </div>
        </div>

        <div className="flex-grow"></div>

        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-full ${openDropdown === 'miCuenta' ? 'text-sky-500' : ''}`}
          onClick={() => toggleDropdown('miCuenta')}
        >
          <div className="flex items-center w-full px-4">
            <FaUser className={`text-xl mr-4 ${openDropdown === 'miCuenta' ? 'text-sky-500' : ''}`} />
            <span className="text-lg font-semibold my-3">Mi cuenta</span>
          </div>
          <FaChevronDown className={`${openDropdown === 'miCuenta' ? 'transform rotate-180 text-sky-500 transition-transform duration-200' : 'transition-transform duration-200'} mr-4`} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-200 transform ${openDropdown === 'miCuenta' ? 'max-h-96 translate-y-0' : 'max-h-0 -translate-y-4'}`}
        >
          <div className="space-y-2">
            <div className="text-sm cursor-pointer px-4">Cuenta 1</div>
            <div className="text-sm cursor-pointer px-4">Cuenta 2</div>
          </div>
        </div>

        <div
          className={`flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors duration-200 w-full ${openDropdown === 'centroAyuda' ? 'text-sky-500' : ''}`}
          onClick={() => toggleDropdown('centroAyuda')}
        >
          <div className="flex items-center w-full px-4">
            <MdHelp className={`text-xl mr-4 ${openDropdown === 'centroAyuda' ? 'text-sky-500' : ''}`} />
            <span className="text-lg font-semibold my-3">Centro de ayuda</span>
          </div>
          <FaChevronDown className={`${openDropdown === 'centroAyuda' ? 'transform rotate-180 text-sky-500 transition-transform duration-200' : 'transition-transform duration-200'} mr-4`} />
        </div>
        <div
          className={`overflow-hidden transition-all duration-200 transform ${openDropdown === 'centroAyuda' ? 'max-h-96 translate-y-0' : 'max-h-0 -translate-y-4'}`}
        >
          <div className="space-y-2">
            <div className="text-sm cursor-pointer px-4">Ayuda 1</div>
            <div className="text-sm cursor-pointer px-4">Ayuda 2</div>
          </div>
        </div>

        <div className="mb-18"></div>
      </nav>
    </div>
  );
};
