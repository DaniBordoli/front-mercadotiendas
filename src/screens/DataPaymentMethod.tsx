import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { colors } from '../design/colors';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaQuestionCircle } from 'react-icons/fa';

// Hook para detectar mobile
function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = React.useState(false);
    React.useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= breakpoint);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);
    return isMobile;
}

interface PaymentMethodCard {
    id: string;
    name: string;
    image: string;
    commission: string;
    accreditation: string;
    isActive: boolean;
    isRecommended?: boolean;
}

const DataPaymentMethod: React.FC = () => {
    const isMobile = useIsMobile();

    const paymentMethods: PaymentMethodCard[] = [

        {
            id: 'mobbex',
            name: 'Mobbex',
            image: '/payment/mobbex.png',
            commission: 'Variable',
            accreditation: 'Variable',
            isActive: false
        },
        {
            id: 'cash',
            name: 'Efectivo',
            image: '/payment/cash.png',
            commission: '0%',
            accreditation: 'Manual',
            isActive: true
        },
        {
            id: 'transfer',
            name: 'Depósito/Transferencia',
            image: '/payment/bank.png',
            commission: '0%',
            accreditation: 'Manual',
            isActive: false
        },
        {
            id: 'agreement',
            name: 'Acordar',
            image: '/payment/handshake.png',
            commission: 'A convenir',
            accreditation: 'A convenir',
            isActive: true
        }
    ];

    const handleToggleMethod = (methodId: string) => {
        // Aquí implementarías la lógica para activar/desactivar métodos de pago
        console.log(`Toggle payment method: ${methodId}`);
    };

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space mb-6">
                    Métodos de Pago
                </h1>
                
                <p className="text-gray-600 mb-8 font-space">
                    Configura los métodos de pago disponibles para tu tienda. Activa o desactiva según tus necesidades.
                </p>

                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className="bg-white rounded-lg border p-6 relative hover:shadow-md transition-shadow"
                            style={{ borderColor: colors.lightGray }}
                        >
                            {/* Badge de recomendado */}
                            {method.isRecommended && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-space">
                                    Recomendado
                                </div>
                            )}

                            {/* Imagen del método de pago */}
                            <div className="flex flex-col items-center mb-4">
                                <h3 className="text-lg font-space font-medium text-gray-800 mb-3">
                                    {method.name}
                                </h3>
                                <img 
                                    src={method.image} 
                                    alt={method.name}
                                    className="h-16 w-auto object-contain rounded"
                                />
                            </div>

                            {/* Información */}
                            <div className="space-y-3 mb-6">
                                {/* Comisión */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-space text-gray-700">Comisión</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-space font-medium">{method.commission}</span>
                                        <FaQuestionCircle 
                                            className="text-gray-400 text-xs cursor-help" 
                                            title="Información sobre la comisión"
                                        />
                                    </div>
                                </div>

                                {/* Acreditación */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-space text-gray-700">Acreditación</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-space font-medium">{method.accreditation}</span>
                                        <FaQuestionCircle 
                                            className="text-gray-400 text-xs cursor-help" 
                                            title="Información sobre la acreditación"
                                        />
                                    </div>
                                </div>

                                {/* Estado */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-space text-gray-700">Estado</span>
                                    <span className={`text-sm font-space font-medium ${
                                        method.isActive ? 'text-green-600' : 'text-gray-500'
                                    }`}>
                                        {method.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            {/* Botón */}
                            <DesignButton
                                variant={method.isActive ? "neutral" : "primary"}
                                fullWidth
                                onClick={() => handleToggleMethod(method.id)}
                            >
                                {method.isActive ? 'Desactivar' : 'Activar'}
                            </DesignButton>
                        </div>
                    ))}
                </div>

                {/* Información adicional */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <FaQuestionCircle className="text-blue-500 mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-space font-medium text-blue-900 mb-2">
                                Información importante
                            </h3>
                            <p className="text-sm text-blue-800 font-space">
                                Los métodos de pago activos aparecerán disponibles para tus clientes al momento de realizar una compra. 
                                Puedes activar múltiples métodos de pago para ofrecer más opciones a tus clientes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPaymentMethod;
