import React, { useState } from 'react';
import { InputDefault } from '../atoms/InputDefault';
import { SelectDefault } from '../atoms/SelectDefault';
import { FaRobot } from 'react-icons/fa';
import { DesignButton } from '../atoms/DesignButton';

interface MainFormProps {
    onNext: (data: { storeName: string; email: string; password: string }) => void;
}

const MainForm: React.FC<MainFormProps> = ({ onNext }) => {
    const [formData, setFormData] = useState({
        storeName: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        storeName: false,
        email: false,
        password: false,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const validateInputs = () => {
        const newErrors = {
            storeName: !formData.storeName.trim(),
            email: !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email),
            password: !formData.password.trim() || formData.password.length < 8,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error);
    };

    const handleNext = () => {
        if (validateInputs()) {
            onNext(formData);
        }
    };

    return (
        <>
            <div className="mb-4">
                <label className="block text-sm font-space text-gray-800 mb-2">
                    Nombre de la tienda
                </label>
                <InputDefault 
                    placeholder="Ej: Fashion Store" 
                    className={`w-full ${errors.storeName ? 'border-red-500' : ''}`}
                    value={formData.storeName}
                    onChange={(value) => handleInputChange('storeName', value)}
                />
                {errors.storeName && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-space text-gray-800 mb-2">
                    Correo Electrónico
                </label>
                <InputDefault 
                    type="email" 
                    placeholder="tu@email.com" 
                    className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={(value) => handleInputChange('email', value)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">Introduce un correo válido.</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-space text-gray-800 mb-2">
                    Contraseña
                </label>
                <InputDefault 
                    type="password" 
                    placeholder="Mínimo 8 caracteres" 
                    className={`w-full ${errors.password ? 'border-red-500' : ''}`}
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">La contraseña debe tener al menos 8 caracteres.</p>}
            </div>

            <div className="flex bg-gray-100 p-4 rounded-md mt-6 flex-col">
                <div className="flex items-center mb-6">
                    <div 
                        className="flex items-center justify-center w-12 h-12 rounded-full" 
                        style={{ backgroundColor: '#FF0000' }}
                    >
                        <FaRobot className='text-white' size={24} />
                    </div>
                    <div className="ml-4">
                        <p className="text-lg font-space font-medium">Asistente IA</p>
                        <p className="text-sm font-space text-gray-400">Te ayudaré a configurar tu tienda</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-md w-full mb-4">
                    <label className="block text-sm font-space text-gray-800 mb-2">
                        ¿Qué tipo de producto venderás?
                    </label>
                    <SelectDefault 
                        options={[
                            { value: 'ropa', label: 'Ropa' },
                            { value: 'electronica', label: 'Electrónica' },
                            { value: 'hogar', label: 'Hogar' },
                        ]}
                        placeholder="Selecciona una categoría"
                        className="w-full"
                    />
                </div>

                <div className="bg-white p-4 rounded-md w-full">
                    <label className="block text-sm font-space text-gray-800 mb-2">
                        ¿Cuál es tu público objetivo?
                    </label>
                    <SelectDefault 
                        options={[
                            { value: 'adultos', label: 'Adultos' },
                            { value: 'niños', label: 'Niños' },
                            { value: 'adolescentes', label: 'Adolescentes' },
                        ]}
                        placeholder="Selecciona tu audiencia"
                        className="w-full"
                    />
                </div>
            </div>

            <div className="mt-6 w-full">
                <DesignButton 
                    variant="primary" 
                    fullWidth={true} 
                    onClick={handleNext}
                >
                    Continuar
                </DesignButton>
            </div>
        </>
    );
};

export default MainForm;
