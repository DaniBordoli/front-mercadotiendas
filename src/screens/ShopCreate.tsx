import * as React from 'react';
import { colors } from '../design/colors';
import { FaArrowRight } from "react-icons/fa6";
import { DesignButton } from '../components/atoms/DesignButton';
import DesignSelectionForm from '../components/CreateShopComponents/DesignSelectionForm';
import MainForm from '../components/CreateShopComponents/MainForm';
import ProductSelectionForm from '../components/CreateShopComponents/ProductSelectionForm';
import PaymentSelectionForm from '../components/CreateShopComponents/PaymentSelectionForm';
import ColorBrandForm from '../components/CreateShopComponents/ColorBrandForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useShopStore } from '../stores';
import { Navbar } from '../components/organisms/Navbar/Navbar';

interface FormData {
    storeName: string;
    email: string;
    design: string | null;
    productCategory: string;
    currency: string;
    layoutDesign: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    logoUrl?: string;
    logoFile?: File;
}

const ShopCreate: React.FC = () => {
    const [currentStep, setCurrentStep] = React.useState(0);
    const [formData, setFormData] = React.useState<FormData>({
        storeName: '',
        email: '',
        design: null,
        productCategory: '',
        currency: '',
        layoutDesign: '',
        primaryColor: '',
        secondaryColor: '',
        accentColor: '',
        logoUrl: '',
        logoFile: undefined,
    });

    const [subdomainError, setSubdomainError] = React.useState<string | null>(null);

    const navigate = useNavigate();
    const { createShop, setShop, loading, error } = useShopStore();

    const handleNextStep = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
    };

    // Nuevo handler para guardar el layout seleccionado
    const handleApplyLayoutName = (layoutName: string) => {
        setFormData((prev) => ({ ...prev, layoutDesign: layoutName }));
    };

    const handleCreateShop = async () => {
        setSubdomainError(null);
        try {
            // Generar subdominio válido
            let subdomain = formData.storeName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos
                .replace(/[^a-z0-9-]+/g, '-') // Solo minúsculas, números y guiones
                .replace(/^-+|-+$/g, '') // Sin guiones al inicio/final
                .replace(/--+/g, '-'); // Sin guiones dobles
            // Limitar longitud
            if (subdomain.length > 30) subdomain = subdomain.slice(0, 30);
            // Eliminar guiones al final/inicio tras recorte
            subdomain = subdomain.replace(/^-+|-+$/g, '');
            // Si es menor a 3, rellenar con letras/números
            if (subdomain.length < 3) {
                subdomain = (subdomain + 'tienda').slice(0, 3);
            }
            // Validar regex final
            const subdomainRegex = /^[a-z0-9-]{3,30}$/;
            if (!subdomainRegex.test(subdomain)) {
                setSubdomainError('El subdominio generado es inválido. Usa solo minúsculas, números y guiones, entre 3 y 30 caracteres.');
                return;
            }
            const shopData = {
                shopName: formData.storeName,
                subdomain,
                template: formData.design || 'modern',
                category: formData.productCategory,
                address: 'N/A',
                brandName: formData.storeName,
                contactEmail: formData.email,
                shopPhone: 'N/A',
                layoutDesign: formData.layoutDesign || '',
                primaryColor: formData.primaryColor,
                secondaryColor: formData.secondaryColor,
                accentColor: formData.accentColor,
                logoUrl: formData.logoUrl,
                image: formData.logoFile, 
            };
            await createShop(shopData);
            navigate('/dashboard');
        } catch (e) {
            console.error(e);
        }
    };

    const steps = ['Información', 'Diseño', 'Colores y Marca', 'Productos', 'Pagos', 'Finalizar'];

    return (
        <>
            <div className='fixed top-0 left-0 w-full z-50'>
                <Navbar />
            </div>
            <div className="min-h-screen flex justify-center pt-20">
                <div className="flex flex-col flex-grow p-10 max-w-7xl">
                    <h1 className="text-2xl font-space font-medium mt-20 text-gray-800 mb-6">Crea tu Tienda Online</h1>
                    <p className='text-gray-600 my-4 w-10/12'>Configura tu tienda en minutos y empieza a vender con nuestra plataforma potenciada por IA</p>
                    
                    <div className="flex flex-col items-center my-8">
                        <div className="flex justify-between w-full items-center relative">
                            {steps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center w-1/6 relative">
                                    <div
                                        className="w-8 h-8 flex items-center justify-center rounded-full font-space mb-2"
                                        style={{
                                            backgroundColor: index === currentStep ? colors.primaryRed : '#F8F8F8',
                                            border: index === currentStep ? 'none' : '2px solid #E5E5E7',
                                            color: index === currentStep ? 'white' : '#1F2937', 
                                            zIndex: 1, 
                                        }}
                                    >
                                        {index + 1}
                                    </div>
                                    <span
                                        className="text-sm font-space"
                                        style={{
                                            color: index === currentStep ? colors.primaryRed : colors.mediumGray,
                                        }}
                                    >
                                        {step}
                                    </span>
                                </div>
                            ))}
                            <div className="absolute top-4 w-full h-[4px]" style={{ backgroundColor: colors.primaryRed, zIndex: 0 }}></div>
                        </div>
                    </div>

                    <div className="w-full max-w-4xl mx-auto">
                        {currentStep === 0 && (
                            <MainForm 
                                onNext={(data: { storeName: string; email: string }) => 
                                    handleNextStep({ storeName: data.storeName, email: data.email })
                                }
                            />
                        )}
                        {currentStep === 1 && (
                            <DesignSelectionForm 
                                onApply={() => handleNextStep({ design: 'modern' })}
                                onApplyLayoutName={handleApplyLayoutName}
                            />
                        )}
                        {currentStep === 2 && (
                            <ColorBrandForm 
                                onNext={(data: { primaryColor: string; secondaryColor: string; accentColor: string; logoUrl?: string; logoFile?: File }) => 
                                    handleNextStep({ 
                                        primaryColor: data.primaryColor,
                                        secondaryColor: data.secondaryColor,
                                        accentColor: data.accentColor,
                                        logoUrl: data.logoUrl,
                                        logoFile: data.logoFile
                                    })
                                }
                                initialColors={{
                                    primaryColor: formData.primaryColor,
                                    secondaryColor: formData.secondaryColor,
                                    accentColor: formData.accentColor,
                                }}
                            />
                        )}
                        {currentStep === 3 && (
                            <ProductSelectionForm 
                                onNext={(data: string) => handleNextStep({ productCategory: data })}
                            />
                        )}
                        {currentStep === 4 && (
                            <PaymentSelectionForm 
                                onNext={(data: string) => handleNextStep({ currency: data })}
                            />
                        )}
                        {currentStep === 5 && (
                            <div className="text-center">
                                <h2 className="text-xl font-space font-medium text-gray-800 mb-4">¡Todo listo!</h2>
                                <p className="text-gray-600 mb-6">Revisa la información y haz clic en "Crear Tienda" para finalizar.</p>
                                <DesignButton 
                                    variant="primary" 
                                    fullWidth={true} 
                                    onClick={handleCreateShop}
                                    disabled={loading}
                                >
                                    {loading ? 'Creando...' : 'Crear Tienda'}
                                </DesignButton>
                                {subdomainError && (
                                    <p className="text-red-500 text-sm mt-4">{subdomainError}</p>
                                )}
                                {error && !subdomainError && (
                                    <p className="text-red-500 text-sm mt-4">{error}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ShopCreate;
