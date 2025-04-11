import React from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { LabeledInputField } from '../components/atoms/LabeledInputField';
import { Button } from '../components/atoms/Button';

const InfoTienda = () => {
    return (
        <div>
            <div>
                <Sidebar />
                <main className='ml-60 p-20'>
                    <h1 className='text-3xl font-medium mb-6'>Información de mi tienda</h1>
                    <div className='bg-white w-full p-6 rounded shadow'>
                        <div>
                            <LabeledInputField type="text" label="Usuario" placeholder="email@email.com" />
                            <p className='text-sm  mb-4 text-gray-500'>Email registrado para iniciar sesión en tu panel</p>
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Nombre de la Marca (editable)" placeholder="Mi marca" />
                            <p className='text-sm  mb-4 text-gray-500'>Nombre de tu negocio</p>
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Email de contacto (editable)" placeholder="mimarca@email.com" />
                            <p className='text-sm  mb-4 text-gray-500'>Email que aparecerá en la parte inferior de tu tienda. Allí te llegarán todas las notificaciones (ventas, consultas, etc.).</p>
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Dirección de la tienda (opcional)" placeholder="Ej Libertador 1892, CABA, Buenos Aires" />
                            <p className='text-sm mb-4 text-gray-500'>Aparecerá en la parte inferior de tu tienda</p>
                        </div>
                        <div>
                            <LabeledInputField type="text" label="Teléfono de la tienda (opcional)" placeholder="Ej 1122334455" />
                            <p className='text-sm mb-4 text-gray-500'>Aparecerá en la parte inferior de tu tienda</p>
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
