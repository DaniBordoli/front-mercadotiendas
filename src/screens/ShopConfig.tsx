import * as React from 'react';
import SideMenuProfile from '../components/organisms/SideMenuProfile/SideMenuProfile';
import StoreConfigSection from '../components/organisms/StoreConfigSection/StoreConfigSection';

const ShopConfig: React.FC = () => {
    const hasActiveStore = true; 

    if (!hasActiveStore) {
        return (
            <div className='min-h-screen bg-[#E5E7EB] flex items-center justify-center'>
                <h1 className='text-xl font-space text-gray-700'>No tienes una tienda activa.</h1>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#E5E7EB] flex pb-10'>
            <div className='flex flex-row gap-6 max-w-7xl  mx-auto'>
                <div>
                    <SideMenuProfile />
                </div>
                
                <div className='flex flex-col'>
                    <StoreConfigSection />
                </div>
            </div>
        </div>
    );
};

export default ShopConfig;