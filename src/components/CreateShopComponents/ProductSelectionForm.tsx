import React, { useState, useEffect } from 'react';
import { SelectDefault } from '../atoms/SelectDefault';
import { fetchMainCategories } from '../../stores/slices/authSlice';

interface ProductSelectionFormProps {
    onNext: (category: string) => void;
}

const ProductSelectionForm: React.FC<ProductSelectionFormProps> = ({ onNext }) => {
    const [selected, setSelected] = useState('');
    const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([
        { value: '', label: 'Cargando categorías...' }
    ]);
    const [isLoading, setIsLoading] = useState(true);

    const handleChange = (value: string) => {
        setSelected(value);
    };

    const handleContinue = () => {
        if (selected) {
            onNext(selected);
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                const categories = await fetchMainCategories();
                
                const formattedOptions = categories.map((category: any) => ({
                    value: category.id || category._id,
                    label: category.name
                }));

                setCategoryOptions([
                    { value: '', label: 'Selecciona una categoría' },
                    ...formattedOptions
                ]);

            } catch (error) {
                console.error('Error loading categories:', error);
                setCategoryOptions([
                    { value: '', label: 'Error al cargar categorías' }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        loadCategories();
    }, []);

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-4">
                <label className="block text-sm font-space text-gray-800 mb-2">
                    Selecciona el tipo de productos que deseas vender
                </label>
                <SelectDefault 
                    options={categoryOptions}
                    placeholder="Selecciona una categoría"
                    className="w-full"
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
            <div className="mt-6">
                <button 
                    className={`py-2 px-4 rounded-md w-full ${
                        !selected || isLoading 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                    onClick={handleContinue}
                    disabled={!selected || isLoading}
                >
                    {isLoading ? 'Cargando...' : 'Continuar'}
                </button>
            </div>
        </div>
    );
};

export default ProductSelectionForm;
