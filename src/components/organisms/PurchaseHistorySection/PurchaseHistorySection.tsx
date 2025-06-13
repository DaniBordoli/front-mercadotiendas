import * as React from 'react';

const PurchaseHistorySection: React.FC = () => {
    const purchases = [
        { id: 1, item: 'Producto A', date: '2023-01-01', amount: '$100' },
        { id: 2, item: 'Producto B', date: '2023-02-15', amount: '$200' },
        { id: 3, item: 'Producto C', date: '2023-03-10', amount: '$150' },
    ];

    return (
        <div className='flex justify-center'>
            <div className='bg-white rounded-md shadow-md p-4 md:p-6 md:w-[928px] md:mt-24 w-full mt-8'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>Historial de Compras</h1>
                {/* Desktop grid */}
                <div className="hidden md:grid grid-cols-3 gap-4 font-space text-gray-600">
                    <div className="font-bold">Producto</div>
                    <div className="font-bold">Fecha</div>
                    <div className="font-bold">Monto</div>
                    {purchases.map(purchase => (
                        <React.Fragment key={purchase.id}>
                            <div>{purchase.item}</div>
                            <div>{purchase.date}</div>
                            <div>{purchase.amount}</div>
                        </React.Fragment>
                    ))}
                </div>
                {/* Mobile stacked cards */}
                <div className="flex flex-col gap-4 md:hidden">
                    {purchases.map(purchase => (
                        <div key={purchase.id} className="border rounded-md p-4 flex flex-col bg-gray-50">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-gray-700">Producto</span>
                                <span className="text-gray-700">{purchase.item}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-gray-700">Fecha</span>
                                <span className="text-gray-700">{purchase.date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold text-gray-700">Monto</span>
                                <span className="text-gray-700">{purchase.amount}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PurchaseHistorySection;
