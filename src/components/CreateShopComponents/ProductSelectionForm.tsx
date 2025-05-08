import React, { useState } from 'react';
import { SelectDefault } from '../atoms/SelectDefault';

interface ProductSelectionFormProps {
    onNext: (category: string) => void;
}

const ProductSelectionForm: React.FC<ProductSelectionFormProps> = ({ onNext }) => {
    const [selected, setSelected] = useState('');

    const handleChange = (value: string) => {
        setSelected(value);
    };

    const handleContinue = () => {
        if (selected) {
            onNext(selected);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-4">
                <label className="block text-sm font-space text-gray-800 mb-2">
                    Selecciona el tipo de productos que deseas vender
                </label>
                <SelectDefault 
                    options={[
                        { value: 'ropa', label: 'Ropa' },
                        { value: 'electronica', label: 'Electrónica' },
                        { value: 'hogar', label: 'Hogar' },
                        { value: 'alimentos', label: 'Alimentos' },
                        { value: 'otros', label: 'Otros' },
                    ]}
                    placeholder="Selecciona una categoría"
                    className="w-full"
                    onChange={handleChange}
                />
            </div>
            <div className="mt-6">
                <button 
                    className="bg-red-500 text-white py-2 px-4 rounded-md w-full"
                    onClick={handleContinue}
                    disabled={!selected}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default ProductSelectionForm;
