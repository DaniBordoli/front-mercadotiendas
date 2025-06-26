import React from 'react';

interface Product {
  _id?: string;
  id?: string | number;
  nombre?: string;
  title?: string;
  precio?: string | number;
  price?: string | number;
  productImages?: string[];
  image?: string;
}

interface FeaturedProductsProps {
  cardImage?: string;
  title?: string;
  backgroundColor?: string;
  cardButtonText?: string;
  cardButtonColor?: string;
  cardButtonTextColor?: string;
  titleColor?: string;
  products?: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  cardImage = 'https://placehold.co/300x400',
  title = 'Productos destacados',
  backgroundColor = '#F9FAFB',
  cardButtonText = 'Añadir al carrito',
  cardButtonColor = '#3B82F6',
  cardButtonTextColor = '#FFFFFF',
  titleColor = "#000",
  products,
}) => {
  const defaultProducts = [
    { id: 1, title: 'Producto 1', price: '$49.99', image: cardImage },
    { id: 2, title: 'Producto 2', price: '$59.99', image: cardImage },
    { id: 3, title: 'Producto 3', price: '$69.99', image: cardImage },
    { id: 4, title: 'Producto 4', price: '$79.99', image: cardImage },
  ];
  const showProducts = products && products.length > 0 ? products : defaultProducts;

  
  const isRealProduct = (p: any): p is Product => {
    return (
      typeof p === 'object' &&
      ('_id' in p || 'nombre' in p || 'precio' in p || 'productImages' in p)
    );
  };

  return (
    <div className="py-12" style={{ backgroundColor }}>
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: titleColor }}>{title}</h2>
      {showProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No hay productos destacados.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-28">
          {showProducts.map((product, idx) => {
            if (isRealProduct(product)) {
              const imageSrc = product.productImages && product.productImages.length > 0
                ? product.productImages[0]
                : product.image || cardImage;
              const productTitle = product.nombre || product.title || 'Producto';
              const productPrice = product.precio || product.price || '-';
              return (
                <div key={product._id || product.id || idx} className="relative bg-white rounded-sm my-8 shadow-md overflow-hidden w-[290px] mx-auto">
                  <img src={imageSrc} alt={productTitle} className="w-full h-[400px] object-cover" />
                  <div className="absolute inset-0 flex flex-col justify-end items-start p-4 bg-black bg-opacity-0">
                    <h3 className="text-lg font-bold">{productTitle}</h3>
                    <p className="text-sm text-gray-900 mt-2">{typeof productPrice === 'number' ? `$${productPrice}` : productPrice}</p>
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
              );
            } else {
             
              return (
                <div key={product.id || idx} className="relative bg-white rounded-sm my-8 shadow-md overflow-hidden w-[290px] mx-auto">
                  <img src={product.image || cardImage} alt={product.title} className="w-full h-[400px] object-cover" />
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
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
