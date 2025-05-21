import * as React from 'react';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import CartFooter from '../components/CartComponents/CartFooter';
import { DesignButton } from '../components/atoms/DesignButton';
import { FaCheckCircle, FaShoppingCart, FaHome } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import { useCartStore } from '../stores/cartStore';

export default function CartCompleted() {
    const navigate = useNavigate();
    const cartItems = useCartStore(state => state.items);


    const groupedByStore = React.useMemo(() => {
        const groups: Record<string, typeof cartItems> = {};
        cartItems.forEach(item => {
            const store = item.product.storeName || 'Tienda';
            if (!groups[store]) groups[store] = [];
            groups[store].push(item);
        });
        return groups;
    }, [cartItems]);

 
    const getStoreTotals = (items: typeof cartItems) => {
        const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      
        const envio = 15.00;
        const total = subtotal + envio;
        return { subtotal, envio, total };
    };

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
               
                    <div className="flex justify-center mb-4">
                        <FaCheckCircle className="text-5xl text-teal-500" />
                    </div>
                   
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
                        <h2 className="text-2xl font-bold text-center font-space mb-2">¡Gracias por tu compra!</h2>
                        <p className="text-center text-gray-500 font-space mb-6">
                            Tu pedido ha sido confirmado y será procesado pronto
                        </p>
                        {Object.entries(groupedByStore).map(([storeName, items], idx) => {
                            const { subtotal, envio, total } = getStoreTotals(items);
                            return (
                                <div key={storeName} className={`mb-6 ${idx > 0 ? 'bg-gray-50 rounded-xl p-6' : ''}`}>
                                    <div className="flex items-center mb-2">
                                        <img
                                            src={items[0].product.imageUrls?.[0] || ''}
                                            alt="avatar"
                                            className="w-8 h-8 rounded-full mr-3"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-space font-medium">{storeName}</span>
                                            <div className="flex items-center gap-2 text-xs font-space">
                                                <StatusTags status="Pending" text="Pending" />
                                                <span className="text-gray-400">Orden #{Math.floor(Math.random() * 100000)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {items.map(item => (
                                        <div key={item.product.id} className="flex justify-between font-space text-sm mb-1">
                                            <span>{item.product.name} ({item.quantity}x)</span>
                                            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between font-space text-sm mb-1">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-space text-sm mb-1">
                                        <span>Envío</span>
                                        <span>${envio.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-space font-semibold text-base mb-2">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    {idx === 0 && (
                                        <>
                                            <div className="bg-gray-50 rounded-md px-4 py-2 mb-2 flex items-center justify-between cursor-pointer">
                                                <span className="font-space text-sm">Ver detalles de envío y pago</span>
                                                <FaChevronDown className="text-gray-400" />
                                            </div>
                                            <div className="text-xs text-gray-400 font-space mt-2">
                                                Recibirás un email con los detalles de tu compra a: <span className="font-semibold">usuario@email.com</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                   
                    <div className="flex gap-4">
                        <DesignButton
                            variant="primary"
                            className="flex-1"
                            icon={FaShoppingCart}
                            iconPosition="left"
                            onClick={() => navigate('/dashboard')}
                        >
                            Seguir comprando
                        </DesignButton>
                        <DesignButton
                            variant="neutral"
                            className="flex-1"
                            icon={FaHome}
                            iconPosition="left"
                            onClick={() => navigate('/')}
                        >
                            Ir al inicio
                        </DesignButton>
                    </div>
                </div>
            </div>
            <CartFooter />
        </>
    );
}
