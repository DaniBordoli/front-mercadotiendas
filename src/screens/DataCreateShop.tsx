import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { colors } from '../design/colors';
import { SelectDefault } from '../components/atoms/SelectDefault';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';

const DataCreateShop: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-10 ml-[250px]">
                <h1 className="text-2xl font-space font-medium text-gray-800 mb-6">Asistente de Creación de Tienda</h1>
                
                
                <div className="flex flex-col items-center mb-8">
                    <div className="flex justify-between w-full items-center relative">
                        {['Información Básica', 'Diseño', 'Productos', 'Pagos y Envíos'].map((step, index) => (
                            <div key={index} className="flex flex-col items-center w-1/4">
                                <div
                                    className="w-8 h-8 flex items-center justify-center rounded-full text-white font-space font-medium mb-2"
                                    style={{
                                        backgroundColor: index === 0 ? colors.primaryRed : colors.lightGray,
                                    }}
                                >
                                    {index + 1}
                                </div>
                                <span
                                    className="text-sm font-space"
                                    style={{
                                        color: index === 0 ? colors.primaryRed : colors.mediumGray,
                                    }}
                                >
                                    {step}
                                </span>
                            </div>
                        ))}
                        <div className="absolute top-8 w-full h-[2px]" style={{ backgroundColor: colors.lightGray }}></div>
                    </div>
                </div>

                
                <div
                    className="p-6 bg-white rounded-md border flex flex-col items-center"
                    style={{ borderColor: colors.lightGray }}
                >
                    <div className="w-8/12  mb-4">
                        <h2 className="text-lg font-space font-medium text-gray-800 mb-2">¡Comencemos con tu tienda!</h2>
                        <p className="text-sm font-space text-gray-500 mb-6">
                            Nuestro asistente con IA te ayudará a configurar tu tienda en minutos
                        </p>
                    </div>

                   
                    <div className="mb-4 w-8/12">
                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                            Nombre de la Tienda
                        </label>
                        <InputDefault className="w-full" placeholder="Ej: Fashion Store" />
                    </div>

                    
                    <div className="mb-4 w-8/12">
                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                            Describe tu tienda
                        </label>
                        <textarea
                            placeholder="¿Qué productos vendes? ¿Cuál es tu propuesta de valor?"
                            className="w-full h-40 border px-3 py-2 font-space text-gray-600 rounded-md"
                            style={{ borderColor: colors.lightGray }}
                        />
                    </div>

                   
                    <div className="mb-4 w-8/12">
                        <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                            Categoría Principal
                        </label>
                        <SelectDefault
                            options={[
                                { value: 'ropa', label: 'Ropa' },
                                { value: 'electronica', label: 'Electrónica' },
                                { value: 'hogar', label: 'Hogar' },
                            ]}
                            placeholder="Selecciona una categoría"
                            className="w-full"
                        />
                    </div>

                 
                    <div className="w-8/12 border-t border-gray-300 my-6"></div>

                    
                    <div className="w-8/12 flex justify-between">
                        <DesignButton variant="neutral" onClick={() => console.log('Cancelar')}>
                            Cancelar
                        </DesignButton>
                        <DesignButton variant="primary" onClick={() => console.log('Continuar')}>
                            Continuar
                        </DesignButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataCreateShop;
