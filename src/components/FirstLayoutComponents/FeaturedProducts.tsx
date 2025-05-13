import React from 'react';

interface FeaturedProductsProps {
  cardImage?: string;
  title?: string;
  backgroundColor?: string;
  cardButtonText?: string;
  cardButtonColor?: string;
  cardButtonTextColor?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  cardImage = 'https://placehold.co/300x400',
  title = 'Featured Products',
  backgroundColor = '#fff',
  cardButtonText = 'Add to Cart',
  cardButtonColor = '#3B82F6',
  cardButtonTextColor = '#FFFFFF',
}) => {
  const products = [
    { id: 1, title: 'Product 1', price: '$49.99', image: cardImage },
    { id: 2, title: 'Product 2', price: '$59.99', image: cardImage },
    { id: 3, title: 'Product 3', price: '$69.99', image: cardImage },
    { id: 4, title: 'Product 4', price: '$79.99', image: cardImage },
  ];

  return (
    <div className="bg-gray-50 py-12" style={{ backgroundColor }}>
      <h2 className="text-2xl font-bold text-center mb-8">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-28">
        {products.map((product) => (
          <div key={product.id} className="relative bg-white rounded-sm my-8 shadow-md overflow-hidden w-[290] mx-auto">
            <img src={product.image} alt={product.title} className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 flex flex-col justify-end items-start p-4 bg-black bg-opacity-0">
              <h3 className="text-lg font-bold">{product.title}</h3>
              <p className="text-sm text-gray-900 mt-2">{product.price}</p>
              <button
                className="mt-2 w-full py-2 rounded self-center"
                style={{
                  backgroundColor: cardButtonColor,
                  color: cardButtonTextColor,
                }}
              >
                {cardButtonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
