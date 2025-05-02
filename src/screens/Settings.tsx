import * as React from 'react';
import { Navbar } from '../components/organisms/Navbar';
import { DropDownSections } from '../components/organisms/DropDownSections';
import ShopInfo from './ShopInfo';

const Settings = () => {
    const [openSection, setOpenSection] = React.useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-gray-100"> 
            <Navbar />
            <div className="p-5">
                <div className="w-4/5 mt-24 mx-auto bg-white p-5 rounded-lg shadow-md">
                    <h1 className="text-left text-xl font-space">Configuración</h1>
                    <DropDownSections openSection={openSection} toggleSection={toggleSection} />
                   
                </div>
            </div>
        </div>
    );
};

export default Settings;
