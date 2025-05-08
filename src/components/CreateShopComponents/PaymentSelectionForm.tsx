import React, { useState } from 'react';
import { SelectDefault } from '../atoms/SelectDefault';

interface PaymentSelectionFormProps {
    onNext: (currency: string) => void;
}

const PaymentSelectionForm: React.FC<PaymentSelectionFormProps> = ({ onNext }) => {
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
                    Selecciona el tipo de moneda para los pagos
                </label>
                <SelectDefault 
                    options={[
                        { value: 'ars', label: 'Pesos Argentinos' },
                        { value: 'mxn', label: 'Pesos Mexicanos' },
                        { value: 'clp', label: 'Pesos Chilenos' },
                        { value: 'usd', label: 'Dólares Estadounidenses' },
                    ]}
                    placeholder="Selecciona una moneda"
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

export default PaymentSelectionForm;
