import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../../components/LayoutComponents/OrderSummary';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const ShippingScreen: React.FC = () => {
  const navigate = useNavigate();
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        title={editableVariables.title}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
      />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
      
          <div className="flex-1">
 
            <div className="flex items-center justify-center mb-10">
   
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
                <span className="text-xs mt-2 text-gray-700">Cart</span>
              </div>
              <div className="w-16 h-1 bg-blue-600 mx-2 mt-3" />
  
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
                <span className="text-xs mt-2 text-gray-700">Shipping</span>
              </div>
              <div className="w-16 h-1 bg-gray-300 mx-2 mt-3" />
    
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center font-bold">3</div>
                <span className="text-xs mt-2 text-gray-500">Payment</span>
              </div>
            </div>
     
            <div className="bg-white rounded-lg p-8">
              <h2 className="text-xl font-bold mb-6">Shipping Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input type="text" placeholder="First Name" className="border rounded-lg px-3 py-2 w-full" />
                <input type="text" placeholder="Last Name" className="border rounded-lg px-3 py-2 w-full" />
              </div>
              <div className="mb-6">
                <input type="text" placeholder="Address" className="border rounded-lg px-3 py-2 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <input type="text" placeholder="City" className="border rounded-lg px-3 py-2 w-full" />
                <input type="text" placeholder="State" className="border rounded-lg px-3 py-2 w-full" />
                <input type="text" placeholder="ZIP Code" className="border rounded-lg px-3 py-2 w-full" />
              </div>
              <div>
                <input type="text" placeholder="Phone" className="border rounded-lg px-3 py-2 w-full" />
              </div>
            </div>
          </div>

          <OrderSummary
            subtotal={579.96}
            shipping={9.99}
            tax={34.80}
            total={624.75}
            buttonLabel="Proceed to Payment"
            onButtonClick={() => navigate('/first-layout/order-layout')}
          />
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

export default ShippingScreen;
