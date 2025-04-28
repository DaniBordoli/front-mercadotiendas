import * as React from 'react';
import { StatusTags } from '../../atoms/StatusTags/StatusTags';

const BillingDetailsSection: React.FC = () => {
    const invoices = [
        { id: 1, date: '2023-01-01', number: 'INV-001', amount: '$100', paymentMethod: 'Visa **** 1234', status: 'Paid' },
        { id: 2, date: '2023-02-15', number: 'INV-002', amount: '$200', paymentMethod: 'Mastercard **** 5678', status: 'Pending' },
        { id: 3, date: '2023-03-10', number: 'INV-003', amount: '$150', paymentMethod: 'PayPal', status: 'Overdue' },
    ];

    return (
        <div className='flex justify-center'>
            <div className='w-[928px] h-auto mt-24 bg-white rounded-md shadow-md p-6'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>Detalles de Facturación</h1>
                <div className="font-space text-gray-600">
                    <div className="grid grid-cols-6 gap-4 font-bold mb-4">
                        <div>Fecha</div>
                        <div>Número</div>
                        <div>Importe</div>
                        <div>Método de Pago</div>
                        <div>Estado</div>
                        <div>Acciones</div>
                    </div>
                    {invoices.map(invoice => (
                        <div key={invoice.id} className="grid grid-cols-6 gap-4 items-center mb-2">
                            <div>{invoice.date}</div>
                            <div>{invoice.number}</div>
                            <div>{invoice.amount}</div>
                            <div>{invoice.paymentMethod}</div>
                            <div>
                                <StatusTags 
                                    status={
                                        invoice.status === 'Paid' ? 'Active' : 
                                        invoice.status === 'Pending' ? 'Pending' : 
                                        'Inactive'
                                    } 
                                    text={invoice.status} 
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

export default BillingDetailsSection;
