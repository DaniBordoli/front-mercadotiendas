import * as React from 'react';
import { Logo } from '../components/atoms/Logo';
import { useNavigate } from 'react-router-dom';
import { StatusTags } from '../components/atoms/StatusTags/StatusTags';
import CartFooter from '../components/CartComponents/CartFooter';
import { FaTruck, FaStore, FaCreditCard } from "react-icons/fa";
import { MdOutlineAccountBalance } from "react-icons/md";
import { colors } from '../design/colors';
import { FaCcVisa } from "react-icons/fa6";
import { RiCashFill } from "react-icons/ri";
import { DesignButton } from '../components/atoms/DesignButton';



export default function CartCheckout() {
    const navigate = useNavigate();
    const subtotal = 349.97;
    const envio = 10.00;
    const total = subtotal + envio;

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
            {/* Main */}
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
             
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                  
                        <div className="flex items-center mb-4">
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="avatar"
                                className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                                <div className="font-semibold text-gray-800">Sports Equipment Store</div>
                                <StatusTags status="Active" className="mt-1 text-xs" />
                            </div>
                        </div>
       
                        <h3 className="text-base font-space mt-8 mb-4">Método de envío</h3>
                        <div className="flex flex-col gap-4">
                 
                            <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
                                <input type="radio" name="envio" className="mr-4 accent-red-500" defaultChecked />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <FaTruck className="text-red-500" />
                                        <span className="font-space">Envío a domicilio</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">2-3 días hábiles</div>
                                    <div className="text-xs mt-1" style={{ color: colors.accentTeal }}>Seguimiento en tiempo real · Entrega garantizada</div>
                                </div>
                                <div className="text-base font-medium text-gray-700 ml-4">$10.00</div>
                            </div>
                       
                            <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
                                <input type="radio" name="envio" className="mr-4 accent-red-500" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <FaStore className="text-red-500" />
                                        <span className="font-space">Retiro en tienda</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Disponible en 24hs</div>
                                    <div className="text-xs mt-1" style={{ color: colors.accentTeal }}>Sin costo adicional · Retiro inmediato</div>
                                </div>
                                <div className="text-base font-medium text-gray-700 ml-4">Gratis</div>
                            </div>
                        </div>
                 
                        <h3 className="text-base font-space mt-8 mb-4">Método de pago</h3>
                        <div className="flex flex-col gap-4">
                          
                            <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
                                <input type="radio" name="pago" className="mr-4 accent-red-500" defaultChecked />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <FaCcVisa className="text-black" />
                                        <span className="font-space">Tarjeta de crédito</span>
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: colors.accentTeal }}>Pago seguro · Hasta 12 cuotas sin interés</div>
                                </div>
                            </div>
                         
                            <div className="flex items-center border rounded-lg px-4 py-3 bg-white">
                                <input type="radio" name="pago" className="mr-4 accent-red-500" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <RiCashFill className="text-red-500" />
                                        <span className="font-space">Transferencia bancaria</span>
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: colors.accentTeal }}>Acreditación inmediata · Sin comisiones</div>
                                </div>
                            </div>
                        </div>
                    
                        <div className="bg-gray-50 rounded-lg mt-8 p-6">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Envío</span>
                                <span className="text-gray-700">${envio.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mt-4">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                   
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-lg font-semibold font-space">Total General</span>
                                <span className="text-2xl font-bold font-space">$359.97</span>
                            </div>
                            <div className="flex gap-4">
                                <DesignButton variant="neutral" className="flex-1">
                                    Volver
                                </DesignButton>
                                <DesignButton
                                    variant="primary"
                                    className="flex-1"
                                    onClick={() => navigate('/cart-summary')}
                                >
                                    Continuar
                                </DesignButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <CartFooter />
        </>
    );
}
