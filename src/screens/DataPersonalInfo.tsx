import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DesignButton } from '../components/atoms/DesignButton';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault';
import { SelectDefault } from '../components/atoms/SelectDefault';
const DataPersonalInfo: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8F8F8] flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-10 ml-[250px]">
                <h1 className="text-2xl font-space font-medium text-gray-800 mb-6">Datos Personales</h1>
                <div className="p-6 bg-white rounded-md border" style={{ borderColor: '#E5E7EB' }}>
                    <div className="flex ml-[16%] items-center gap-6">
                        
                        <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xl">IMG</span>
                        </div>
                       
                        <div className="flex flex-col">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-2">Foto de Perfil</h2>
                            <div className="flex gap-4">
                                <DesignButton variant="primary" onClick={() => console.log('Cambiar foto')}>
                                    Cambiar foto
                                </DesignButton>
                                <DesignButton variant="neutral" onClick={() => console.log('Eliminar')}>
                                    Eliminar
                                </DesignButton>
                            </div>
                        </div>
                    </div>

                   
                    <div className="w-8/12 ml-[16%] items-center border-t border-gray-300 my-6"></div>

                   
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex gap-4 w-full justify-center">
                            <div className="w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Nombre Completo
                                </label>
                                <InputDefault
                                    placeholder="Ingresa tu Nombre"
                                    className="w-full"
                                />
                            </div>
                            <div className="w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Correo Electrónico
                                </label>
                                <InputDefault
                                    type="email"
                                    placeholder="tu@email.com"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <div className="w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Fecha de nacimiento
                                </label>
                                <InputDefault
                                    type="date"
                                    className="w-full"
                                />
                            </div>
                            <div className="w-1/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Código de país
                                </label>
                                <SelectDefault
                                    options={[
                                        { value: '+54', label: '+54' },
                                        { value: '+1', label: '+1' },
                                        { value: '+44', label: '+44' },
                                    ]}
                                    placeholder="+54"
                                    className="w-full"
                                />
                            </div>
                            <div className="w-[370px]">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Número de teléfono
                                </label>
                                <InputDefault
                                    placeholder="Ingresa tu número"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 w-full justify-center">
                            <div className="w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    País
                                </label>
                                <SelectDefault
                                    options={[
                                        { value: 'argentina', label: 'Argentina' },
                                        { value: 'chile', label: 'Chile' },
                                        { value: 'brasil', label: 'Brasil' },
                                    ]}
                                    placeholder="Argentina"
                                    className="w-full"
                                />
                            </div>
                            <div className="w-4/12">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Ciudad
                                </label>
                                <InputDefault
                                    placeholder="Ingresa tu ciudad"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="w-8/12 mt-6">
                            <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                Dirección
                            </label>
                            <InputDefault
                                placeholder="Ingresa tu dirección completa"
                                className="w-full"
                            />
                        </div>

                       
                        <div className="w-8/12 border-t border-gray-300 my-6"></div>

                        
                        <div className="w-full">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-4" style={{ marginLeft: '16%' }}>
                                Cambiar contraseña
                            </h2>
                            <div className="flex gap-4 w-full justify-center">
                                <div className="w-4/12">
                                    <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                        Contraseña actual
                                    </label>
                                    <InputDefault
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full"
                                    />
                                </div>
                                <div className="w-4/12">
                                    <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                        Nueva contraseña
                                    </label>
                                    <InputDefault
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6 w-full">
                            <DesignButton variant="primary" onClick={() => console.log('Guardar cambios')}>
                                Guardar cambios
                            </DesignButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataPersonalInfo;
