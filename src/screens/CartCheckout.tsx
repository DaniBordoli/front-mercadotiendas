
import * as React from 'react';
import { create } from 'zustand';
import { useCartStore } from '../stores/cartStore';
import { useFirstLayoutStore } from '../stores/firstLayoutStore';
import { useCheckoutStepStore } from '../stores/checkoutStepStore';
import { useShippingAddressStore } from '../stores/shippingAddressStore';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import CartFooter from '../components/CartComponents/CartFooter';
import { FaTruck, FaStore } from "react-icons/fa";
import { colors } from '../design/colors';
import { DesignButton } from '../components/atoms/DesignButton';
import ProgressBar from '../components/molecules/ProgressBar';

interface CheckoutState {
    shippingMethod: string;
    setShippingMethod: (method: string) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
    shippingMethod: 'domicilio',
    setShippingMethod: (method) => set({ shippingMethod: method }),
}));



export default function CartCheckout() {
    const { shippingMethod, setShippingMethod } = useCheckoutStore();
    const editableVariables = useFirstLayoutStore(state => state.editableVariables);
    const navigate = useNavigate();
    const cartItems = useCartStore(state => state.items);
    const setCurrentStep = useCheckoutStepStore(state => state.setCurrentStep);
    const { address, setAddress } = useShippingAddressStore();
    
    // Group items by store
    const itemsByStore = React.useMemo(() => {
        const grouped = cartItems.reduce((acc, item) => {
            const storeId = item.product.shop?._id || item.product.storeName || 'default';
            const storeName = item.product.shop?.name || item.product.storeName || 'Tienda';
            
            if (!acc[storeId]) {
                acc[storeId] = {
                    storeId,
                    storeName,
                    items: [],
                    subtotal: 0
                };
            }
            
            acc[storeId].items.push(item);
            acc[storeId].subtotal += item.product.price * item.quantity;
            
            return acc;
        }, {} as Record<string, { storeId: string; storeName: string; items: any[]; subtotal: number }>);
        
        return Object.values(grouped);
    }, [cartItems]);
    
    const totalSubtotal = itemsByStore.reduce((sum, store) => sum + store.subtotal, 0);
    const totalShipping = itemsByStore.length * 5.99; // $5.99 per store
    const grandTotal = totalSubtotal + totalShipping;
    
    React.useEffect(() => {
        setCurrentStep(2);
    }, [setCurrentStep]);

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
                    <ProgressBar currentStep={2} />
                    
                    {/* Page Header */}
                    <div className="pb-6">
                        <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Datos de envío</h1>
                        <p className="text-[#666666]">Seleccioná el método de envío para cada tienda</p>
                    </div>

                    <div className="grid lg:grid-cols-10 gap-8">
                        {/* Shipping Details - Left Column */}
                        <div className="lg:col-span-7">
                            {/* Stores and Products */}
                            {itemsByStore.map((store, index) => (
                                <div key={store.storeId} className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6">
                                    {/* Store Header */}
                                    <div className="p-6 border-b border-[#e5e5e7] flex items-center">
                                        <img 
                                            className="w-12 h-12 rounded-full object-cover" 
                                            src={store.items[0]?.product?.shop?.imageUrl || editableVariables.logoUrl || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg'} 
                                            alt={store.storeName}
                                        />
                                        <div className="ml-4">
                                            <h3 className="font-semibold text-[#1c1c1e] text-lg">{store.storeName}</h3>
                                            <div className="flex items-center gap-2">
                                                {store.items[0]?.product?.shop?.active !== false && (
                                                    <div className="px-2 py-1 bg-[#00a699]/10 rounded-full">
                                                        <span className="text-xs text-[#00a699] font-medium">Vendedor verificado</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Selected Products */}
                                    <div className="p-6 border-b border-[#e5e5e7]">
                                        <h4 className="font-semibold text-[#1c1c1e] mb-4">Productos seleccionados</h4>
                                        <div className="space-y-4">
                                            {store.items.map((item, itemIndex) => (
                                                <div key={itemIndex} className="flex items-start gap-4 p-4 bg-[#f8f8f8] rounded-lg">
                                                    <input type="checkbox" checked className="mt-2 w-4 h-4 text-[#ff4f41] bg-gray-100 border-gray-300 rounded focus:ring-[#ff4f41] focus:ring-2" />
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
                                        <div className="mt-4 pt-4 border-t border-[#e5e5e7] flex justify-between items-center">
                                            <span className="font-medium text-[#1c1c1e]">Subtotal de la tienda:</span>
                                            <span className="font-bold text-[#1c1c1e] text-lg">${store.subtotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Shipping Methods */}
                                    <div className="p-6">
                                        <h4 className="font-semibold text-[#1c1c1e] mb-4">Método de envío</h4>
                                        <div className="space-y-4">
                                            {/* Home Delivery */}
                                            <label className="block cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name={`shipping-${store.storeId}`} 
                                                    value="home" 
                                                    checked={shippingMethod === 'domicilio'} 
                                                    onChange={() => setShippingMethod('domicilio')}
                                                    className="sr-only" 
                                                />
                                                <div className={`border-2 ${shippingMethod === 'domicilio' ? 'border-[#ff4f41] bg-[#ff4f41]/5' : 'border-[#e5e5e7] bg-white'} rounded-lg p-4 transition-all hover:shadow-md`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="w-12 h-12 bg-[#ff4f41] rounded-lg flex items-center justify-center mr-4">
                                                                <FaTruck className="text-white" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-[#1c1c1e]">Envío a domicilio</h5>
                                                                <p className="text-sm text-[#666666]">3-5 días hábiles • Seguimiento en tiempo real</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[#ff4f41] font-bold text-lg">$5.99</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>

                                            {/* Store Pickup */}
                                            <label className="block cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name={`shipping-${store.storeId}`} 
                                                    value="pickup" 
                                                    checked={shippingMethod === 'retiro'} 
                                                    onChange={() => setShippingMethod('retiro')}
                                                    className="sr-only" 
                                                />
                                                <div className={`border-2 ${shippingMethod === 'retiro' ? 'border-[#ff4f41] bg-[#ff4f41]/5' : 'border-[#e5e5e7] bg-white'} rounded-lg p-4 transition-all hover:shadow-md hover:border-[#ff4f41] hover:bg-[#ff4f41]/5`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="w-12 h-12 bg-[#00a699] rounded-lg flex items-center justify-center mr-4">
                                                                <FaStore className="text-white" />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-semibold text-[#1c1c1e]">Retiro en tienda</h5>
                                                                <p className="text-sm text-[#666666]">Disponible hoy • Entrega garantizada</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[#00a699] font-bold text-lg">Gratis</p>
                                                            <span className="inline-block px-2 py-1 bg-[#00a699]/10 rounded-full text-xs text-[#00a699] font-medium">¡Ahorrás $5.99!</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Shipping Address */}
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] mb-6">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-[#1c1c1e] mb-6">Dirección de envío</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Calle y número</label>
                                            <input 
                                                type="text" 
                                                value={address.street}
                                                onChange={(e) => setAddress({ street: e.target.value })}
                                                placeholder="Av. Corrientes 1234"
                                                className="w-full px-3 py-2 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f41] focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Departamento (opcional)</label>
                                            <input 
                                                type="text" 
                                                value={address.apartment}
                                                onChange={(e) => setAddress({ apartment: e.target.value })}
                                                placeholder="Piso 5, Depto. B"
                                                className="w-full px-3 py-2 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f41] focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Ciudad</label>
                                            <input 
                                                type="text" 
                                                value={address.city}
                                                onChange={(e) => setAddress({ city: e.target.value })}
                                                placeholder="Buenos Aires"
                                                className="w-full px-3 py-2 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f41] focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Código postal</label>
                                            <input 
                                                type="text" 
                                                value={address.postalCode}
                                                onChange={(e) => setAddress({ postalCode: e.target.value })}
                                                placeholder="1001"
                                                className="w-full px-3 py-2 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f41] focus:border-transparent"
                                            />
                                        </div>
                                        
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Provincia</label>
                                            <select 
                                                value={address.province}
                                                onChange={(e) => setAddress({ province: e.target.value })}
                                                className="w-full px-3 py-2 border border-[#e5e5e7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f41] focus:border-transparent"
                                            >
                                                <option value="">Seleccionar provincia</option>
                                                <option value="Buenos Aires">Buenos Aires</option>
                                                <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                                                <option value="Córdoba">Córdoba</option>
                                                <option value="Santa Fe">Santa Fe</option>
                                                <option value="Mendoza">Mendoza</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4">
                                        <label className="flex items-center">
                                            <input 
                                                type="checkbox" 
                                                checked={address.saveForFuture}
                                                onChange={(e) => setAddress({ saveForFuture: e.target.checked })}
                                                className="w-4 h-4 text-[#ff4f41] bg-gray-100 border-gray-300 rounded focus:ring-[#ff4f41] focus:ring-2" 
                                            />
                                            <span className="ml-2 text-sm text-[#666666]">Guardar esta dirección para futuras compras</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary - Right Column */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] p-6 sticky top-8">
                                <h3 className="text-xl font-bold text-[#1c1c1e] mb-6">Resumen de compra</h3>
                                
                                {itemsByStore.map((store, index) => (
                                    <div key={store.storeId} className="mb-4">
                                        <p className="text-sm font-medium text-[#666666] mb-2">Por tienda</p>
                                        <p className="font-semibold text-[#1c1c1e] mb-1">{store.storeName}</p>
                                        {store.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex justify-between text-sm text-[#666666] mb-1">
                                                <span>{item.product.name}</span>
                                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-[#e5e5e7] pt-2 mt-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Subtotal</span>
                                                <span className="font-medium text-[#1c1c1e]">${store.subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-[#666666]">Envío total</span>
                                                <span className="font-medium text-[#1c1c1e]">${shippingMethod === 'retiro' ? '0.00' : '5.99'}</span>
                                            </div>
                                        </div>
                                        {index < itemsByStore.length - 1 && <hr className="my-4" />}
                                    </div>
                                ))}
                                
                                <div className="border-t border-[#e5e5e7] pt-4 mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[#666666]">Subtotal</span>
                                        <span className="text-[#1c1c1e]">${totalSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[#666666]">Envío total</span>
                                        <span className="text-[#1c1c1e]">${(shippingMethod === 'retiro' ? 0 : totalShipping).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-4">
                                        <span className="text-[#666666]">Impuestos</span>
                                        <span className="text-[#1c1c1e]">$52.88</span>
                                    </div>
                                    
                                    <div className="bg-[#00a699]/10 rounded-lg p-3 mb-4">
                                        <div className="flex items-center text-[#00a699]">
                                            <span className="text-sm font-medium">💰 Ahorraste</span>
                                            <span className="ml-auto font-bold">$25.50</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-lg font-bold text-[#1c1c1e]">Total final</span>
                                        <span className="text-2xl font-bold text-[#ff4f41]">${(grandTotal + 52.88 - 25.50).toFixed(2)}</span>
                                    </div>
                                    
                                    <DesignButton
                                        variant="primary"
                                        className="w-full mb-4"
                                        onClick={() => navigate('/cart-summary')}
                                    >
                                        Continuar al pago
                                    </DesignButton>
                                    
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
            </div>
            <CartFooter />
        </>
    );
}
