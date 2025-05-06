import * as React from 'react';
import { Logo } from '../../atoms/Logo/Logo';
import { FaUser, FaTachometerAlt, FaShoppingCart, FaCreditCard, FaShoppingBag } from 'react-icons/fa';
import { GoGraph } from 'react-icons/go';
import { IoDocumentText } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../design/colors';
import { motion } from 'framer-motion';

const DataSideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuOptions = [
        { key: 'home', label: 'Dashboard', icon: <FaTachometerAlt className="text-lg" />, path: '/data-dashboard' },
        { key: 'profile', label: 'Datos Personales', icon: <FaUser className="text-lg" />, path: '/data-profile' },
        { key: 'buy', label: 'Compras', icon: <FaShoppingCart className="text-lg" />, path: '/data-purchase-history' },
        { key: 'subscription', label: 'Suscripción', icon: <FaCreditCard className="text-lg" />, path: '/data-subscription' },
        { key: 'billing', label: 'Facturación', icon: <IoDocumentText className="text-lg" />, path: '/data-billing' },
        { key: 'sellManagement', label: 'Gestión de Ventas', icon: <GoGraph className="text-lg" />, path: '/data-sales-management' },
        { key: 'shopState', label: 'Mi Tienda', icon: <FaShoppingBag className="text-lg" />, path: '/data-shop-state' },
        { key: 'createShop', label: 'Crear Tienda', icon: <FaShoppingBag className="text-lg" />, path: '/data-create-shop' },
        { key: 'shopConfig', label: 'Configuración de Tienda', icon: <FaShoppingBag className="text-lg" />, path: '/data-shop-config' },
    ];

    return (
        <div className='h-screen w-[250px] bg-white shadow-md flex flex-col fixed'>
            <div className='p-4 flex items-center gap-2'>
                <Logo size={40} />
                <h2 className='text-xl font-space'>Mercado Tiendas</h2>
            </div>
            <hr className='border-gray-300' />
            <div className='flex flex-col mt-4 relative'>
                {menuOptions.map((option) => (
                    <div key={option.key} className="relative">
                        {location.pathname === option.path && (
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
                                location.pathname === option.path ? 'text-[${colors.primaryRed}]' : ''
                            }`}
                            style={location.pathname === option.path ? { color: colors.primaryRed } : {}}
                            onClick={() => navigate(option.path)}
                        >
                            {option.icon}
                            <span className='font-space'>{option.label}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataSideBar;
