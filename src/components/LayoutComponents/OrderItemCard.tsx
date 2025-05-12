import React from 'react';

interface OrderItemCardProps {
  item: {
    title: string;
    quantity: number;
    price: string;
    image: string;
  };
}

const OrderItemCard: React.FC<OrderItemCardProps> = ({ item }) => (
  <div className="flex items-center bg-gray-50 rounded px-4 py-3">
    <img src={item.image} alt={item.title} className="w-14 h-14 rounded object-cover mr-4" />
    <div className="flex-1">
      <div className="text-sm">{item.title}</div>
      <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
    </div>
    <div className="text-sm font-semibold">{item.price}</div>
  </div>
);

export default OrderItemCard;
