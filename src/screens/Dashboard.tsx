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

const Dashboard: React.FC = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar /> 
            <div className="flex-1"> 
                <div className="flex justify-between items-center mb-4">
                </div>
            
                <div className="mt-24 flex justify-center mb-4 w-full"> 
                    <div className="w-10/12">
                        <InputDefault 
                            className="w-full" 
                            placeholder="Buscar productos, tiendas y más..." 
                            icon={<FaSearch className="text-gray-500" />}
                        />
                    </div>
                </div>
                

                <div className='my-12'>
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
                <div className=""> 
                    <CardList />
                </div>

                <div className="w-full mt-8 px-0"> 
                    <CategoryCards />

                    <WideCard/>

                    <StartSellingSection /> 

                    <BenefitsSection />
                    <Footer />
                </div>
                
            </div>
        </div>
    )
}

export default Dashboard;