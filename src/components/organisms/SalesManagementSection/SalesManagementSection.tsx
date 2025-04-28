import * as React from 'react';
import { StatusTags } from '../../atoms/StatusTags/StatusTags';

const SalesManagementSection: React.FC = () => {
    const sales = [
        { id: 1, date: '2023-01-01', product: 'Producto A', amount: '$100', status: 'Completed' },
        { id: 2, date: '2023-02-15', product: 'Producto B', amount: '$200', status: 'Pending' },
        { id: 3, date: '2023-03-10', product: 'Producto C', amount: '$150', status: 'Cancelled' },
    ];

    const statistics = {
        totalSales: 450,
        totalRevenue: '$450',
        topProduct: 'Producto B',
    };

    return (
        <div className='flex justify-center'>
            <div className='w-[928px] h-auto mt-24 bg-white rounded-md shadow-md p-6'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>Gestión de Ventas</h1>
                
                {/* Statistics Section */}
                <div className="font-space text-gray-600 mb-6">
                    <h2 className="font-bold mb-2">Estadísticas</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div>Total Ventas: {statistics.totalSales}</div>
                        <div>Ingresos Totales: {statistics.totalRevenue}</div>
                        <div>Producto Más Vendido: {statistics.topProduct}</div>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="font-space text-gray-600 mb-6">
                    <h2 className="font-bold mb-2">Filtros</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <input type="date" className="border rounded-md p-2" placeholder="Fecha" />
                        <input type="text" className="border rounded-md p-2" placeholder="Producto" />
                        <input type="text" className="border rounded-md p-2" placeholder="Monto" />
                    </div>
                </div>

                {/* Sales Table */}
                <div className="font-space text-gray-600">
                    <div className="grid grid-cols-5 gap-4 font-bold mb-4">
                        <div>Fecha</div>
                        <div>Producto</div>
                        <div>Monto</div>
                        <div>Estado</div>
                        <div>Acciones</div>
                    </div>
                    {sales.map(sale => (
                        <div key={sale.id} className="grid grid-cols-5 gap-4 items-center mb-2">
                            <div>{sale.date}</div>
                            <div>{sale.product}</div>
                            <div>{sale.amount}</div>
                            <div>
                                <StatusTags 
                                    status={
                                        sale.status === 'Completed' ? 'Active' : 
                                        sale.status === 'Pending' ? 'Pending' : 
                                        'Inactive'
                                    } 
                                    text={sale.status} 
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="text-blue-500 hover:underline">PDF</button>
                                <button className="text-blue-500 hover:underline">CSV</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesManagementSection;
