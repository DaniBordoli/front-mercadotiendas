import * as React from 'react';
import PersonalSection from '../components/organisms/PersonalSection/PersonalSection';
import RecentOrderSection from '../components/organisms/RecentOrder/RecentOrderSection';
import SavedOrders from '../components/organisms/SavedOrders/SavedOrders';
import SideMenuProfile from '../components/organisms/SideMenuProfile/SideMenuProfile';

const PersonalInfo: React.FC = () => {
    return (
        <div className='min-h-screen bg-[#E5E7EB] flex pb-10'>
            <div className='flex flex-row gap-6 max-w-[1280px] ml-56'>
                <div>
                    <SideMenuProfile />
                </div>
                
                <div className='flex flex-col'>
                    <PersonalSection />
                    <RecentOrderSection />
                    <SavedOrders />
                </div>
            </div>
        </div>
    )
}

export default PersonalInfo;