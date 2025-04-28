import * as React from 'react';

const PurchaseHistorySection: React.FC = () => {
    const purchases = [
        { id: 1, item: 'Producto A', date: '2023-01-01', amount: '$100' },
        { id: 2, item: 'Producto B', date: '2023-02-15', amount: '$200' },
        { id: 3, item: 'Producto C', date: '2023-03-10', amount: '$150' },
    ];

    return (
        <div className='flex justify-center'>
            <div className='w-[928px] h-auto mt-24 bg-white rounded-md shadow-md p-6'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>Historial de Compras</h1>
                <div className="grid grid-cols-3 gap-4 font-space text-gray-600">
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
            </div>
        </div>
    );
};

export default PurchaseHistorySection;
