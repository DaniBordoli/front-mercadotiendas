import React from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { LabeledInputField } from '../components/atoms/LabeledInputField';
import { Button } from '../components/atoms/Button';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaTiktok, FaYoutube } from 'react-icons/fa';

const InfoTienda = () => {
    return (
        <div>
            <div>
                <Sidebar />
                <main className='ml-60 p-20'>
                    <h1 className='text-3xl font-medium mb-6'>Información de mi tienda</h1>
                    <div className='bg-white w-full p-6 rounded shadow'>
                        <div>
                            <LabeledInputField type="text" label="Facebook (opcional)" placeholder={<FaFacebook />} />
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Instagram (opcional)" placeholder={<FaInstagram />} />
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Twitter (opcional)" placeholder={<FaTwitter />} />
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Pinterest (opcional)" placeholder={<FaPinterest />} />
                        </div>
                        <div>
                            <LabeledInputField type="text" label="TikTok (opcional)" placeholder={<FaTiktok />} />
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Youtube (opcional)" placeholder={<FaYoutube />} />
                        </div>
                    </div>
                    <Button variant="primary" className="mt-6 w-60 bg-sky-500 hover:bg-sky-600 text-white">
                        Guardar
                    </Button>
                </main> 
            </div>
        </div>
    );
};

export default InfoTienda;