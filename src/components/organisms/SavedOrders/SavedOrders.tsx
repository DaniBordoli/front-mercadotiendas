import * as React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';

const SavedOrders: React.FC = () => {
    return (
        <div className='flex justify-center'>
            <div className='w-full max-w-[928px] mt-8 bg-white rounded-md shadow-md p-6' style={{ minHeight: '400px' }}>
                <div className="flex justify-between items-center mb-8">
                    <h1 
                        style={{color: colors.darkGray}}
                        className='text-xl font-space'
                    >
                        Pedidos Guardados
                    </h1>
                    <span 
                        style={{color: colors.primaryRed}}
                        className='text-sm font-space cursor-pointer'
                    >
                        Ver Todos
                    </span>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between w-full">
                    
                    <div className="w-full md:w-[430px] p-3 border rounded" style={{ borderColor: colors.lightGray }}>
                        <div className="flex flex-col">
                            <img 
                                src="https://placehold.co/420x200" 
                                alt="Producto" 
                                className="w-full h-auto object-cover rounded mb-2"
                            />
                            <div className="mt-2">
                                <h3 className="font-space text-gray-800 font-medium">Auriculares Bluetooth Sony</h3>
                                <p className="text-gray-500 font-space text-sm mb-3">Electrónicos</p>
                                
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-space text-gray-800 font-medium">$299.99</span>
                                    <DesignButton variant="primary">
                                        Agregar al Carrito
                                    </DesignButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="w-full md:w-[430px] p-3 border rounded" style={{ borderColor: colors.lightGray }}>
                        <div className="flex flex-col">
                            <img 
                                src="https://placehold.co/420x200" 
                                alt="Producto" 
                                className="w-full h-auto object-cover rounded mb-2"
                            />
                            <div className="mt-2">
                                <h3 className="font-space text-gray-800 font-medium">Smartwatch Samsung Galaxy</h3>
                                <p className="text-gray-500 font-space text-sm mb-3">Electrónicos</p>
                                
                                <div className="flex justify-between items-center mt-2">
                                    <span className="font-space text-gray-800 font-medium">$199.99</span>
                                    <DesignButton variant="primary">
                                        Agregar al Carrito
                                    </DesignButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SavedOrders;