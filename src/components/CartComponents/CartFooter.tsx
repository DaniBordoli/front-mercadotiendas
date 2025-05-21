import React from 'react';

const CartFooter: React.FC = () => (
  <footer className="w-full border-t border-gray-200 bg-white py-4 px-20 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
    <div className="flex-1 text-left">
      © 2025 Mercado Tiendas. All rights reserved.
    </div>
    <div className="flex-1 flex justify-end gap-4">
      <a href="#" className="hover:underline">Privacy Policy</a>
      <a href="#" className="hover:underline">Terms of Service</a>
    </div>
  </footer>
);

export default CartFooter;
