import * as React from 'react';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import CartFooter from '../components/CartComponents/CartFooter';
import { FaTruck } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa6";
import { DesignButton } from '../components/atoms/DesignButton';
import { FaCheckCircle } from "react-icons/fa";
import { useCartStore } from '../stores/cartStore';
import { usePaymentStore } from '../stores/paymentStore';
import { PaymentData } from '../stores/paymentStore';
import { useEffect } from 'react';
import { useAuthStore } from '../stores';

export default function CartSummary() {
    const navigate = useNavigate();
    const cartItems = useCartStore(state => state.items);
    const clearCart = useCartStore(state => state.clearCart);
    
    // Payment store
    const { createCheckout, isLoading, error, clearPayment } = usePaymentStore();
    const { user } = useAuthStore();

    const groupedByStore = React.useMemo(() => {
        const groups: Record<string, typeof cartItems> = {};
        cartItems.forEach(item => {
            const store = item.product.storeName || 'Tienda';
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
     
            <div className="bg-gray-50 min-h-screen py-8 px-2 md:px-0 flex justify-center">
                <div className="w-full max-w-7xl">
               
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-8">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center font-bold">1</div>
                            </div>
                            <div className="w-16 h-0.5 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center font-bold">2</div>
                            </div>
                            <div className="w-16 h-0.5 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center font-bold">3</div>
                            </div>
                            <div className="w-16 h-0.5 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">4</div>
                            </div>
                        </div>
                    </div>
                   
                    <div className="rounded-xl p-6 mb-8">
                       
                        {cartItems.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                                No hay productos en el carrito.
                            </div>
                        ) : (
                            Object.entries(groupedByStore).map(([storeName, items]) => (
                                <div key={storeName} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={items[0].product.imageUrls?.[0] || ''}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <div className="font-space text-gray-800">{storeName}</div>
                                            <StatusTags status="Active" className="mt-1 text-xs" />
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg px-6 py-4 mb-4">
                                        <div className="font-space text-gray-700 mb-2">Productos</div>
                                        {items.map(item => (
                                            <div key={item.product.id} className="flex font-space justify-between text-sm mb-1">
                                                <span>{item.product.name} ({item.quantity}x)</span>
                                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                 
                                    <div className="bg-gray-50 rounded-lg px-6 py-4 mb-4">
                                        <div className="text-gray-700 font-space mb-2">Método de envío</div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm">
                                                <FaTruck className="font-space text-gray-500" />
                                                <span>Envío a domicilio</span>
                                            </div>
                                            <span>${shipping.toFixed(2)}</span>
                                        </div>
                                    </div>
                                
                                    <div className="bg-gray-50 rounded-lg px-6 py-4 mb-4">
                                        <div className=" text-gray-700 font-space mb-2">Método de pago</div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <FaCcVisa className="text-black" />
                                            <span className='font-space'>Visa terminada en 4242</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                            <div className="pt-2">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 font-space">Subtotal</span>
                                    <span className="text-gray-700 font-space">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 font-space">Envío</span>
                                    <span className="text-gray-700 font-space">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-space text-base mt-2">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                     
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                           
                            <div className="flex-1 bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-base font-space">Order Total</span>
                                    <span className="text-2xl font-bold font-space">${total.toFixed(2)}</span>
                                </div>
                                <DesignButton
                                    variant="primary"
                                    className="w-full"
                                    style={{ backgroundColor: '#FF4F41', color: '#fff' }}
                                    onClick={handleConfirmPurchase}
                                    disabled={isLoading || cartItems.length === 0}
                                >
                                    {isLoading ? 'Procesando...' : 'Confirmar compra'}
                                </DesignButton>
                                {error && (
                                    <div className="mt-2 text-red-600 text-sm text-center">
                                        {error}
                                    </div>
                                )}
                            </div>
                         
                            <div className="w-full md:w-72 bg-gray-100 rounded-lg p-6">
                                <div className="font-space font-semibold mb-3">Completed Steps</div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                        <FaCheckCircle className="text-teal-500" />
                                        Shopping Cart Review
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                        <FaCheckCircle className="text-teal-500" />
                                        Login & Authentication
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                        <FaCheckCircle className="text-teal-500" />
                                        Shipping & Payment
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                        <FaCheckCircle className="text-teal-500" />
                                        Order Review
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CartFooter />
        </>
    );
}
