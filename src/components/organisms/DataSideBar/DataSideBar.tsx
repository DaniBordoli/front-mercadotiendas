import * as React from 'react';
import { Logo } from '../../atoms/Logo/Logo';
import { FaUser, FaTachometerAlt, FaShoppingCart, FaCreditCard, FaShoppingBag, FaBox } from 'react-icons/fa';
import { GoGraph } from 'react-icons/go';
import { IoDocumentText, IoChevronDown, IoToggleSharp } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../design/colors';
import { motion } from 'framer-motion';
import { FaGear, FaScrewdriverWrench, FaCircleInfo, FaBoxArchive  } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { RiRobot2Line } from "react-icons/ri";

import { FiLogOut } from "react-icons/fi";
import { useAuthStore } from '../../../stores';
import { FaBars } from 'react-icons/fa';

const DataSideBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuthStore();
    const hasShop = !!(user && user.shop && user.shop._id);
    
    // Agregar console.log para inspeccionar el objeto user completo
    console.log('User object in DataSideBar:', user);
 
    const [shopDropdownOpen, setShopDropdownOpen] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    React.useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) setSidebarOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/dashboard');
    };

    const isAdmin = user?.role === 'admin';

    const menuOptions = [
        { key: 'home', label: 'Dashboard', icon: <FaTachometerAlt className="text-lg" />, path: '/data-dashboard' },
        { key: 'profile', label: 'Datos Personales', icon: <FaUser className="text-lg" />, path: '/data-profile' },
        ...(isAdmin ? [
            { key: 'catalog', label: 'Catálogo', icon: <FaBoxArchive className="text-lg" />, path: '/data-catalog' }
        ] : []),
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
            { key: 'editShop', label: 'Editar Tienda', icon: <RiRobot2Line className="text-lg" />, path: '/layout-select' },
            { key: 'shopState', label: 'Estado de la Tienda', icon: <IoToggleSharp className="text-lg" />, path: '/data-shop-state' },
            { key: 'shopConfig', label: 'Configuración de Tienda', icon: <FaGear className="text-lg" />, path: '/data-shop-config' },
            { key: 'layout', label: 'Layouts', icon: <FaCircleInfo className="text-lg" />, path: '/layout-select' },
        
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
        <>
            <button
                className="fixed z-50 bottom-6 left-6 md:hidden bg-white shadow-lg rounded-full p-3 border border-gray-200"
                style={{ display: sidebarOpen ? 'none' : 'block' }}
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menú"
            >
                <FaBars className="text-2xl text-gray-700" />
            </button>
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <div
                className={`
                    h-screen w-[250px] bg-white shadow-md flex flex-col fixed z-50
                    transition-transform duration-200
                    md:translate-x-0
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:left-0 left-0 top-0
                    md:block
                `}
                style={{
                    display: sidebarOpen ? 'flex' : undefined,
                }}
            >
                <div 
                    className='p-4 flex items-center gap-2 cursor-pointer' 
                    onClick={() => {
                        navigate('/dashboard');
                        setSidebarOpen(false);
                    }}
                >
                    <Logo size={40} />
                    <h2 className='text-xl font-space'>Mercado Tiendas</h2>
                </div>
                <button
                    className="absolute top-4 right-4 md:hidden text-gray-500"
                    style={{ display: sidebarOpen ? 'block' : 'none' }}
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Cerrar menú"
                >
                    ×
                </button>
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
                            onClick={handleLogout}
                        >
                            <FiLogOut className="text-lg" />
                            <span className='font-space'>Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DataSideBar;
