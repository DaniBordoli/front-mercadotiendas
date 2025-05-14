import * as React from 'react';

const ShopToggleSection: React.FC = () => {
    const [isShopActive, setIsShopActive] = React.useState(true);

    const handleToggle = () => {
        const action = isShopActive ? 'apagar' : 'encender';
        const confirmation = window.confirm(
            `¿Estás seguro de que deseas ${action} la tienda? Esto ${isShopActive ? 'ocultará la tienda del marketplace y evitará nuevas ventas.' : 'volverá a activar la tienda en el directorio.'}`
        );
        if (confirmation) {
            setIsShopActive(!isShopActive);
        }
    };

    return (
        <div className='flex justify-center mt-10'>
            <div className='w-[928px] h-auto bg-white rounded-md shadow-md p-6'>
                <h1 className='text-xl font-space text-gray-700 mb-6'>Encendido / Apagado de Tienda</h1>
                <p className='text-gray-600 mb-4'>
                    {isShopActive
                        ? 'La tienda está actualmente activa en el marketplace.'
                        : 'La tienda está actualmente desactivada y oculta del marketplace.'}
                </p>
                <div className="flex items-center">
                    <span
                        className={`text-sm font-bold rounded-md px-4 py-1 inline-block ${
                            isShopActive ? 'text-red-500 bg-[#ffcccc]' : 'text-red-500 bg-[#ffcccc]'
                        }`}
                    >
                        {isShopActive ? 'Tienda Encendida' : 'Tienda Apagada'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input type="checkbox" className="sr-only peer" checked={isShopActive} onChange={handleToggle} />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-500 peer-checked:bg-red-500"></div>
                        <div className="absolute w-5 h-5 bg-white rounded-full left-1 top-0.5 peer-checked:translate-x-5 transition-transform"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ShopToggleSection;
