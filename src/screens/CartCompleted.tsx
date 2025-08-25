import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { DesignButton } from '../components/atoms/DesignButton';
import { FaCheckCircle, FaStore, FaCcVisa } from "react-icons/fa";
import { useCartStore } from '../stores/cartStore';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import ProgressBar from '../components/molecules/ProgressBar';
import { useCheckoutStepStore } from '../stores/checkoutStepStore';

export default function CartCompleted() {
    const navigate = useNavigate();
    const setCurrentStep = useCheckoutStepStore(state => state.setCurrentStep);
    
    React.useEffect(() => {
        setCurrentStep(4);
    }, [setCurrentStep]);

    return (
        <>
            <Navbar />
            
            {/* Main Content */}
            <main className="pt-20 pb-16 bg-[#f8f8f8]">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Progress Bar */}
                    <ProgressBar currentStep={4} />

                    {/* Success Header with Background */}
                    <div className="relative text-center pb-8 mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00a699]/5 via-[#00a699]/10 to-[#00a699]/5 rounded-2xl"></div>
                        <div className="relative py-12">
                            <div className="w-32 h-32 bg-[#00a699] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                                <FaCheckCircle className="text-5xl text-white" />
                            </div>
                            <h1 className="text-5xl font-bold font-space text-[#1c1c1e] mb-4">¡Gracias por tu compra!</h1>
                            <p className="text-xl text-[#666666] mb-4">Tu pedido ha sido confirmado y será procesado pronto.</p>
                            <div className="inline-block px-4 py-2 bg-white rounded-lg shadow-sm border border-[#e5e5e7]">
                                <span className="text-lg font-semibold text-[#1c1c1e]">Pedido #MT198283</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-10 gap-8">
                        {/* Order Details - Left Column */}
                        <div className="lg:col-span-7">
                            {/* Order Summary */}
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6">
                                <div className="p-4 md:p-6">
                                    <h3 className="text-xl md:text-2xl font-semibold text-[#1c1c1e] mb-4 md:mb-6">Resumen del pedido</h3>
                                    
                                    {/* Store 1 */}
                                    <div className="border border-[#e5e5e7] rounded-lg p-3 md:p-4 mb-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-[#00a699] rounded-full flex items-center justify-center mr-3">
                                                    <FaStore className="text-white text-sm" />
                                                </div>
                                                <h4 className="font-semibold text-[#1c1c1e]">TechStore Pro</h4>
                                            </div>
                                            <span className="px-3 py-1 bg-[#00a699]/10 text-[#00a699] text-xs font-medium rounded-full self-start sm:ml-2">Vendedor verificado</span>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <img className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover mr-3 sm:mr-4" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/714d0225c5-3d732a04d081772f443b.png" alt="wireless bluetooth headphones modern design" />
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-medium text-[#1c1c1e] mb-1 text-sm sm:text-base">Auriculares Bluetooth Premium</h5>
                                                        <p className="text-xs sm:text-sm text-[#666666]">Color: Negro • Garantía: 2 años</p>
                                                        <p className="text-xs sm:text-sm text-[#666666]">Cantidad: 1</p>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left">
                                                    <p className="font-semibold text-base sm:text-lg text-[#1c1c1e]">$299.99</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <img className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover mr-3 sm:mr-4" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/3ec47778f1-4a8ae3017f9a5c4e3146.png" alt="smartphone case protective modern design" />
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-medium text-[#1c1c1e] mb-1 text-sm sm:text-base">Funda Protectora iPhone</h5>
                                                        <p className="text-xs sm:text-sm text-[#666666]">Color: Transparente • Material: Silicona</p>
                                                        <p className="text-xs sm:text-sm text-[#666666]">Cantidad: 2</p>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left">
                                                    <p className="font-semibold text-base sm:text-lg text-[#1c1c1e]">$39.98</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Store 2 */}
                                    <div className="border border-[#e5e5e7] rounded-lg p-3 md:p-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-[#ff4f41] rounded-full flex items-center justify-center mr-3">
                                                    <FaStore className="text-white text-sm" />
                                                </div>
                                                <h4 className="font-semibold text-[#1c1c1e]">Fashion Hub</h4>
                                            </div>
                                            <span className="px-3 py-1 bg-[#ff4f41]/10 text-[#ff4f41] text-xs font-medium rounded-full self-start sm:ml-2">Especialista en moda</span>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex items-center flex-1">
                                                    <img className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover mr-3 sm:mr-4" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/1c8679db40-faa44f00aec070b66916.png" alt="stylish leather watch classic design" />
                                                    <div className="flex-1 min-w-0">
                                                        <h5 className="font-medium text-[#1c1c1e] mb-1 text-sm sm:text-base">Reloj Clásico Cuero</h5>
                                                        <p className="text-xs sm:text-sm text-[#666666]">Color: Marrón • Correa: Cuero genuino</p>
                                                        <p className="text-xs sm:text-sm text-[#666666]">Cantidad: 1</p>
                                                    </div>
                                                </div>
                                                <div className="text-right sm:text-left">
                                                    <p className="font-semibold text-base sm:text-lg text-[#1c1c1e]">$99.99</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Shipping Info */}
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6 lg:mb-8">
                                <div className="p-4 md:p-6">
                                    <h3 className="text-xl md:text-2xl font-semibold text-[#1c1c1e] mb-4 md:mb-6">Información del pedido</h3>
                                    
                                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                                        <div>
                                            <h4 className="font-semibold text-[#1c1c1e] mb-3 md:mb-4">Método de pago</h4>
                                            <div className="flex items-start sm:items-center">
                                                <FaCcVisa className="text-2xl sm:text-3xl text-blue-600 mr-3 sm:mr-4 mt-1 sm:mt-0" />
                                                <div className="flex-1">
                                                    <p className="text-[#1c1c1e] font-medium text-sm sm:text-base">Visa terminada en 4242</p>
                                                    <div className="flex items-center mt-1">
                                                        <span className="inline-block px-2 py-1 bg-[#00a699]/10 text-[#00a699] text-xs font-medium rounded-full">
                                                            <i className="fa-solid fa-check mr-1"></i>Pago procesado exitosamente
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <h4 className="font-semibold text-[#1c1c1e] mb-3 md:mb-4">Dirección de envío</h4>
                                            <div className="text-[#666666] text-sm sm:text-base">
                                                <p className="font-medium text-[#1c1c1e]">Juan Pérez</p>
                                                <p>Av. Corrientes 1234, Piso 5, Depto B</p>
                                                <p>Buenos Aires, CABA</p>
                                                <p>C1043AAZ, Argentina</p>
                                                <p className="mt-2 text-xs sm:text-sm">Tel: +54 11 1234-5678</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Right Column */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] p-4 md:p-6 lg:sticky lg:top-8">
                                <h3 className="text-lg md:text-xl font-bold text-[#1c1c1e] mb-4 md:mb-6">Resumen de compra</h3>
                                
                                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-[#666666]">Subtotal (3 productos)</span>
                                        <span className="text-[#1c1c1e]">$439.96</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-[#666666]">Envío</span>
                                        <span className="text-[#1c1c1e]">$15.99</span>
                                    </div>
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-[#666666]">Impuestos</span>
                                        <span className="text-[#1c1c1e]">$52.88</span>
                                    </div>
                                    
                                    <div className="bg-[#00a699]/10 rounded-lg p-2 md:p-3">
                                        <div className="flex items-center text-[#00a699]">
                                            <span className="text-xs sm:text-sm font-medium">💰 Ahorraste</span>
                                            <span className="ml-auto font-bold text-sm sm:text-base">$25.50</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="border-t border-[#e5e5e7] pt-3 md:pt-4">
                                    <div className="flex justify-between items-center mb-4 md:mb-6">
                                        <span className="text-base md:text-lg font-bold text-[#1c1c1e]">Total pagado</span>
                                        <span className="text-xl md:text-2xl font-bold text-[#00a699]">$483.33</span>
                                    </div>
                                </div>
                                
                                {/* Trust Messages */}
                                <div className="space-y-2 md:space-y-3 text-xs sm:text-sm text-[#666666]">
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2 md:mr-3">🔒</span>
                                        <span>Compra protegida</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2 md:mr-3">📧</span>
                                        <span>Confirmación enviada por email</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2 md:mr-3">📱</span>
                                        <span>Seguimiento en tiempo real</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2 md:mr-3">🕐</span>
                                        <span>Atención 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Buttons - Moved to bottom for mobile */}
                    <div className="mt-8 mb-8">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <DesignButton
                                variant="primary"
                                className="flex-1 w-full"
                                onClick={() => navigate('/dashboard')}
                            >
                                Seguir comprando
                            </DesignButton>
                            <DesignButton
                                variant="neutral"
                                className="flex-1 w-full"
                                onClick={() => navigate('/')}
                            >
                                Ir al inicio
                            </DesignButton>
                        </div>
                    </div>
                </div>
            </main>
            
            <FooterHome />
        </>
    );
}
