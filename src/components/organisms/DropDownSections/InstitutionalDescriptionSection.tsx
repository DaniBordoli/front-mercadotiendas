import * as React from 'react';
import { DesignButton } from '../../atoms/DesignButton';
import { useShopStore } from '../../../stores/slices/shopStore';
import Toast from '../../atoms/Toast';

export const InstitutionalDescriptionSection: React.FC = () => {
    const { shop, updateShopInstitutional, loading, error } = useShopStore();
    
    const [formData, setFormData] = React.useState({
        description: '',
        mission: '',
        vision: '',
        history: '',
        values: ''
    });

    const [toast, setToast] = React.useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'info',
    });

    // Cargar datos existentes cuando el shop se carga
    React.useEffect(() => {
        if (shop) {
            setFormData({
                description: shop.description || '',
                mission: shop.mission || '',
                vision: shop.vision || '',
                history: shop.history || '',
                values: shop.values || ''
            });
        }
    }, [shop]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        try {
            await updateShopInstitutional(formData);
            setToast({
                show: true,
                message: 'Información institucional guardada exitosamente',
                type: 'success',
            });
        } catch (error) {
            setToast({
                show: true,
                message: 'Error al guardar la información',
                type: 'error',
            });
        }
    };

    const handleRestore = () => {
        if (shop) {
            setFormData({
                description: shop.description || '',
                mission: shop.mission || '',
                vision: shop.vision || '',
                history: shop.history || '',
                values: shop.values || ''
            });
        }
    };

    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Descripción de la tienda</label>
                <textarea
                    placeholder="Describe tu tienda..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{formData.description.length}/2000 caracteres</div>
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Misión</label>
                <textarea
                    placeholder="Misión de la empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={2}
                    value={formData.mission}
                    onChange={(e) => handleInputChange('mission', e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Visión</label>
                <textarea
                    placeholder="Describe la visión de tu empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                    maxLength={2000}
                    value={formData.vision}
                    onChange={(e) => handleInputChange('vision', e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Historia</label>
                <textarea
                    placeholder="Describe la historia de tu empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                    value={formData.history}
                    onChange={(e) => handleInputChange('history', e.target.value)}
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Valores</label>
                <textarea
                    placeholder="Describe los valores de tu empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                    value={formData.values}
                    onChange={(e) => handleInputChange('values', e.target.value)}
                />
            </div>
            <div className="flex flex-col gap-2">
                <DesignButton 
                    variant="neutral" 
                    onClick={handleRestore}
                    disabled={loading}
                >
                    Restaurar
                </DesignButton>
                <DesignButton 
                    variant="primary" 
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </DesignButton>
            </div>
            
            <Toast
                show={toast.show}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
                duration={3000}
            />
        </div>
    );
};
