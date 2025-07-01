import React, { useState } from 'react';
import { InputDefault } from '../atoms/InputDefault';
import { DesignButton } from '../atoms/DesignButton';

interface MainFormProps {
    onNext: (data: { storeName: string; email: string; address: string; shopPhone: string }) => void;
}

const MainForm: React.FC<MainFormProps> = ({ onNext }) => {
    const [formData, setFormData] = useState({
        storeName: '',
        email: '',
        address: '',
        shopPhone: '',
    });
    const [errors, setErrors] = useState({
        storeName: false,
        email: false,
        address: false,
        shopPhone: false,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: false }));
    };

    const validateInputs = () => {
        const newErrors = {
            storeName: !formData.storeName.trim(),
            email: !formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email),
            address: !formData.address.trim(),
            shopPhone: !formData.shopPhone.trim(),
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
                    Dirección
                </label>
                <InputDefault 
                    placeholder="Ej: Av. Principal 123, Ciudad" 
                    className={`w-full ${errors.address ? 'border-red-500' : ''}`}
                    value={formData.address}
                    onChange={(value) => handleInputChange('address', value)}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>}
            </div>
            <div className="mb-4">
                <label className="block text-sm font-space text-gray-800 mb-2">
                    Número de Teléfono
                </label>
                <InputDefault 
                    placeholder="Ej: +1 234 567 8900" 
                    className={`w-full ${errors.shopPhone ? 'border-red-500' : ''}`}
                    value={formData.shopPhone}
                    onChange={(value) => handleInputChange('shopPhone', value)}
                />
                {errors.shopPhone && <p className="text-red-500 text-sm mt-1">Este campo es obligatorio.</p>}
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
