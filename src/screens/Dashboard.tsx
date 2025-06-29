import * as React from 'react';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { FaSearch } from 'react-icons/fa';
import { CategoryCards } from '../components/organisms/CategoryCards/CategoryCards';
import { CardList } from '../components/molecules/Card/Card';
import { colors } from '../design/colors';
import { WideCard } from '../components/molecules/WideCard';
import { StartSellingSection } from '../components/molecules/StartSellingSection';
import { BenefitsSection } from '../components/organisms/BenefitsSection';
import { Footer } from '../components/organisms/Footer';
import Carousel from '../components/organisms/Carousel/Carousel';
import { Navbar } from '../components/organisms/Navbar';
import { useAuthStore, useShopStore } from '../stores';

const Dashboard: React.FC = () => {
    const { forceLoadProfile, token, isAuthenticated } = useAuthStore();
    const { setShop } = useShopStore();

    React.useEffect(() => {
        const loadUserData = async () => {
            if (isAuthenticated && token) {
                try {
                    console.log('[Dashboard] Forzando recarga de perfil de usuario...');
                    const userData = await forceLoadProfile();
                    
                    // Sincronizar shopStore con los datos del usuario
                    if (userData?.shop) {
                        setShop(userData.shop);
                        console.log('[Dashboard] Tienda sincronizada en shopStore');
                    }
                } catch (error) {
                    console.error('[Dashboard] Error al cargar perfil:', error);
                }
            }
        };

        loadUserData();
    }, [forceLoadProfile, token, isAuthenticated, setShop]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar /> 
            <div className="flex-1"> 
                <div className="flex justify-between items-center md:mt-14 mt-0 md:mb-4 mb-0">
                </div>

               
                <div className="only-mobile">
                    <div className="">
                        <Carousel />
                    </div>
                    <div className="w-full mt-8 px-0">
                        <CategoryCards />
                    </div>
                    <div className="w-full mt-8 px-0">
                        <WideCard />
                    </div>
                </div>

               
                <div className="only-desktop">
                    <div className="my-12">
                        <Carousel />
                    </div>
                    <div className="w-10/12 mx-auto">
                        <h2 
                            className="text-xl font-space text-left"
                            style={{ color: colors.mediumGray }}
                        >
                            Productos Destacados
                        </h2>
                    </div>
                    <div>
                        <CardList />
                    </div>
                    <div className="w-full mt-8 px-0">
                        <CategoryCards />
                        <WideCard />
                    </div>
                </div>

                <div className="w-full mt-8 px-0"> 
                    <StartSellingSection /> 
                    <BenefitsSection />
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default Dashboard;