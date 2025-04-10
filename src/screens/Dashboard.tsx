import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

import Carousel from '../components/organisms/Carousel/Carousel';
import { CardList } from '../components/molecules/Card';
import { CategoryCards } from '../components/organisms/CategoryCards';
import { WideCard } from '../components/molecules/WideCard';
import { Footer } from '../components/organisms/Footer';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="flex">
                <div className="flex-1 p-4">
                    <Carousel />
                    <div className="mt-6 flex justify-center">
                        <CardList />
                    </div>
                    <CategoryCards />
                    <WideCard />
                </div>
            </div>
            <Footer /> 
        </div>
    );
};

export default Dashboard;
