import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { motion } from 'framer-motion';
import { FaStore, FaCheckCircle, FaShoppingCart, FaBell } from 'react-icons/fa';
import { colors } from '../design/colors';
import { useShopStore } from '../stores/slices/shopStore';
import { useAuthStore } from '../stores';
import FullScreenLoader from '../components/molecules/FullScreenLoader';

const DataShopState: React.FC = () => {
    const { shop, loading, error, updateShopStatus, getShop } = useShopStore();
    const { user } = useAuthStore();
    const [isActive, setIsActive] = React.useState(true);

    // Cargar datos de la tienda al montar el componente
    React.useEffect(() => {
        if (user?.shop) {
            getShop().catch(console.error);
        }
    }, [user?.shop, getShop]);

    // Sincronizar el estado local con el estado de la tienda
    React.useEffect(() => {
        if (shop && typeof shop.active === 'boolean') {
            setIsActive(shop.active);
        }
    }, [shop]);

    // Función para manejar el cambio de estado
    const handleToggleStatus = async () => {
        if (!shop) return;
        
        try {
            const newStatus = !isActive;
            await updateShopStatus(shop._id, newStatus);
            setIsActive(newStatus);
        } catch (error) {
            console.error('Error al cambiar el estado de la tienda:', error);
            // Aquí podrías mostrar un toast de error
        }
    };

    const gray800 = '#1F2937';
    const gray600 = '#4B5563';
    const gray500 = '#6B7280'; 


    const shopStateItems = isActive
        ? [
            { icon: <FaCheckCircle />, text: 'Tienda Visible', subtext: 'Tu tienda aparece en los resultados de búsqueda' },
            { icon: <FaShoppingCart />, text: 'Compras Habilitadas', subtext: 'Los clientes pueden realizar pedidos normalmente' },
            { icon: <FaBell />, text: 'Notificaciones Activas', subtext: 'Recibirás alertas de nuevos pedidos y mensajes' },
        ]
        : [
            { icon: <FaCheckCircle />, text: 'Tienda Oculta', subtext: 'Tu tienda no aparece en los resultados de búsqueda' },
            { icon: <FaShoppingCart />, text: 'Compras Deshabilitadas', subtext: 'Los clientes no pueden realizar pedidos' },
            { icon: <FaBell />, text: 'Notificaciones Inactivas', subtext: 'No recibirás alertas de nuevos pedidos ni mensajes' },
        ];

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            {loading && <FullScreenLoader />}
            <div className="flex flex-col flex-grow p-10 md:ml-[250px] gap-6">
                <div>
                    <h1 className="text-2xl font-space font-medium" style={{ color: isActive ? gray800 : colors.primaryRed }}>
                        Estado de la Tienda
                    </h1>
                    <p className="text-sm font-space" style={{ color: isActive ? gray500 : colors.primaryRed }}>
                        {isActive ? 'Administra la visibilidad de tu tienda para los compradores' : 'Tu tienda no está visible para los compradores'}
                    </p>
                    {error && (
                        <p className="text-sm font-space text-red-500 mt-2">
                            Error: {error}
                        </p>
                    )}
                </div>
                <div
                    className="p-6 bg-white rounded-md flex items-center justify-between border"
                >
                    <div className="flex items-center">
                        <div
                            className="w-12 h-12 rounded-md flex items-center justify-center mr-4"
                            style={{ backgroundColor: isActive ? `${colors.accentTeal}1A` : `${colors.primaryRed}1A` }}
                        >
                            <FaStore style={{ color: isActive ? colors.accentTeal : colors.primaryRed }} />
                        </div>
                        <div>
                            <p className="text-lg font-space font-medium" style={{ color: isActive ? gray600 : colors.primaryRed }}>
                                {isActive ? 'Tu tienda está activa' : 'Tu tienda no está activa'}
                            </p>
                            <p className="text-sm font-space" style={{ color: isActive ? gray500 : colors.primaryRed }}>
                                {isActive ? 'Los compradores pueden ver y comprar tus productos' : 'Los compradores no pueden ver ni comprar tus productos'}
                            </p>
                        </div>
                    </div>
                    <motion.div
                        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={!loading ? handleToggleStatus : undefined}
                        style={{
                            backgroundColor: isActive ? colors.accentTeal : colors.primaryRed,
                        }}
                    >
                        <motion.div
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                            layout
                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                            style={{
                                marginLeft: isActive ? 'calc(100% - 1.5rem)' : '0',
                            }}
                        />
                    </motion.div>
                </div>
                <div
                    className="p-6 bg-white rounded-md border"
                >
                    {shopStateItems.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex items-center py-4">
                                <div
                                    className="w-12 h-12 rounded-md flex items-center justify-center mr-4"
                                    style={{ color: isActive ? colors.accentTeal : colors.primaryRed }}
                                >
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="text-lg font-space font-medium" style={{ color: isActive ? gray600 : colors.primaryRed }}>{item.text}</p>
                                    <p className="text-sm font-space" style={{ color: isActive ? gray500 : colors.primaryRed }}>{item.subtext}</p>
                                </div>
                            </div>
                            {index < 2 && <hr className="border-gray-300" />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DataShopState;
