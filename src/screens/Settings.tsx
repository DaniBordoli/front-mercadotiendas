import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { DropDownSections } from '../components/organisms/DropDownSections';

const Settings = () => {
    const [openSection, setOpenSection] = React.useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-10 md:ml-[250px]">
                <div className="bg-white p-5 rounded-lg shadow-md mt-8 md:w-4/5 md:mx-auto">
                    <h1 className="text-left text-xl font-space">Configuración</h1>
                    <DropDownSections openSection={openSection} toggleSection={toggleSection} />
                </div>
            </div>
        </div>
    );
};

export default Settings;
