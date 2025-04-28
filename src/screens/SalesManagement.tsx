import * as React from 'react';
import SideMenuProfile from '../components/organisms/SideMenuProfile/SideMenuProfile';
import SalesManagementSection from '../components/organisms/SalesManagementSection/SalesManagementSection';

const SalesManagement: React.FC = () => {
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
            <div className='flex flex-row gap-6 max-w-[1280px] ml-56'>
                <div>
                    <SideMenuProfile />
                </div>
                
                <div className='flex flex-col'>
                    <SalesManagementSection />
                </div>
            </div>
        </div>
    );
};

export default SalesManagement;