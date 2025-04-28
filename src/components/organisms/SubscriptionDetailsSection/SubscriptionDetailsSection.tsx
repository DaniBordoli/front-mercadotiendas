import * as React from 'react';
import {DesignButton} from '../../atoms/DesignButton';

const SubscriptionDetailsSection: React.FC = () => {
    const subscription = {
        type: 'Premium',
        benefits: ['Envío gratis', 'Acceso exclusivo a ofertas', 'Atención prioritaria'],
        renewalDate: '2023-12-01',
        paymentMethod: 'Visa **** 1234',
    };

    return (
        <div className='flex justify-center'>
            <div className='w-[928px] h-auto mt-24 bg-white rounded-md shadow-md p-6'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>Detalles de Suscripción</h1>
                <div className="font-space text-gray-600 mb-4">
                    <div className="mb-2">
                        <span className="font-bold">Tipo de Suscripción:</span> {subscription.type}
                    </div>
                    <div className="mb-2">
                        <span className="font-bold">Próxima Renovación:</span> {subscription.renewalDate}
                    </div>
                    <div className="mb-4">
                        <span className="font-bold">Método de Pago:</span> {subscription.paymentMethod}
                    </div>
                </div>
                <div className="font-space text-gray-600 mb-6">
                    <h2 className="font-bold mb-2">Beneficios:</h2>
                    <ul className="list-disc list-inside">
                        {subscription.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex gap-4">
                    <DesignButton 
                        variant="primary" 
                        fullWidth={false} 
                        onClick={() => console.log('Cambiar Plan')}
                    >
                        Cambiar Plan
                    </DesignButton>
                    <DesignButton 
                        variant="neutral" 
                        fullWidth={false} 
                        onClick={() => console.log('Gestionar Método de Pago')}
                    >
                        Gestionar Método de Pago
                    </DesignButton>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionDetailsSection;
