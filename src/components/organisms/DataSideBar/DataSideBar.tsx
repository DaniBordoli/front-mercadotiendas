import * as React from 'react';
import { Logo } from '../../atoms/Logo/Logo';
import { FaUser, FaTachometerAlt, FaShoppingCart, FaCreditCard, FaShoppingBag, FaBox, FaChartLine } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa6';
import { GoGraph } from 'react-icons/go';
import { IoDocumentText, IoChevronDown, IoToggleSharp } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';
import { colors } from '../../../design/colors';
import { motion } from 'framer-motion';
import { FaGear, FaScrewdriverWrench, FaCircleInfo, FaBoxArchive } from "react-icons/fa6";
import { AiFillDatabase } from "react-icons/ai";
import { RiRobot2Line, RiAdminLine } from "react-icons/ri";

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
    const [adminDropdownOpen, setAdminDropdownOpen] = React.useState(false);
    const [salesDropdownOpen, setSalesDropdownOpen] = React.useState(false);
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
        // Mi Tienda irá como dropdown, así que aquí solo se deja el espacio
        // Mis productos
        ...(hasShop ? [
            { key: 'products', label: 'Mis productos', icon: <FaBox className="text-lg" />, path: '/data-products', match: (pathname: string) => pathname.startsWith('/data-products') || pathname.startsWith('/edit-products') }
        ] : []),
        // Compras
        { key: 'buy', label: 'Compras', icon: <FaShoppingCart className="text-lg" />, path: '/data-purchase-history' },
        // Suscripción
        { key: 'subscription', label: 'Suscripción', icon: <FaCreditCard className="text-lg" />, path: '/data-subscription' },
    ];

    const shopOptions = [
    
        ...(hasShop ? [
            { key: 'general', label: 'Información general', icon: <FaCircleInfo className="text-lg" />, path: '/settings' },
            { key: 'editShop', label: 'Editar Tienda con IA', icon: <RiRobot2Line className="text-lg" />, path: '/first-layout' },
            { key: 'shopState', label: 'Estado de la Tienda', icon: <IoToggleSharp className="text-lg" />, path: '/data-shop-state' },
            { key: 'shopConfig', label: 'Configuración de Tienda', icon: <FaGear className="text-lg" />, path: '/data-shop-config' },
            { key: 'layout', label: 'Layouts', icon: <FaCircleInfo className="text-lg" />, path: '/layout-select' },
        
            { key: 'seo', label: 'SEO y Metadata', icon: <AiFillDatabase className="text-lg" />, path: '/seo-metadata' },
        ] : []),
     
        ...(!hasShop ? [
            { key: 'createShop', label: 'Crear Tienda', icon: <FaShoppingBag className="text-lg" />, path: '/data-create-shop' }
        ] : [])
    ];

    const salesOptions = [
        { key: 'sellManagement', label: 'Gestión de Ventas', icon: <GoGraph className="text-lg" />, path: '/data-sales-management' },
        { key: 'billing', label: 'Facturación', icon: <IoDocumentText className="text-lg" />, path: '/data-billing' },
        { key: 'paymentMethod', label: 'Método de pago', icon: <FaCreditCard className="text-lg" />, path: '/data-payment-method' },
    ];

    const adminOptions = [
        { key: 'category', label: 'Categorías', icon: <FaBoxArchive className="text-lg" />, path: '/data-category' },
        { key: 'currency', label: 'Monedas', icon: <FaCoins className="text-lg" />, path: '/data-currency' }
    ];

    const isShopActive = shopOptions.some(opt => location.pathname === opt.path);
    const isAdminActive = adminOptions.some(opt => location.pathname === opt.path);
    const isSalesActive = salesOptions.some(opt => location.pathname === opt.path);

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
                    {/* Dashboard, Datos Personales */}
                    {menuOptions.slice(0, 2).map((option) => {
                   
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

                    {/* Mi Tienda dropdown */}
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

                    {/* Ventas dropdown */}
                    {salesOptions.length > 0 && (
                        <div className="relative">
                            <button
                                className={`relative flex items-center gap-3 p-3 w-full justify-between ${isSalesActive ? 'font-bold' : ''}`}
                                style={isSalesActive ? { color: colors.primaryRed } : {}}
                                onClick={() => setSalesDropdownOpen((prev) => !prev)}
                                type="button"
                            >
                                {isSalesActive && (
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
                                    <FaChartLine className="text-lg" />
                                    <span className='font-space'>Ventas</span>
                                </span>
                                <IoChevronDown className={`transition-transform z-10 ${(salesDropdownOpen || isSalesActive) ? 'rotate-180' : ''}`} />
                            </button>
                            {(salesDropdownOpen || isSalesActive) && (
                                <div className="ml-8 flex flex-col">
                                    {salesOptions.map(option => (
                                        <button
                                            key={option.key}
                                            className={`flex items-center gap-2 p-2 text-left rounded transition-colors ${
                                                location.pathname === option.path ? 'font-bold' : ''
                                            }`}
                                            style={location.pathname === option.path ? { color: colors.primaryRed } : {}}
                                            onClick={() => {
                                                navigate(option.path);
                                                if (salesDropdownOpen) setSalesDropdownOpen(false);
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

                    {/* Panel de administración dropdown - Solo para administradores */}
                    {isAdmin && adminOptions.length > 0 && (
                        <div className="relative">
                            <button
                                className={`relative flex items-center gap-3 p-3 w-full justify-between ${isAdminActive ? 'font-bold' : ''}`}
                                style={isAdminActive ? { color: colors.primaryRed } : {}}
                                onClick={() => setAdminDropdownOpen((prev) => !prev)}
                                type="button"
                            >
                                {isAdminActive && (
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
                                    <RiAdminLine className="text-lg" />
                                    <span className='font-space'>Panel de administración</span>
                                </span>
                                <IoChevronDown className={`transition-transform z-10 ${(adminDropdownOpen || isAdminActive) ? 'rotate-180' : ''}`} />
                            </button>
                            {(adminDropdownOpen || isAdminActive) && (
                                <div className="ml-8 flex flex-col">
                                    {adminOptions.map(option => (
                                        <button
                                            key={option.key}
                                            className={`flex items-center gap-2 p-2 text-left rounded transition-colors ${
                                                location.pathname === option.path ? 'font-bold' : ''
                                            }`}
                                            style={location.pathname === option.path ? { color: colors.primaryRed } : {}}
                                            onClick={() => {
                                                navigate(option.path);
                                                if (adminDropdownOpen) setAdminDropdownOpen(false);
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

                    {/* Mis productos, Compras, resto */}
                    {menuOptions.slice(2).map((option) => {
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
