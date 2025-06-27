import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import CartItem from '../../components/LayoutComponents/CartItem';
import OrderSummary from '../../components/LayoutComponents/OrderSummary';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

const cart = [
  {
    id: 1,
    title: 'Classic White Shirt',
    price: 59.99,
    image: 'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=400',
    quantity: 1,
  },
  {
    id: 2,
    title: 'Slim Fit Jeans',
    price: 79.99,
    image: 'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=400',
    quantity: 2,
  },
  {
    id: 3,
    title: 'Sneakers',
    price: 99.99,
    image: 'https://www.houseofblanks.com/cdn/shop/files/HeavyweightTshirt_White_01_2.jpg?v=1726516822&width=400',
    quantity: 1,
  },
];

const CartScreen: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  return (
    <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
          <div className="space-y-6">
            {cart.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>
        <OrderSummary
          subtotal={319.96}
          shipping={5.0}
          total={324.96}
          buttonLabel="Checkout"
        />
      </div>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default CartScreen;
