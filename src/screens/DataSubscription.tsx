import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { colors } from '../design/colors';
import { MdDateRange } from "react-icons/md";
import { FaCreditCard } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";
import { FaPercent } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaTruck } from "react-icons/fa";
import { FaHeadset } from "react-icons/fa";

const DataSubscription: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space mb-6">Mi Suscripción</h1>
                
                <div className="flex flex-col gap-6">
                    
                    <div
                        className="p-6 bg-white rounded-md flex flex-col border"
                        style={{ borderColor: colors.lightGray }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-xl font-space font-medium">Plan Premium</h2>
                                <p className="text-sm">Tu plan incluye todos los beneficios premium</p>
                            </div>
                            <DesignButton variant="primary" onClick={() => alert('Botón clickeado')}>
                                Cambiar Plan
                            </DesignButton>
                        </div>
                        <div className="flex flex-col md:flex-row md:gap-10 md:justify-center gap-4 justify-center">
                            {[
                                { icon: <MdDateRange />, text: "Próxima Renovación", subtext: "30 Mayo, 2025" },
                                { icon: <FaCreditCard />, text: "Método de Pago", subtext: "Visa terminada en 4242" },
                                { icon: <FaDollarSign />, text: "Costo Mensual", subtext: "$49.99 USD/mes" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col p-4 bg-gray-100 rounded-md"
                                    style={{ width: '300px', height: '120px' }}
                                >
                                    <div className="flex items-center mb-2">
                                        <div
                                            className="w-12 h-12 rounded-md flex items-center justify-center mr-4"
                                            style={{ backgroundColor: `${colors.primaryRed}1A` }}
                                        >
                                            <div style={{ color: colors.primaryRed }}>
                                                {item.icon}
                                            </div>
                                        </div>
                                        <p className="text-sm font-space font-medium">{item.text}</p>
                                    </div>
                                    <p className="text-sm font-space text-gray-500 mt-2">{item.subtext}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                   
                    <div
                        className="p-6 bg-white rounded-md border"
                        style={{ borderColor: colors.lightGray }}
                    >
                        <h2 className="text-xl font-space font-medium text-gray-600 mb-4">Beneficios Incluidos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { icon: <FaPercent />, text: "Comisiones Reducidas", subtext: "Solo 3.5% por venta en lugar del 5% estándar" },
                                { icon: <GoGraph />, text: "Analytics Avanzados", subtext: "Reportes detallados y métricas en tiempo real" },
                                { icon: <FaTruck />, text: "Envíos Premium", subtext: "Descuentos especiales en envíos y logística" },
                                { icon: <FaHeadset />, text: "Soporte Prioritario", subtext: "Atención personalizada 24/7" },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-4 rounded-md"
                                    
                                >
                                    <div
                                        className="w-12 h-12 rounded-md flex items-center justify-center mr-4"
                                        style={{ backgroundColor: `${colors.accentTeal}1A` }}
                                    >
                                        <div style={{ color: colors.accentTeal }}>
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm font-space font-medium text-gray-600">{item.text}</p>
                                        <p className="text-xs font-space text-gray-500">{item.subtext}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataSubscription;
