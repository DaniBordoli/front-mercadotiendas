import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault/InputDefault';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';

const PersonalSection: React.FC = () => {
    return (
        <div className='flex justify-center '>
            <div className='w-[928px] h-[278px] mt-24 bg-white rounded-md shadow-md p-6'>
                <div className="flex justify-between items-center mb-8">
                    <h1
                    style={{color: colors.darkGray}}
                    className='text-xl font-space'
                    >Información Personal</h1>
                    
                    <DesignButton variant="secondary">
                        Guardar Cambios
                    </DesignButton>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
        
                    <div className="col-span-1">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Nombre Completo</label>
                        <InputDefault placeholder="" />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Correo Electrónico</label>
                        <InputDefault placeholder="" />
                    </div>
                    
            
                    <div className="col-span-1 mt-4">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Teléfono</label>
                        <InputDefault placeholder="" type="email" />
                    </div>
                    <div className="col-span-1 mt-4">
                        <label className="block text-sm font-base font-space text-gray-500 mb-1">Fecha de Nacimiento</label>
                        <InputDefault placeholder="" type="date" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PersonalSection;