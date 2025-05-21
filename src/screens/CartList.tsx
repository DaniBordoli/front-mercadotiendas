import * as React from 'react';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import { FaRegTrashAlt } from "react-icons/fa";
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { FaShoppingCart } from "react-icons/fa";
import CartFooter from '../components/CartComponents/CartFooter';
import LoginModal from '../components/CartComponents/LoginModal';
import { useAuthStore } from '../stores/slices/authSlice';
import { useCartStore } from '../stores/cartStore';

export default function CartList() {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = React.useState(false);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const cartItems = useCartStore(state => state.items);
    const removeFromCart = useCartStore(state => state.removeFromCart);
    const updateQuantity = useCartStore(state => state.updateQuantity);

    
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
                 
                    <div className="flex items-center justify-center mb-6">
                        <div className="flex items-center space-x-8">
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-red-400 text-white flex items-center justify-center font-bold">1</div>
                                <div className="text-xs text-gray-400 mt-1"></div>
                            </div>
                            <div className="w-16 h-0.5 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">2</div>
                            </div>
                            <div className="w-16 h-0.5 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">3</div>
                            </div>
                            <div className="w-16 h-0.5 bg-gray-200"></div>
                            <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold">4</div>
                            </div>
                        </div>
                    </div>
                
                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-gray-500">
                            Tu carrito está vacío.
                        </div>
                    ) : (
                        <>
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                    <div className="flex items-center mb-4">
                                        <img
                                            src={item.product.imageUrls?.[0] || ''}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-800">{item.product.storeName || 'Tienda'}</div>
                                            <StatusTags status="Active" className="mt-1 text-xs" />
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                    <div className="flex items-center bg-gray-50 rounded-lg p-4">
                                        <img
                                            src={item.product.imageUrls?.[0] || ''}
                                            alt={item.product.name}
                                            className="w-24 h-24 object-contain rounded-lg bg-white"
                                        />
                                        <div className="ml-4 flex-1">
                                            <div className="font-medium text-gray-900">{item.product.name}</div>
                                            <div className="text-lg font-semibold text-gray-800 mt-2">${item.product.price.toFixed(2)}</div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span className="mx-2 text-gray-700">{item.quantity}</span>
                                            <button
                                                className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                            >+</button>
                                            <button
                                                className="ml-2 text-red-400 hover:text-red-600"
                                                onClick={() => removeFromCart(item.product.id)}
                                            >
                                                <FaRegTrashAlt className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8 flex flex-col items-center">
                                <div className="w-full flex items-center justify-between mb-6">
                                    <span className="text-lg font-semibold font-space">Total</span>
                                    <span className="text-2xl font-bold font-space">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    className="w-full h-11 rounded-lg text-white font-space text-lg font-semibold flex items-center justify-center"
                                    style={{ background: '#FF4F41' }}
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            setShowLoginModal(true);
                                        } else {
                                            navigate('/cart-checkout');
                                        }
                                    }}
                                >
                                    <FaShoppingCart className="mr-2 text-white" />
                                    Iniciar compra
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <CartFooter />
            {!isAuthenticated && (
                <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
            )}
        </>
    )
}

