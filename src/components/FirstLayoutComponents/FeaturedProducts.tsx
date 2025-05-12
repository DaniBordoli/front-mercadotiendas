import React from 'react';

const FeaturedProducts: React.FC = () => {
  const products = [
    { id: 1, title: 'Product 1', price: '$49.99', image: 'https://placehold.co/300x400' },
    { id: 2, title: 'Product 2', price: '$59.99', image: 'https://placehold.co/300x400' },
    { id: 3, title: 'Product 3', price: '$69.99', image: 'https://placehold.co/300x400' },
    { id: 4, title: 'Product 4', price: '$79.99', image: 'https://placehold.co/300x400' },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-28">
        {products.map((product) => (
          <div key={product.id} className="relative bg-white rounded-sm my-8 shadow-md overflow-hidden w-[290] mx-auto">
            <img src={product.image} alt={product.title} className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end items-start p-4 bg-black bg-opacity-0">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-sm text-gray-900 mt-2">{product.price}</p>
              <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 self-center">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
