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

export default function CartSummary() {
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

    const shipping = cartItems.length > 0 ? 15.00 : 0;
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const total = subtotal + shipping;

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
                                    onClick={() => navigate('/cart-completed')}
                                >
                                    Confirmar compra
                                </DesignButton>
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
