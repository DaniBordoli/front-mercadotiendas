import * as React from 'react';
import SideMenuProfile from '../components/organisms/SideMenuProfile/SideMenuProfile';
import SubscriptionDetailsSection from '../components/organisms/SubscriptionDetailsSection/SubscriptionDetailsSection';

const Subscription: React.FC = () => {
    return (
        <div className='min-h-screen bg-[#E5E7EB] flex pb-10'>
            <div className='flex flex-row gap-6 max-w-[1280px] ml-56'>
                <div>
                    <SideMenuProfile />
                </div>
                
                <div className='flex flex-col'>
                    <SubscriptionDetailsSection />
                </div>
            </div>
        </div>
    )
}

export default Subscription;