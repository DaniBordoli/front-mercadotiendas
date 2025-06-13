import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { motion } from 'framer-motion';
import { FaStore, FaCheckCircle, FaShoppingCart, FaBell } from 'react-icons/fa';
import { colors } from '../design/colors';

const DataShopState: React.FC = () => {
    const [isActive, setIsActive] = React.useState(true);

    return (
        <div className="min-h-screen bg-[#F8F8F8] flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-10 md:ml-[250px] gap-6">
                
                <div>
                    <h1 className="text-2xl font-space font-medium text-gray-800">Estado de la Tienda</h1>
                    <p className="text-sm font-space text-gray-500">Administra la visibilidad de tu tienda para los compradores</p>
                </div>

             
                <div
                    className="p-6 bg-white rounded-md flex items-center justify-between border"
                    style={{ borderColor: colors.lightGray }}
                >
                    <div className="flex items-center">
                        <div
                            className="w-12 h-12 rounded-md flex items-center justify-center mr-4"
                            style={{ backgroundColor: `${colors.accentTeal}1A` }}
                        >
                            <FaStore style={{ color: colors.accentTeal }} />
                        </div>
                        <div>
                            <p className="text-lg font-space font-medium text-gray-600">Tu tienda está activa</p>
                            <p className="text-sm font-space text-gray-500">Los compradores pueden ver y comprar tus productos</p>
                        </div>
                    </div>
                    <motion.div
                        className="w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer"
                        onClick={() => setIsActive(!isActive)}
                        style={{
                            backgroundColor: isActive ? colors.accentTeal : colors.lightGray,
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
                    style={{ borderColor: colors.lightGray }}
                >
                    {[
                        { icon: <FaCheckCircle />, text: "Tienda Visible", subtext: "Tu tienda aparece en los resultados de búsqueda" },
                        { icon: <FaShoppingCart />, text: "Compras Habilitadas", subtext: "Los clientes pueden realizar pedidos normalmente" },
                        { icon: <FaBell />, text: "Notificaciones Activas", subtext: "Recibirás alertas de nuevos pedidos y mensajes" },
                    ].map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex items-center py-4">
                                <div
                                    className="w-12 h-12 rounded-md flex items-center justify-center mr-4"
                                  
                                >
                                    <div style={{ color: colors.accentTeal }}>{item.icon}</div>
                                </div>
                                <div>
                                    <p className="text-lg font-space font-medium text-gray-600">{item.text}</p>
                                    <p className="text-sm font-space text-gray-500">{item.subtext}</p>
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
