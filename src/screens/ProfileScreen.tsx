import React from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { Navbar } from '../components/organisms/Navbar';
const ProfileScreen = () => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Navbar />
                <div>
                
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;
