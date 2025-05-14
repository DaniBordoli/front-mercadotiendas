import React from 'react';
import { FaTrash } from 'react-icons/fa';

interface CartItemProps {
  item: {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity: number;
  };
}

const CartItem: React.FC<{ item: CartItemProps['item'] }> = ({ item }) => (
  <div className="flex items-center bg-white rounded-lg shadow p-4 gap-4">
    <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded" />
    <div className="flex-1">
      <div className="font-semibold text-lg">{item.title}</div>
      <div className="text-gray-500 text-sm mt-1">${item.price.toFixed(2)}</div>
    </div>
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold bg-white">-</button>
      <span className="w-8 text-center">{item.quantity}</span>
      <button className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold bg-white">+</button>
    </div>
    <button className="ml-4 text-red-600" title="Remove">
      <FaTrash size={20} />
    </button>
  </div>
);

export default CartItem;
