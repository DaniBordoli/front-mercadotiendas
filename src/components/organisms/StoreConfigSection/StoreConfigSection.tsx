import * as React from 'react';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';

const StoreConfigSection: React.FC = () => {
    return (
        <div className='flex justify-center'>
            <div className='w-[928px] h-auto mt-24 bg-white rounded-md shadow-md p-6'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>🛠️ Configurar Tienda</h1>
                <div className="grid grid-cols-2 gap-6 font-space text-gray-600">
                    {/* Layout, Colors, and Typography Section */}
                    <div>
                        <h2 className="font-bold mb-2">Cambiar Layout, Colores y Tipografía</h2>
                        <p className="text-sm mb-4">Personaliza el diseño visual de tu tienda.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Configurar</DesignButton>
                    </div>

                    {/* Logos and Banners Section */}
                    <div>
                        <h2 className="font-bold mb-2">Modificación de Logos y Banners</h2>
                        <p className="text-sm mb-4">Sube o edita los logos y banners de tu tienda.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Editar</DesignButton>
                    </div>

                    {/* Global Configuration Section */}
                    <div>
                        <h2 className="font-bold mb-2">Configuración Global de la Tienda</h2>
                        <p className="text-sm mb-4">Ajusta configuraciones generales de tu tienda.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Configurar</DesignButton>
                    </div>

                    {/* Categories and Subcategories Section */}
                    <div>
                        <h2 className="font-bold mb-2">Editar Categorías y Subcategorías</h2>
                        <p className="text-sm mb-4">Organiza los productos en categorías y subcategorías.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Editar</DesignButton>
                    </div>

                    {/* ABM Products Section */}
                    <div>
                        <h2 className="font-bold mb-2">ABM de Productos</h2>
                        <p className="text-sm mb-4">Añade, edita o elimina productos de tu tienda.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Gestionar</DesignButton>
                    </div>

                    {/* Payment Methods Section */}
                    <div>
                        <h2 className="font-bold mb-2">Configuración de Métodos de Pago</h2>
                        <p className="text-sm mb-4">Configura los métodos de pago disponibles.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Configurar</DesignButton>
                    </div>

                    {/* Shipping Methods Section */}
                    <div>
                        <h2 className="font-bold mb-2">Configuración de Métodos de Envío</h2>
                        <p className="text-sm mb-4">Ajusta las opciones de envío para tus clientes.</p>
                        <DesignButton variant="primary" onClick={() => {}}>Configurar</DesignButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreConfigSection;
