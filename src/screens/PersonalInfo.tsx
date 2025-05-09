import * as React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { Logo } from '../components/atoms/Logo/Logo'; 
import PersonalSection from '../components/organisms/PersonalSection/PersonalSection';
import RecentOrderSection from '../components/organisms/RecentOrder/RecentOrderSection';
import SavedOrders from '../components/organisms/SavedOrders/SavedOrders';
import SideMenuProfile from '../components/organisms/SideMenuProfile/SideMenuProfile';

const PersonalInfo: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className='min-h-screen bg-[#E5E7EB] flex flex-col'>
            
            <div className='bg-white w-full h-16 flex items-center px-6 shadow-md'>
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                              <Logo size={28} color="skyblue" />
                              <h1 className="text-xl font-bold ml-2 font-space">MercadoTiendas</h1>
                            </div>
            </div>

            
            <div className='flex flex-row gap-6 max-w-7xl mx-auto mt-6'>
                <div>
                    <SideMenuProfile />
                </div>
                
                <div className='flex-col'>
                    <PersonalSection />
                    <RecentOrderSection />
                    <SavedOrders />
                </div>
            </div>
        </div>
    );
}

export default PersonalInfo;