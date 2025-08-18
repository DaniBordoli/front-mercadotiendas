import React from 'react';
import { useCartStore } from '../../stores/cartStore';
import { useNavigate } from 'react-router-dom';

interface CartPreviewProps {
  isVisible: boolean;
}

interface CartPreviewProps {
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CartPreview: React.FC<CartPreviewProps> = ({ isVisible, onMouseEnter, onMouseLeave }) => {
  const { items } = useCartStore();
  const navigate = useNavigate();

  const total = items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  const handleCheckout = () => {
    navigate('/cart-list');
  };

  if (!isVisible || items.length === 0) {
    return null;
  }

  return (
    <div 
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Mi Carrito</h3>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <div key={item.product.id} className="flex items-center space-x-3 p-2 border-b border-gray-100">
              <img 
                src={item.product.imageUrls[0]} 
                alt={item.product.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {item.product.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} x ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="text-sm font-semibold text-gray-800">
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <span className="text-lg font-bold text-red-500">${total.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handleCheckout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Ir al checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPreview;