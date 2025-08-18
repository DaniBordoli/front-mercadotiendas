import { useCheckoutStore } from './CartCheckout';
import { useFirstLayoutStore } from '../stores/firstLayoutStore';
import { useCheckoutStepStore } from '../stores/checkoutStepStore';
import { usePaymentMethodStore } from '../stores/paymentMethodStore';
import * as React from 'react';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import CartFooter from '../components/CartComponents/CartFooter';
import { FaTruck, FaStore, FaCreditCard } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa6";
import { RiCashFill } from "react-icons/ri";
import { DesignButton } from '../components/atoms/DesignButton';
import ProgressBar from '../components/molecules/ProgressBar';
import { FaCheckCircle } from "react-icons/fa";
import { useCartStore } from '../stores/cartStore';
import { usePaymentStore } from '../stores/paymentStore';
import { PaymentData } from '../stores/paymentStore';
import { useEffect } from 'react';
import { useAuthStore } from '../stores';
import { colors } from '../design/colors';

export default function CartSummary() {
    const { shippingMethod } = useCheckoutStore();
    const { paymentMethod, setPaymentMethod } = usePaymentMethodStore();
    const editableVariables = useFirstLayoutStore(state => state.editableVariables);
    const navigate = useNavigate();
    const cartItems = useCartStore(state => state.items);
    const clearCart = useCartStore(state => state.clearCart);
    const setCurrentStep = useCheckoutStepStore(state => state.setCurrentStep);
    
    React.useEffect(() => {
        setCurrentStep(3);
    }, [setCurrentStep]);
    
    // Payment store
    const { createCheckout, isLoading, error, clearPayment } = usePaymentStore();
    const { user } = useAuthStore();

    const groupedByStore = React.useMemo(() => {
        const groups: Record<string, any[]> = {};
        cartItems.forEach(item => {
            const store = item.product.storeName || item.product.shop?.name || '';
            if (!groups[store]) groups[store] = [];
            groups[store].push(item);
        });
        return groups;
    }, [cartItems]);

    const shipping = cartItems.length > 0 ? 15.00 : 0;
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const total = subtotal + shipping;

    const handleConfirmPurchase = async () => {
        if (cartItems.length === 0) {
            alert('No hay productos en el carrito');
            return;
        }

        if (!user) {
            alert('Debes iniciar sesión para continuar con la compra');
            navigate('/login');
            return;
        }

        try {
            // Limpiar errores previos
            clearPayment();

            console.log('=== FRONTEND: Iniciando proceso de pago ===');
            console.log('Items del carrito:', cartItems);
            console.log('Subtotal:', subtotal);
            console.log('Envío:', shipping);
            console.log('Total:', total);

            // Preparar datos del pago
            const paymentData: PaymentData = {
                orderData: {
                    total: total,
                    description: `Compra en MercadoTiendas - ${cartItems.length} producto(s)`,
                    reference: `order_${Date.now()}`
                },
                customerData: {
                    email: user.email,
                    name: user.name || 'Usuario de Prueba',
                    identification: '12345678' // TODO: Obtener del usuario autenticado   
                },
                items: cartItems.map(item => ({
                    name: item.product.name,
                    description: `${item.product.name} - ${item.product.brand || 'MercadoTiendas'}`,
                    quantity: item.quantity,
                    price: item.product.price,
                    image: item.product.imageUrls?.[0] || 'https://via.placeholder.com/150',
                    productId: item.product.id
                }))
            };

            console.log('=== FRONTEND: Datos preparados para enviar al backend ===');
            console.log('PaymentData completo:', JSON.stringify(paymentData, null, 2));

            // Crear checkout con Mobbex
            console.log('=== FRONTEND: Enviando request al backend ===');
            const checkoutResponse = await createCheckout(paymentData);
            
            console.log('=== FRONTEND: Respuesta recibida del backend ===');
            console.log('CheckoutResponse:', JSON.stringify(checkoutResponse, null, 2));
            
            // Añadido para depuración: verificar el contenido de checkoutResponse.data.url justo antes de la condición
            console.log('=== FRONTEND: Verificando checkoutResponse.data.url antes de la condición ===', checkoutResponse.data?.data?.url);

            if (checkoutResponse.success && checkoutResponse.data?.data?.url) {
                console.log('=== FRONTEND: Checkout exitoso, limpiando carrito y abriendo popup de Mobbex ===');
                console.log('URL de redirección:', checkoutResponse.data.data.url);
                
                // Limpiar carrito antes de abrir el popup
                clearCart();
                
                // Abrir Mobbex en un popup
                const mobbexWindow = window.open(
                    checkoutResponse.data.data.url,
                    'MobbexPago',
                    'width=600,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
                );
                if (!mobbexWindow) {
                    alert('El navegador ha bloqueado la ventana emergente. Por favor, permite popups para continuar con el pago.');
                    return;
                }
                // Monitorear el cierre del popup
                const popupInterval = setInterval(() => {
                    if (mobbexWindow.closed) {
                        clearInterval(popupInterval);
                        // Eliminado: navigate('/payment/return');
                        // Ya no se navega automáticamente, solo se limpia el intervalo
                    }
                }, 700);
            } else {
                console.error('=== FRONTEND: Error en la respuesta del checkout ===');
                console.error('Respuesta:', checkoutResponse);
                throw new Error('Error al crear el checkout de pago');
            }
        } catch (error) {
            console.error('=== FRONTEND: Error en handleConfirmPurchase ===');
            console.error('Error completo:', error);
            console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
            alert(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    };

    useEffect(() => {
        function handlePaymentMessage(event: MessageEvent) {
            // Validar el origen en producción
            if (event.data && event.data.source === 'mobbex-payment') {
                const { status, type, transactionId } = event.data;
                navigate(`/payment/return?status=${status}&type=${type || ''}&transactionId=${transactionId}`);
            }
        }
        window.addEventListener('message', handlePaymentMessage);
        return () => {
            window.removeEventListener('message', handlePaymentMessage);
        };
    }, [navigate]);

    return (
        <>
   
            <div
                className="flex items-center px-6 py-3 border-b border-gray-200 bg-white cursor-pointer"
                onClick={() => navigate('/dashboard')}
            >
                <Logo size={28}/>
                <span className="ml-3 text-xl font-space tracking-wide">
                    Mercado Tiendas
                </span>
            </div>
     
            <div className="bg-[#f8f8f8] min-h-screen pt-8 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <ProgressBar currentStep={3} />
                    
                    {/* Page Header */}
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Resumen del pedido</h1>
                        <p className="text-[#666666]">Revisá tu pedido y confirmá la compra</p>
                    </div>

                    <div className="grid lg:grid-cols-10 gap-8">
                        {/* Order Details - Left Column */}
                        <div className="lg:col-span-7">
                            {/* Payment Method Section */}
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-[#1c1c1e] mb-6">Método de pago</h3>
                                    
                                    <div className="space-y-4">
                                        {/* Credit Card */}
                                        <label className="block cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="tarjeta" 
                                                checked={paymentMethod === 'tarjeta'} 
                                                onChange={() => setPaymentMethod('tarjeta')}
                                                className="sr-only" 
                                            />
                                            <div className={`border-2 ${paymentMethod === 'tarjeta' ? 'border-[#ff4f41] bg-[#ff4f41]/5' : 'border-[#e5e5e7] bg-white'} rounded-lg p-4 transition-all hover:shadow-md`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-[#1a1a1a] rounded-lg flex items-center justify-center mr-4">
                                                            <FaCcVisa className="text-white text-xl" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-[#1c1c1e]">Tarjeta de crédito</h5>
                                                            <p className="text-sm text-[#666666]">Pago seguro • Hasta 12 cuotas sin interés</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>

                                        {/* Bank Transfer */}
                                        <label className="block cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="transferencia" 
                                                checked={paymentMethod === 'transferencia'} 
                                                onChange={() => setPaymentMethod('transferencia')}
                                                className="sr-only" 
                                            />
                                            <div className={`border-2 ${paymentMethod === 'transferencia' ? 'border-[#ff4f41] bg-[#ff4f41]/5' : 'border-[#e5e5e7] bg-white'} rounded-lg p-4 transition-all hover:shadow-md hover:border-[#ff4f41] hover:bg-[#ff4f41]/5`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 bg-[#ff4f41] rounded-lg flex items-center justify-center mr-4">
                                                            <RiCashFill className="text-white text-xl" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-[#1c1c1e]">Transferencia bancaria</h5>
                                                            <p className="text-sm text-[#666666]">Acreditación inmediata • Sin comisiones</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                       
                            {/* Order Items */}
                            {cartItems.length === 0 ? (
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] p-8 text-center text-[#666666]">
                                    No hay productos en el carrito.
                                </div>
                            ) : (
                                Object.entries(groupedByStore).map(([storeName, items]) => (
                                    <div key={storeName} className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6">
                                        {/* Store Header */}
                                        <div className="p-6 border-b border-[#e5e5e7] flex items-center">
                                            <img 
                                                className="w-12 h-12 rounded-full object-cover" 
                                                src={items[0]?.product?.shop?.imageUrl || editableVariables.logoUrl || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'} 
                                                alt={storeName}
                                            />
                                            <div className="ml-4">
                                                <h3 className="font-semibold text-[#1c1c1e] text-lg">{storeName}</h3>
                                                <div className="flex items-center gap-2">
                                                    {items[0]?.product?.shop?.active !== false && (
                                                        <div className="px-2 py-1 bg-[#00a699]/10 rounded-full">
                                                            <span className="text-xs text-[#00a699] font-medium">Vendedor verificado</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Products */}
                                        <div className="p-6 border-b border-[#e5e5e7]">
                                            <h4 className="font-semibold text-[#1c1c1e] mb-4">Productos</h4>
                                            <div className="space-y-4">
                                                {items.map(item => (
                                                    <div key={item.product.id} className="flex items-start gap-4 p-4 bg-[#f8f8f8] rounded-lg">
                                                        <img 
                                                            className="w-16 h-16 object-cover rounded-lg" 
                                                            src={item.product.imageUrls?.[0] || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/714d0225c5-31abc0e6860d5da99410.png'} 
                                                            alt={item.product.name}
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-[#1c1c1e]">{item.product.name}</p>
                                                            <p className="text-sm text-[#666666] mb-1">{item.product.descripcion || 'Producto de calidad'}</p>
                                                            <p className="text-sm text-[#666666]">Cantidad: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-semibold text-[#1c1c1e]">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Method */}
                                        <div className="p-6">
                                            <h4 className="font-semibold text-[#1c1c1e] mb-4">Método de envío</h4>
                                            <div className="flex items-center justify-between p-4 bg-[#f8f8f8] rounded-lg">
                                                <div className="flex items-center">
                                                    {shippingMethod === 'domicilio' ? (
                                                        <>
                                                            <div className="w-10 h-10 bg-[#ff4f41] rounded-lg flex items-center justify-center mr-3">
                                                                <FaTruck className="text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-[#1c1c1e]">Envío a domicilio</p>
                                                                <p className="text-sm text-[#666666]">3-5 días hábiles</p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="w-10 h-10 bg-[#00a699] rounded-lg flex items-center justify-center mr-3">
                                                                <FaStore className="text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-[#1c1c1e]">Retiro en tienda</p>
                                                                <p className="text-sm text-[#666666]">Disponible hoy</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-[#1c1c1e]">{shippingMethod === 'domicilio' ? `$${shipping.toFixed(2)}` : 'Gratis'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Order Summary - Right Column */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] p-6 sticky top-8">
                                <h3 className="text-xl font-bold text-[#1c1c1e] mb-6">Resumen del pedido</h3>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#666666]">Subtotal</span>
                                        <span className="text-[#1c1c1e]">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#666666]">Envío</span>
                                        <span className="text-[#1c1c1e]">${shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-[#e5e5e7] pt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-bold text-[#1c1c1e]">Total</span>
                                            <span className="text-2xl font-bold text-[#ff4f41]">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <DesignButton
                                    variant="primary"
                                    className="w-full mb-4"
                                    onClick={handleConfirmPurchase}
                                    disabled={isLoading || cartItems.length === 0}
                                >
                                    {isLoading ? 'Procesando...' : 'Confirmar compra'}
                                </DesignButton>
                                
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-600 text-sm text-center">{error}</p>
                                    </div>
                                )}
                                
                                {/* Trust Messages */}
                                <div className="space-y-2 text-sm text-[#666666]">
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2">🔒</span>
                                        <span>Pago seguro</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2">📞</span>
                                        <span>Devolución garantizada</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[#00a699] mr-2">🕐</span>
                                        <span>Atención 24/7</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <CartFooter />
        </>
    );
}
