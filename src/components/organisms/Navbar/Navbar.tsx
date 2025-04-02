import React from 'react';
import { Logo } from '../../atoms/Logo';
import { MdHelp } from "react-icons/md";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { FaShop, FaUser } from "react-icons/fa6";

export const Navbar: React.FC = () => {
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
        <div className="flex items-center cursor-pointer hover:text-sky-500 transition-colors">
          <FaUser className="text-xl mr-2" />
          <span>Mi cuenta</span>
        </div>
      </div>
    </nav>
  );
};
