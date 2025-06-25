import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { colors } from '../design/colors';
import { SelectDefault } from '../components/atoms/SelectDefault';
import { InputDefault } from '../components/atoms/InputDefault';
import { FaCloudUploadAlt } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { DesignButton } from '../components/atoms/DesignButton';
import LogoUploader from '../components/CreateShopComponents/LogoUploader';
import { useFirstLayoutStore } from '../stores/firstLayoutStore';

const DataShopConfig: React.FC = () => {
    const [selectedTab, setSelectedTab] = React.useState('Diseño');
    const editableVariables = useFirstLayoutStore(state => state.editableVariables);

    const tabs = ['Diseño'];

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space font-medium text-gray-800 mb-6">Configuración de Tienda</h1>
                
            
                <div className="p-4 md:p-6 bg-white rounded-md border" style={{ borderColor: colors.lightGray }}>
                    <div className="relative">
                        <div className="flex gap-6 relative">
                            {tabs.map((tab, index) => (
                                <div
                                    key={tab}
                                    className="flex flex-col cursor-pointer"
                                    onClick={() => setSelectedTab(tab)}
                                >
                                    <span
                                        className={`text-base font-space ${
                                            selectedTab === tab ? 'font-medium' : 'text-gray-500'
                                        }`}
                                        style={{
                                            color: selectedTab === tab ? colors.primaryRed : colors.mediumGray,
                                        }}
                                    >
                                        {tab}
                                    </span>
                                    {selectedTab === tab && (
                                        <div
                                            className="h-[3px] mt-2"
                                            style={{
                                                backgroundColor: colors.primaryRed,
                                                width: index === 0 ? '100%' : '120%',
                                                marginLeft: index === 0 ? '0' : '0',
                                            }}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                     
                        <div
                            className="absolute bottom-0 left-0 w-full h-[1px]"
                            style={{ backgroundColor: colors.lightGray }}
                        ></div>
                    </div>

                  
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-6">
                       
                        <div className="flex-1">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-4">Layout</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Tipo de Layout
                                </label>
                                <SelectDefault
                                    options={[
                                        { value: 'grid', label: 'Grid' },
                                        { value: 'list', label: 'List' },
                                    ]}
                                    placeholder="Grid"
                                    className="w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Columnas en Desktop
                                </label>
                                <SelectDefault
                                    options={[
                                        { value: '2', label: '2 columnas' },
                                        { value: '3', label: '3 columnas' },
                                    ]}
                                    placeholder="2 columnas"
                                    className="w-full"
                                />
                            </div>
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-4">Tipografía</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Fuente Principal
                                </label>
                                <SelectDefault
                                    options={[
                                        { value: 'inter', label: 'Inter' },
                                        { value: 'roboto', label: 'Roboto' },
                                    ]}
                                    placeholder="Inter"
                                    className="w-full"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                        Tamaño Base
                                    </label>
                                    <InputDefault
                                        placeholder="16px"
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                        Altura de Línea
                                    </label>
                                    <InputDefault
                                        placeholder="24px"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                       
                        <div className="flex-1">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-4">Colores y Marca</h2>
                            <div className="flex gap-4 mb-6">
                                <div className="flex-1">
                                    <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                        Color Principal
                                    </label>
                                    <div
                                        className="h-10 rounded-md"
                                        style={{
                                            backgroundColor: colors.primaryRed,
                                            width: '100%',
                                        }}
                                    ></div>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                        Color Secundario
                                    </label>
                                    <div
                                        className="h-10 rounded-md"
                                        style={{
                                            backgroundColor: colors.accentTeal,
                                            width: '100%',
                                        }}
                                    ></div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Logo de Tienda
                                </label>
                                <LogoUploader 
                                    currentLogoUrl={editableVariables.logoUrl || '/logo.png'} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-space font-medium text-gray-600 mb-2">
                                    Banner Principal
                                </label>
                                <div
                                    className="h-40 border-dashed border-2 border-gray-300 rounded-md flex flex-col items-center justify-center"
                                >
                                    <FaImage className="text-4xl text-gray-600" />
                                    <p className="text-sm text-gray-600 mt-2">Arrastra tu banner aquí</p>
                                    <p className="text-sm text-gray-600"
                                    style={{color: colors.primaryRed}}>o selecciona un archivo</p>

                                </div>
                            </div>
                        </div>
                    </div>
                <div className="flex justify-end mt-6">
                    <DesignButton variant="primary" onClick={() => console.log('Guardar Cambios')}>
                        Guardar Cambios
                    </DesignButton>
                </div>
                </div>
            </div>
        </div>
    );
};

export default DataShopConfig;
