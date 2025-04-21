import * as React from 'react';
import { colors } from '../../../design/colors';
import { StatusTags } from '../../atoms/StatusTags/StatusTags';

const RecentOrderSection: React.FC = () => {
    return (
        <div className='flex justify-center'>
            <div className='w-[928px] mt-8 bg-white rounded-md shadow-md p-6'>
                <div className="flex justify-between items-center mb-8">
                    <h1 
                        style={{color: colors.darkGray}}
                        className='text-xl font-space'
                    >
                        Pedidos Recientes
                    </h1>
                    <span 
                        style={{color: colors.primaryRed}}
                        className='text-sm font-medium font-space cursor-pointer'
                    >
                        Ver Todos
                    </span>
                </div>
                
                <div className="flex flex-col space-y-4 w-full">
                  
                    <div 
                        className="w-full items-center p-4 rounded border flex"
                        style={{ borderColor: colors.lightGray }}
                    >
                        <img 
                            src="https://placehold.co/80x80" 
                            alt="Producto" 
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                            <h3 className="font-space text-gray-800 font-medium">Auriculares Bluetooth Sony</h3>
                            <p className="text-gray-500 font-space text-sm">Pedido #MT789012</p>
                            <p className="font-space text-gray-800 font-medium mt-1">$299.99</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-500 mr-2 mt-2">$299.99</span>
                            <StatusTags status="Active" text="Entregado" />
                        </div>
                    </div>
                    
                    <div 
                        className="w-full items-center p-4 rounded border flex"
                        style={{ borderColor: colors.lightGray }}
                    >
                        <img 
                            src="https://placehold.co/80x80" 
                            alt="Producto" 
                            className="w-20 h-20 object-cover rounded"
                        />
                        <div className="ml-4 flex-1">
                            <h3 className="font-space text-gray-800 font-medium">Smartwatch Samsung Galaxy</h3>
                            <p className="text-gray-500 font-space text-sm">Pedido #MT345678</p>
                            <p className="font-space text-gray-800 font-medium mt-1">$299.99</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-500 mr-2 mt-2">$299.99</span>
                            <StatusTags status="Pending" text="En camino" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentOrderSection;