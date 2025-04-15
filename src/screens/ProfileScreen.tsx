import React from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { CenteredBox } from '../components/templates/CenteredBox/CenteredBox';
import { FaStore, FaShoppingBasket, FaPaintBrush, FaMoneyBill, FaTruck, FaChevronRight } from 'react-icons/fa';
const ProfileScreen = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1">
               
                <CenteredBox
                    width="50%"
                    height="520px"
                    className="mr-60 items-start justify-center"
                >
                   
                    <div className="w-full">
                   
                        <div className="mb-6 text-left">
                            <h2 className="text-xl font-bold mb-1">Pasos para dejar lista tu tienda</h2>
                            <p className="text-sm text-gray-600">Te dejamos una guía para que empieces a poner en orden tu tienda.</p>
                        </div>
                        
                        {[
                            { 
                                icon: <FaStore />, 
                                text: 'Creaste tu tienda',
                                description: 'Tu tienda ya está lista para ser personalizada'
                            },
                            { 
                                icon: <FaShoppingBasket />, 
                                text: 'Agregá productos',
                                description: 'Añade productos para comenzar a vender' 
                            },
                            { 
                                icon: <FaPaintBrush />, 
                                text: 'Personalizá tu tienda',
                                description: 'Dale tu estilo único para destacarte' 
                            },
                            { 
                                icon: <FaMoneyBill />, 
                                text: 'Elegí los métodos de pago',
                                description: 'Configura cómo quieres recibir tus pagos' 
                            },
                            { 
                                icon: <FaTruck />, 
                                text: 'Configurá los métodos de envío',
                                description: 'Define cómo llegarán los productos a tus clientes' 
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start bg-[#fafafa] p-3 mb-2 rounded"
                            >
                                <div className="mr-3 pt-1">{item.icon}</div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-medium">{item.text}</span>
                                    <span className="text-xs text-gray-500 mt-1">{item.description}</span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <FaChevronRight className="text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CenteredBox>
            </div>
        </div>
    );
};

export default ProfileScreen;
