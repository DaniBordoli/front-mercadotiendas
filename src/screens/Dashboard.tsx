import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Navbar />
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-64 p-4">
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
