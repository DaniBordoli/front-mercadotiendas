import * as React from 'react';
import { colors } from '../design/colors';
import { FaArrowRight } from "react-icons/fa6";
import { DesignButton } from '../components/atoms/DesignButton';
import DesignSelectionForm from '../components/CreateShopComponents/DesignSelectionForm';
import MainForm from '../components/CreateShopComponents/MainForm';
import ProductSelectionForm from '../components/CreateShopComponents/ProductSelectionForm';
import PaymentSelectionForm from '../components/CreateShopComponents/PaymentSelectionForm';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { Navbar } from '../components/organisms/Navbar/Navbar';

interface FormData {
    storeName: string;
    email: string;
    design: string | null;
    productCategory: string;
    currency: string;
    layoutDesign?: string; 
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
    });

    const navigate = useNavigate();
    const { createShop, isLoading, error, clearError } = useAuthStore();

    const handleNextStep = (data: Partial<FormData>) => {
        setFormData((prev) => ({ ...prev, ...data }));
        setCurrentStep((prevStep) => (prevStep < 4 ? prevStep + 1 : prevStep));
    };

    // Nuevo handler para guardar el layout seleccionado
    const handleApplyLayoutName = (layoutName: string) => {
        setFormData((prev) => ({ ...prev, layoutDesign: layoutName }));
    };

    const handleCreateShop = async () => {
        try {
            const shopData = {
                shopName: formData.storeName,
                subdomain: formData.storeName.toLowerCase().replace(/\s+/g, '-'),
                template: formData.design || 'modern',
                category: formData.productCategory,
                address: 'N/A',
                brandName: formData.storeName,
                contactEmail: formData.email,
                shopPhone: 'N/A',
                layoutDesign: formData.layoutDesign || '',
            };
            await createShop(shopData);
            navigate('/dashboard');
        } catch (e) {
            console.error(e);
        }
    };

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
                            {['Información', 'Diseño', 'Productos', 'Pagos', 'Finalizar'].map((step, index) => (
                                <div key={index} className="flex flex-col items-center w-1/5 relative">
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
                            <ProductSelectionForm 
                                onNext={(data: string) => handleNextStep({ productCategory: data })}
                            />
                        )}
                        {currentStep === 3 && (
                            <PaymentSelectionForm 
                                onNext={(data: string) => handleNextStep({ currency: data })}
                            />
                        )}
                        {currentStep === 4 && (
                            <div className="text-center">
                                <h2 className="text-xl font-space font-medium text-gray-800 mb-4">¡Todo listo!</h2>
                                <p className="text-gray-600 mb-6">Revisa la información y haz clic en "Crear Tienda" para finalizar.</p>
                                <DesignButton 
                                    variant="primary" 
                                    fullWidth={true} 
                                    onClick={handleCreateShop}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Creando...' : 'Crear Tienda'}
                                </DesignButton>
                                {error && (
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
