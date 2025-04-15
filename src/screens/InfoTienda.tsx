import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { LabeledInputField } from '../components/atoms/LabeledInputField';
import { Button } from '../components/atoms/Button';
import { useAuthStore } from '../stores';
import { useShopStore } from '../stores';
import Toast from '../components/atoms/Toast';

const InfoTienda = () => {
    const [shopData, setShopData] = useState({
        email: '',
        shopName: '',
        category: '',
        brandName: '',
        contactEmail: '',
        address: '',
        shopPhone: ''
    });

    const [toast, setToast] = useState({
        show: false,
        message: '',
        type: 'success' as 'success' | 'error' | 'info'
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
        if (user?.shop) {
            setShopData({
                email: user.email || '',
                shopName: user.shop.name || '',
                category: user.shop.category || '',
                brandName: user.shop.brandName || '',
                contactEmail: user.shop.contactEmail || '',
                address: user.shop.address || '',
                shopPhone: user.shop.shopPhone || ''
            });

            // Si el usuario ya tiene una imagen de tienda, mostrarla
            if (user.shop.imageUrl) {
                setImagePreview(user.shop.imageUrl);
            }
        }
    }, [user]);

    const handleInputChange = (name: string) => (value: string) => {
        setShopData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño del archivo
        if (file.size > MAX_FILE_SIZE) {
            setToast({
                show: true,
                message: 'La imagen no debe superar los 10MB',
                type: 'error'
            });
            e.target.value = ''; // Limpiar input
            return;
        }

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setToast({
                show: true,
                message: 'Por favor selecciona un archivo de imagen válido',
                type: 'error'
            });
            e.target.value = '';
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };

        reader.onerror = () => {
            setToast({
                show: true,
                message: 'Error al cargar la imagen',
                type: 'error'
            });
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const updateShopInfo = useShopStore(state => state.updateShopInfo);
    const loading = useShopStore(state => state.loading);
    const error = useShopStore(state => state.error);

    const handleSubmit = async () => {
        if (!user?.shop?._id) {
            setToast({
                show: true,
                message: 'No se encontró información de la tienda',
                type: 'error'
            });
            return;
        }


        try {
            // Preparamos los datos para enviar
            const shopUpdateData = {
                name: shopData.brandName,
                contactEmail: shopData.contactEmail,
                address: shopData.address,
                shopPhone: shopData.shopPhone,
                brandName: shopData.brandName
            };

            // Llamamos a la API para actualizar la tienda
            await updateShopInfo(user.shop._id, shopUpdateData, imageFile || undefined);
            
            setToast({
                show: true,
                message: 'Información de la tienda actualizada correctamente',
                type: 'success'
            });
        } catch (error) {
            console.error('Error al actualizar la tienda:', error);
            setToast({
                show: true,
                message: 'Error al actualizar la información de la tienda',
                type: 'error'
            });
        } finally {
        }
    };
    return (
        <>
            <div>
                <Sidebar />
                <main className='ml-60 p-20'>
                    <h1 className='text-3xl font-medium mb-6'>Información de mi tienda</h1>
                    <div className='bg-white w-full p-6 rounded shadow'>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="email" 
                                label="Usuario" 
                                placeholder="email@email.com" 
                                value={shopData.email} 
                                onChange={handleInputChange("email")} 
                                disabled={true} 
                            />
                            <p className='text-sm  mb-4 text-gray-500'>Email registrado para iniciar sesión en tu panel</p>
                        </div>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="shopName" 
                                label="Nombre de la Tienda (editable)" 
                                placeholder="Mi Tienda" 
                                value={shopData.shopName} 
                                onChange={handleInputChange("shopName")} 
                            />
                            <p className='text-sm mb-4 text-gray-500'>Nombre de tu tienda online</p>
                        </div>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="category" 
                                label="Categoría (editable)" 
                                placeholder="Ej: Ropa, Electrónica, etc." 
                                value={shopData.category} 
                                onChange={handleInputChange("category")} 
                            />
                            <p className='text-sm mb-4 text-gray-500'>Categoría principal de tus productos</p>
                        </div>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="brandName" 
                                label="Nombre de la Marca (editable)" 
                                placeholder="Mi marca" 
                                value={shopData.brandName} 
                                onChange={handleInputChange("brandName")} 
                            />
                            <p className='text-sm mb-4 text-gray-500'>Nombre de tu negocio</p>
                        </div>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="contactEmail" 
                                label="Email de contacto (editable)" 
                                placeholder="mimarca@email.com" 
                                value={shopData.contactEmail} 
                                onChange={handleInputChange("contactEmail")} 
                            />
                            <p className='text-sm  mb-4 text-gray-500'>Email que aparecerá en la parte inferior de tu tienda. Allí te llegarán todas las notificaciones (ventas, consultas, etc.).</p>
                        </div>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="address" 
                                label="Dirección de la tienda (opcional)" 
                                placeholder="Ej Libertador 1892, CABA, Buenos Aires" 
                                value={shopData.address} 
                                onChange={handleInputChange("address")} 
                            />
                            <p className='text-sm mb-4 text-gray-500'>Aparecerá en la parte inferior de tu tienda</p>
                        </div>
                        <div>
                            <LabeledInputField 
                                type="text" 
                                name="shopPhone" 
                                label="Teléfono de la tienda (opcional)" 
                                placeholder="Ej 1122334455" 
                                value={shopData.shopPhone} 
                                onChange={handleInputChange("shopPhone")} 
                            />
                            <p className='text-sm mb-4 text-gray-500'>Aparecerá en la parte inferior de tu tienda</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Logo de la tienda (opcional)
                            </label>
                            <div className="mt-1 flex items-center space-x-4">
                                <div className="relative group">
                                    <div className="flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden bg-gray-100 transition-transform duration-200 ease-in-out group-hover:scale-[1.02]">
                                        {imagePreview ? (
                                            <>
                                                <img
                                                    src={imagePreview}
                                                    alt="Vista previa"
                                                    className="h-24 w-24 object-cover transition-opacity duration-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                                >
                                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="h-24 w-24 flex items-center justify-center bg-gray-50">
                                                <svg
                                                    className="h-12 w-12 text-gray-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 48 48"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="image-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-sky-500"
                                    >
                                        <span>Subir imagen</span>
                                        <input
                                            id="image-upload"
                                            name="image-upload"
                                            type="file"
                                            className="sr-only"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                PNG, JPG, GIF hasta 10MB. Este logo aparecerá en tu tienda.
                            </p>
                        </div>
                    </div>
                        <Button 
                            variant="primary" 
                            className="mt-6 w-60 bg-sky-500 hover:bg-sky-600 text-white"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </Button>
                </main> 
            </div>
        <Toast 
            show={toast.show}
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, show: false }))}
            duration={3000}
        />
    </>
);
};

export default InfoTienda;
