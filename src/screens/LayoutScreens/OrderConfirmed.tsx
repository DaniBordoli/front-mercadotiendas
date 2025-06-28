import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaCheck } from 'react-icons/fa';
import OrderItemCard from '../../components/LayoutComponents/OrderItemCard';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const order = {
  number: '#ORD-2025-1234',
  date: 'May 5, 2025',
  total: '$579.96',
  payment: 'Credit Card',
  shipping: {
    name: 'John Doe',
    address: '123 Street Name',
    city: 'City, State 12345',
    country: 'United States',
  },
  delivery: {
    method: 'Standard Shipping',
    range: 'May 8 - May 12, 2025',
  },
  items: [
    {
      title: 'Classic White Shirt',
      quantity: 1,
      price: '$59.99',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Summer Dress',
      quantity: 2,
      price: '$179.98',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      title: 'Luxury Watch',
      quantity: 1,
      price: '$299.99',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ],
};

const OrderConfirmed: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <main className="flex-1 flex flex-col items-center justify-center py-12">
        <div className="bg-white rounded-lg shadow p-8 w-full max-w-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
              <FaCheck className="text-4xl" style={{ color: '#10B981' }} />
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-center">Order Confirmed!</h2>
            <p className="text-gray-600 text-center">Thank you for your purchase. Your order has been received.</p>
          </div>
         
          <div className="border-t mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 text-xs md:text-sm text-gray-500">
              <div className="p-4">
                <div className="mb-1">Order Number</div>
                <div className="text-blue-600 font-semibold">{order.number}</div>
              </div>
              <div className="p-4">
                <div className="mb-1">Date</div>
                <div>{order.date}</div>
              </div>
              <div className="p-4">
                <div className="mb-1">Total</div>
                <div>{order.total}</div>
              </div>
              <div className="p-4">
                <div className="mb-1">Payment Method</div>
                <div className="font-semibold">{order.payment}</div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 border-t">
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">Shipping Address</div>
                <div className="text-sm text-gray-700">
                  {order.shipping.name}<br />
                  {order.shipping.address}<br />
                  {order.shipping.city}<br />
                  {order.shipping.country}
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-gray-500 mb-1">Estimated Delivery</div>
                <div className="text-sm text-gray-700">
                  {order.delivery.method}<br />
                  {order.delivery.range}
                </div>
              </div>
            </div>
          </div>
    
          <div>
            <div className="text-gray-700 font-semibold mb-3">Order Items</div>
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <OrderItemCard key={idx} item={item} />
              ))}
            </div>
          </div>
 
          <div className="flex gap-4 mt-8 justify-center">
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition font-medium">
              Track Order
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-100 transition font-medium">
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default OrderConfirmed;
