import * as React from 'react';
import { useState, useEffect } from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { SelectDefault } from '../../atoms/SelectDefault';
import { DesignButton } from '../../atoms/DesignButton';
import { useAuthStore, useShopStore } from '../../../stores'; 

export const GeneralInfoSection: React.FC = () => {
    const [formData, setFormData] = useState({
        shopName: '',
        country: '',
        province: '',
        city: '',
        taxAdress: '',
        shopPhone: '',
        contactEmail: '',
        category: '',
        preferredCurrency: '',
        languageMain: '',
    });

    const { user } = useAuthStore(); // Obtener el usuario autenticado
    const updateShopInfo = useShopStore(state => state.updateShopInfo);
    const loading = useShopStore(state => state.loading);
    const error = useShopStore(state => state.error);

    useEffect(() => {
        if (user?.shop) {
            setFormData({
                shopName: user.shop.name || '',
                country: user.shop.country || '',
                province: user.shop.province || '',
                city: user.shop.city || '',
                taxAdress: user.shop.address || '',
                shopPhone: user.shop.shopPhone || '',
                contactEmail: user.shop.contactEmail || '',
                category: user.shop.category || '',
                preferredCurrency: user.shop.preferredCurrency || '',
                languageMain: user.shop.languageMain || '',
            });
        }
    }, [user?.shop]);

    const handleInputChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!user?.shop?._id) {
            console.error('No shop ID found');
            return;
        }

        const updateData = {
            name: formData.shopName,
            brandName: formData.shopName,
            address: formData.taxAdress,
            shopPhone: formData.shopPhone,
            contactEmail: formData.contactEmail,
            country: formData.country,
            province: formData.province,
            city: formData.city,
            category: formData.category,
            preferredCurrency: formData.preferredCurrency,
            languageMain: formData.languageMain,
        };

        try {
            await updateShopInfo(user.shop._id, updateData);
            console.log('Shop info updated successfully');
        } catch (err) {
            console.error('Error updating shop info:', err);
        }
    };

    const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
    ];

    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="text-sm font-space mb-2 block">Nombre de la tienda</label>
                    <InputDefault
                        placeholder="Ingrese nombre de la tienda"
                        className="w-full"
                        value={formData.shopName}
                        onChange={value => handleInputChange('shopName', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">País</label>
                    <SelectDefault
                        placeholder="Argentina"
                        className="w-full"
                        options={[{ value: 'Argentina', label: 'Argentina' }]}
                        value={formData.country || 'Argentina'}
                        onChange={value => handleInputChange('country', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Provincia</label>
                    <InputDefault
                        placeholder="Ingrese provincia"
                        className="w-full"
                        value={formData.province}
                        onChange={value => handleInputChange('province', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Ciudad</label>
                    <InputDefault
                        placeholder="Ingrese ciudad"
                        className="w-full"
                        value={formData.city}
                        onChange={value => handleInputChange('city', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Domicilio fiscal</label>
                    <InputDefault
                        placeholder="Ingrese domicilio"
                        className="w-full"
                        value={formData.taxAdress}
                        onChange={value => handleInputChange('taxAdress', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Teléfono</label>
                    <InputDefault
                        placeholder="Ingrese teléfono"
                        className="w-full"
                        value={formData.shopPhone}
                        onChange={value => handleInputChange('shopPhone', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Correo electrónico</label>
                    <InputDefault
                        placeholder="Ingrese correo"
                        className="w-full"
                        value={formData.contactEmail}
                        onChange={value => handleInputChange('contactEmail', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Moneda preferida</label>
                    <SelectDefault
                        placeholder="Seleccionar moneda"
                        className="w-full"
                        options={[
                            { value: 'ARS', label: 'Peso Argentino' },
                            { value: 'USD', label: 'Dólar' },
                            { value: 'EUR', label: 'Euro' },
                            { value: 'BRL', label: 'Real Brasileño' },
                        ]}
                        value={formData.preferredCurrency}
                        onChange={value => handleInputChange('preferredCurrency', value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Idioma principal</label>
                    <SelectDefault
                        placeholder="Seleccionar idioma"
                        className="w-full"
                        options={[
                            { value: 'es', label: 'Español' },
                            { value: 'en', label: 'Inglés' },
                            { value: 'pt', label: 'Portugués' },
                        ]}
                        value={formData.languageMain}
                        onChange={value => handleInputChange('languageMain', value)}
                    />
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="mt-6 flex flex-col gap-2">
                <DesignButton variant="neutral" onClick={() => console.log('Restaurar')}>Restaurar</DesignButton>
                <DesignButton variant="primary" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </DesignButton>
            </div>
        </div>
    );
};
