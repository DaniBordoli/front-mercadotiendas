import * as React from 'react';
import PurchaseHistorySection from '../components/organisms/PurchaseHistorySection/PurchaseHistorySection';
import SideMenuProfile from '../components/organisms/SideMenuProfile/SideMenuProfile';

const PurchaseHistory: React.FC = () => {
    return (
        <div className='min-h-screen bg-[#E5E7EB] flex pb-10'>
            
            <div className='flex flex-row gap-6 max-w-7xl  mx-auto'>
                <div>
                    <SideMenuProfile />
                </div>
                
                <div className='flex flex-col'>
                    <PurchaseHistorySection />
                </div>
            </div>
        </div>
    )
}

export default PurchaseHistory;