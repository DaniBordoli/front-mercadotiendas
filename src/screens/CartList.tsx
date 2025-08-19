import * as React from 'react';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import { FaRegTrashAlt } from "react-icons/fa";
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaShoppingCart } from "react-icons/fa";
import LoginModal from '../components/CartComponents/LoginModal';
import { useAuthStore } from '../stores/slices/authSlice';
import { useCartStore } from '../stores/cartStore';
import { useFirstLayoutStore } from '../stores/firstLayoutStore';
import { useCheckoutStepStore } from '../stores/checkoutStepStore';
import ProgressBar from '../components/molecules/ProgressBar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

export default function CartList() {
    const editableVariables = useFirstLayoutStore(state => state.editableVariables);
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const cartItems = useCartStore(state => state.items);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const updateQuantity = useCartStore(state => state.updateQuantity);
    const setCurrentStep = useCheckoutStepStore(state => state.setCurrentStep);
    
    React.useEffect(() => {
        setCurrentStep(1);
    }, [setCurrentStep]);

    
    const total = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return(
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
                 
                    <ProgressBar currentStep={1} />
                    
                    {/* Page Header */}
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Mi Carrito</h1>
                        <p className="text-[#666666]">Revisá tus productos antes de finalizar la compra</p>
                    </div>
                
                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                            Tu carrito está vacío.
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-10 gap-8">
                            {/* Cart Items - Left Column */}
                            <div className="lg:col-span-7">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6">
                                        {/* Store Header */}
                                        <div className="p-4 border-b border-[#e5e5e7] flex items-center">
                                            <img
                                                src={editableVariables.logoUrl || '/logo.png'}
                                                alt="logo-tienda"
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="ml-3">
                                                <h3 className="font-semibold text-[#1c1c1e]">{item.product.storeName || item.product.shop?.name || 'Tienda'}</h3>
                                                <p className="text-sm text-[#666666]">Vendedor verificado</p>
                                            </div>
                                        </div>
                                        
                                        {/* Store Products */}
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 mb-4">
                                                <input type="checkbox" checked className="w-5 h-5 text-[#ff4f41] border-2 border-[#e5e5e7] rounded focus:ring-[#ff4f41]" />
                                                <img
                                                    src={item.product.imageUrls?.[0] || ''}
                                                    alt={item.product.name}
                                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                />
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-[#1c1c1e] mb-1 hover:text-[#ff4f41] cursor-pointer">{item.product.name}</h4>
                                                    <p className="text-[#666666] text-sm mb-2">Producto disponible | Garantía incluida</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-[#00a699]/10 text-[#00a699] rounded-full text-xs font-medium">Envío gratis</span>
                                                        <span className="px-2 py-1 bg-[#ff4f41]/10 text-[#ff4f41] rounded-full text-xs font-medium">Oferta</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center border border-[#e5e5e7] rounded-lg">
                                                        <button 
                                                            className="p-2 hover:bg-[#f8f8f8] transition-colors"
                                                            onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <i className="fa-solid fa-minus text-[#666666] text-sm"></i>
                                                        </button>
                                                        <span className="px-3 py-2 text-[#1c1c1e] font-medium">{item.quantity}</span>
                                                        <button 
                                                            className="p-2 hover:bg-[#f8f8f8] transition-colors"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        >
                                                            <i className="fa-solid fa-plus text-[#666666] text-sm"></i>
                                                        </button>
                                                    </div>
                                                    <div className="text-right min-w-[80px]">
                                                        <div className="font-bold text-[#1c1c1e]">${item.product.price.toFixed(2)}</div>
                                                    </div>
                                                    <button 
                                                        className="w-8 h-8 bg-[#f8f8f8] rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        onClick={() => removeFromCart(item.product.id)}
                                                    >
                                                        <i className="fa-solid fa-trash text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Store Totals */}
                                        <div className="px-6 pb-6 border-t border-[#e5e5e7] pt-4">
                                            <div className="bg-[#f8f8f8] rounded-lg p-4">
                                                <div className="flex justify-between items-center text-sm mb-2">
                                                    <span className="text-[#666666]">Subtotal {item.product.storeName || item.product.shop?.name || 'Tienda'}</span>
                                                    <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm mb-2">
                                                    <span className="text-[#666666]">Envío</span>
                                                    <span className="font-medium">$5.99</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm mb-2">
                                                    <span className="text-[#00a699]">Ahorro total</span>
                                                    <span className="font-medium text-[#00a699]">-${(item.product.price * item.quantity * 0.1).toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm border-t border-[#e5e5e7] pt-2">
                                                    <span className="font-semibold text-[#1c1c1e]">Total de la tienda</span>
                                                    <span className="font-bold text-[#ff4f41]">${((item.product.price * item.quantity) + 5.99 - (item.product.price * item.quantity * 0.1)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary - Right Column (Sticky) */}
                            <div className="lg:col-span-3 lg:sticky lg:top-24 lg:h-fit">
                                <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e7]">
                                    <h3 className="text-xl font-semibold text-[#1c1c1e] mb-6">Resumen de compra</h3>
                                    
                                    {/* Order Details */}
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Subtotal ({cartItems.length} productos)</span>
                                            <span className="text-[#1c1c1e] font-medium">${total.toFixed(2)}</span>
                                        </div>
                                        
                                        {/* Shipping Calculator */}
                                        <div className="border-t border-[#e5e5e7] pt-4">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-[#666666]">Envío</span>
                                                <span className="text-[#1c1c1e] font-medium">$5.99</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Código postal" 
                                                    className="flex-1 h-10 px-3 bg-[#f8f8f8] rounded-lg border border-[#e5e5e7] text-sm placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                                                />
                                                <button className="px-4 py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-medium hover:bg-[#ff4f41]/90 transition-colors">
                                                    Calcular
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-[#666666]">Impuestos</span>
                                            <span className="text-[#1c1c1e] font-medium">${(total * 0.04).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Total */}
                                    <div className="border-t border-[#e5e5e7] pt-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-semibold text-[#1c1c1e]">Total</span>
                                            <span className="text-2xl font-bold text-[#ff4f41]">${(total + 5.99 + (total * 0.04)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Checkout Button */}
                                    <button 
                                        className="w-full bg-[#ff4f41] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#ff4f41]/90 transition-colors mb-6"
                                        onClick={() => {
                                            if (!isAuthenticated) {
                                                setShowLoginModal(true);
                                            } else {
                                                navigate('/cart-checkout');
                                            }
                                        }}
                                    >
                                        Continuar con la compra
                                    </button>
                                    
                                    {/* Trust Messages */}
                                    <div className="space-y-3">
                                        <div className="flex items-center text-sm text-[#666666]">
                                            <i className="fa-solid fa-shield-alt text-[#00a699] mr-3"></i>
                                            Pago seguro
                                        </div>
                                        <div className="flex items-center text-sm text-[#666666]">
                                            <i className="fa-solid fa-undo text-[#00a699] mr-3"></i>
                                            Devolución garantizada
                                        </div>
                                        <div className="flex items-center text-sm text-[#666666]">
                                            <i className="fa-solid fa-headset text-[#00a699] mr-3"></i>
                                            Atención 24/7
                                        </div>
                                    </div>
                                    
                                    {/* Benefits */}
                                    <div className="mt-6 p-4 bg-[#f8f8f8] rounded-lg">
                                        <div className="text-sm text-[#1c1c1e] font-medium mb-2">Beneficios especiales:</div>
                                        <div className="text-sm text-[#666666]">
                                            • Cuotas sin interés disponibles<br />
                                            • Descuento por compras superiores a $500
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <FooterHome />
            {!isAuthenticated && (
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            )}
        </>
    )
}

