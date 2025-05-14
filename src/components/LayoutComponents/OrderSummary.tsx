import React from 'react';

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax?: number;
  total: number;
  buttonLabel: string;
  onButtonClick?: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  shipping,
  tax,
  total,
  buttonLabel,
  onButtonClick,
}) => (
  <div className="w-full md:w-80 bg-white rounded-lg shadow p-6 h-fit">
    <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
    <div className="flex justify-between mb-2">
      <span>Subtotal</span>
      <span>${subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Shipping</span>
      <span>${shipping.toFixed(2)}</span>
    </div>
    {typeof tax === 'number' && (
      <div className="flex justify-between mb-2">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
    )}
    <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
      <span>Total</span>
      <span>${total.toFixed(2)}</span>
    </div>
    <button
      className="mt-6 w-full bg-blue-600 text-white py-2 rounded font-semibold"
      onClick={onButtonClick}
    >
      {buttonLabel}
    </button>
  </div>
);

export default OrderSummary;
