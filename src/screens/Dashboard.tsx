import React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { Sidebar } from '../components/organisms/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
