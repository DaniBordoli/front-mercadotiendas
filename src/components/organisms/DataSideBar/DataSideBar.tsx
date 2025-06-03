import * as React from 'react';
import { Logo } from '../../atoms/Logo/Logo';
import { FaUser, FaTachometerAlt, FaShoppingCart, FaCreditCard, FaShoppingBag, FaBox } from 'react-icons/fa';
import { GoGraph } from 'react-icons/go';
import { IoDocumentText, IoChevronDown, IoToggleSharp } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../design/colors';
import { motion } from 'framer-motion';
import { FaGear, FaScrewdriverWrench, FaCircleInfo } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";

import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from '../../../stores';

const DataSideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuthStore();
 
    const [shopDropdownOpen, setShopDropdownOpen] = React.useState(false);

  
    const hasShop = !!user?.shop;

   
    const menuOptions = [
        { key: 'home', label: 'Dashboard', icon: <FaTachometerAlt className="text-lg" />, path: '/data-dashboard' },
        { key: 'profile', label: 'Datos Personales', icon: <FaUser className="text-lg" />, path: '/data-profile' },
        { key: 'buy', label: 'Compras', icon: <FaShoppingCart className="text-lg" />, path: '/data-purchase-history' },
     
        ...(hasShop ? [
            { key: 'products', label: 'Mis productos', icon: <FaBox className="text-lg" />, path: '/data-products', match: (pathname: string) => pathname.startsWith('/data-products') || pathname.startsWith('/edit-products') }
        ] : []),
        { key: 'subscription', label: 'Suscripción', icon: <FaCreditCard className="text-lg" />, path: '/data-subscription' },
        { key: 'billing', label: 'Facturación', icon: <IoDocumentText className="text-lg" />, path: '/data-billing' },
        { key: 'sellManagement', label: 'Gestión de Ventas', icon: <GoGraph className="text-lg" />, path: '/data-sales-management' },
    ];


   
    const shopOptions = [
    
        ...(hasShop ? [
            { key: 'shopState', label: 'Estado de la Tienda', icon: <IoToggleSharp className="text-lg" />, path: '/data-shop-state' },
            { key: 'shopConfig', label: 'Configuración de Tienda', icon: <FaGear className="text-lg" />, path: '/data-shop-config' },
            { key: 'domainConfig', label: 'Configuración de Dominio', icon: <FaScrewdriverWrench className="text-lg" />, path: '/domain-config' },
            { key: 'seo', label: 'SEO y Metadata', icon: <AiFillDatabase className="text-lg" />, path: '/seo-metadata' },
            { key: 'general', label: 'Información general', icon: <FaCircleInfo className="text-lg" />, path: '/settings' }
        ] : []),
     
        ...(!hasShop ? [
            { key: 'createShop', label: 'Crear Tienda', icon: <FaShoppingBag className="text-lg" />, path: '/data-create-shop' }
        ] : [])
    ];


    const isShopActive = shopOptions.some(opt => location.pathname === opt.path);

 
    const isDropdownOpen = shopDropdownOpen || isShopActive;

    return (
        <div className='h-screen w-[250px] bg-white shadow-md flex flex-col fixed'>
            <div 
                className='p-4 flex items-center gap-2 cursor-pointer' 
                onClick={() => navigate('/dashboard')}
            >
                <Logo size={40} />
                <h2 className='text-xl font-space'>Mercado Tiendas</h2>
            </div>
           
            <div className='flex flex-col mt-4 relative'>
                {menuOptions.map((option) => {
                   
                    const isActive = option.match
                        ? option.match(location.pathname)
                        : location.pathname === option.path;
                    return (
                        <div key={option.key} className="relative">
                            {isActive && (
                                <motion.div
                                    className="absolute inset-0"
                                    style={{ backgroundColor: `${colors.primaryRed}1A` }}
                                    layoutId="activeBackground"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.1 }}
                                />
                            )}
                            <button
                                className={`relative flex items-center gap-3 p-3 ${
                                    isActive ? 'text-[${colors.primaryRed}]' : ''
                                }`}
                                style={isActive ? { color: colors.primaryRed } : {}}
                                onClick={() => navigate(option.path)}
                            >
                                {option.icon}
                                <span className='font-space'>{option.label}</span>
                            </button>
                        </div>
                    );
                })}

                {shopOptions.length > 0 && (
                    <div className="relative">
                        <button
                            className={`relative flex items-center gap-3 p-3 w-full justify-between ${isShopActive ? 'font-bold' : ''}`}
                            style={isShopActive ? { color: colors.primaryRed } : {}}
                            onClick={() => setShopDropdownOpen((prev) => !prev)}
                            type="button"
                        >
                            {isShopActive && (
                                <motion.div
                                    className="absolute inset-0 z-0"
                                    style={{ backgroundColor: `${colors.primaryRed}1A` }}
                                    layoutId="activeBackground"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.1 }}
                                />
                            )}
                            <span className="flex items-center gap-3 z-10">
                                <FaShoppingBag className="text-lg" />
                                <span className='font-space'>Mi Tienda</span>
                            </span>
                            <IoChevronDown className={`transition-transform z-10 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isDropdownOpen && (
                            <div className="ml-8 flex flex-col">
                                {shopOptions.map(option => (
                                    <button
                                        key={option.key}
                                        className={`flex items-center gap-2 p-2 text-left rounded transition-colors ${
                                            location.pathname === option.path ? 'font-bold' : ''
                                        }`}
                                        style={location.pathname === option.path ? { color: colors.primaryRed } : {}}
                                        onClick={() => {
                                            navigate(option.path);
                                            if (shopDropdownOpen) setShopDropdownOpen(false);
                                        }}
                                    >
                                        {option.icon}
                                        <span className='font-space'>{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <div className="relative mt-2">
                    <button
                        className="relative flex items-center gap-3 p-3 w-full text-left hover:text-red-600 transition-colors"
          
                        type="button"
                    >
                        <FiLogOut className="text-lg" />
                        <span className='font-space'>Cerrar sesión</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataSideBar;
