import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleInfo, FaLink } from 'react-icons/fa6';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';

const DomainInfo = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-10 md:ml-[250px]">
                <div className="bg-white p-5 rounded-lg shadow-md mt-8 md:w-4/5 md:mx-auto">
                    <h1 className="text-left text-xl font-space">Configuración de Dominio</h1>
                    <p className="text-left text-sm text-gray-600 font-space my-2">Subdominio</p>
                    <p className="bg-gray-100 font-space p-3 rounded-md flex items-center">
                        <FaLink className="text-gray-500 mr-2" />
                        Tu tienda está disponible en: mitienda.mercadotiendas.com
                    </p>
                    <div className="mt-4">
                        <p className="text-left font-space text-sm text-gray-600 mb-2">Personalizar subdominio</p>
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <InputDefault
                                    placeholder="mitienda"
                                    className="w-full"
                                />
                                <span className="ml-2 text-gray-600 whitespace-nowrap">.mercadotiendas.com</span>
                            </div>
                        </div>
                    </div>
                    <hr className="mt-6 border-t border-gray-300" />
                    <div className="mt-6">
                        <h2 className="text-left text-lg font-space ">Dominio Personalizado</h2>
                        <p className="text-left text-sm text-gray-600 font-space my-2">Conectar dominio propio</p>
                        <InputDefault
                            placeholder="www.mitienda.com"
                            className="w-full"
                        />
                    </div>
                    <div className="mt-6 bg-gray-100 p-4 rounded-md">
                        <div className="flex items-center mb-4">
                            <StatusTags status="Active" className="mr-2" />
                            <span className="text-gray-700 font-space">Dominio conectado y verificado</span>
                        </div>
                        <div className="flex items-center text-gray-700 mb-2">
                            <FaCheckCircle className="text-green-500 mr-2" />
                            <span className="font-space">Registro DNS configurados correctamente</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <FaCheckCircle className="text-green-500 mr-2" />
                            <span className="font-space">Certificado SSL activo</span>
                        </div>
                    </div>
                    <div
                        className="mt-6 p-4 rounded-md"
                        style={{
                            backgroundColor: 'rgba(255, 79, 65, 0.1)', 
                        }}
                    >
                        <div className="flex items-center mb-4  font-light">
                            <FaCircleInfo className="mr-2 text-red-600" />
                            <span className="font-space font-semibold">
                                Para conectar tu dominio personalizado:
                            </span>
                        </div>
                        <div className="ml-10 text-sm text-gray-700 font-space">
                            <p className="mb-2">
                                Agrega un registro CNAME apuntando a: stores.mercadotiendas.com
                            </p>
                            <p className="mb-2">
                                Agrega un registro TXT con el valor: mt-verify=123456
                            </p>
                            <p>
                                Espera hasta 24 horas para la propagación DNS
                            </p>
                        </div>
                    </div>
                    <hr className="mt-6 border-t border-gray-300" />
                    <div className="mt-4 flex justify-end space-x-4">
                        <DesignButton variant="neutral">Cancelar</DesignButton>
                        <DesignButton variant="primary">Guardar cambios</DesignButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DomainInfo;