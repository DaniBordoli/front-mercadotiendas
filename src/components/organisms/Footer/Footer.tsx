import React from 'react';
import { FaHome, FaInfoCircle, FaArchive } from 'react-icons/fa';
import { CiCreditCard1 } from "react-icons/ci";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaCreditCard } from "react-icons/fa6";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white shadow-md py-6 flex justify-center items-center">
      <div className="flex mt-8 items-center space-x-24">
        <div className="flex flex-col items-center">
          <FaCreditCard  className="text-6xl text-sky-500" />
          <span className="text-xl text-gray-600 mt-3">Elegí como pagar</span>
          <span className="text-sm text-gray-400 w-80 text-center">Podés pagar con tarjeta, débito, efectivo o con Cuotas sin Tarjeta.</span>
        </div>
        <div className="h-16 border-l border-gray-300"></div>
        <div className="flex flex-col items-center">
          <FaArchive className="text-6xl text-sky-500" />
          <span className="text-xl text-gray-600 mt-3">Envío gratis desde $ 33.000</span>
          <span className="text-sm text-gray-400 w-80 text-center">Solo por estar registrado en Mercado Libre tenés envíos gratis en miles de productos. Es un beneficio de Mercado Puntos.</span>
        </div>
        <div className="h-16 border-l border-gray-300"></div>
        <div className="flex flex-col items-center">
          <IoShieldCheckmarkOutline className="text-6xl text-sky-500" />
          <span className="text-xl text-gray-600 mt-3">Seguridad de principio a fin</span>
          <span className="text-sm text-gray-400 w-80 text-center">¿No te gusta? ¡Devolvelo! En Mercado Libre, no hay nada que no puedas hacer, porque estás siempre protegido.</span>
        </div>
      </div>
    </footer>
  );
};
