import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../../stores/searchStore';

interface Product {
  _id?: string;
  id?: string | number;
  nombre?: string;
  title?: string;
  precio?: string | number;
  price?: string | number;
  productImages?: string[];
  image?: string;
  estado?: string;
}

interface FeaturedProductsProps {
  cardImage?: string;
  featuredProductsTitle?: string;
  featuredProductsTitleColor?: string;
  backgroundColor?: string;
  cardButtonText?: string;
  cardButtonColor?: string;
  cardButtonTextColor?: string;
  titleColor?: string;
  products?: Product[];
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  cardImage = 'https://placehold.co/300x400',
  featuredProductsTitle = 'Productos destacados',
  featuredProductsTitleColor = '#000',
  backgroundColor = '#F9FAFB',
  cardButtonText = 'Añadir al carrito',
  cardButtonColor = '#3B82F6',
  cardButtonTextColor = '#FFFFFF',
  titleColor = "#000",
  products,
}) => {
  const navigate = useNavigate();
  const { fetchProductById } = useSearchStore();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  
  const defaultProducts = [
    { id: 1, title: 'Producto 1', price: '$49.99', image: cardImage },
    { id: 2, title: 'Producto 2', price: '$59.99', image: cardImage },
    { id: 3, title: 'Producto 3', price: '$69.99', image: cardImage },
    { id: 4, title: 'Producto 4', price: '$79.99', image: cardImage },
  ];
  
  // Filter out inactive products
  const activeProducts = products && products.length > 0 
    ? products.filter(product => !product.estado || product.estado === 'Activo')
    : defaultProducts;
  
  const showProducts = activeProducts;

  const isRealProduct = (p: any): p is Product => {
    return (
      typeof p === 'object' &&
      ('_id' in p || 'nombre' in p || 'precio' in p || 'productImages' in p)
    );
  };

  // Función para manejar la navegación a detalle con precarga
  const handleProductClick = async (product: Product) => {
    const productId = product._id || product.id;
    if (!productId) {
      navigate('/first-layout/detail-layout');
      return;
    }

    try {
      setLoadingProductId(String(productId));
      // Precargar el producto antes de navegar
      await fetchProductById(String(productId));
      // Una vez cargado, navegar al detalle
      navigate(`/first-layout/detail-layout/${productId}`);
      // Scroll al tope de la página
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error al precargar producto:', error);
      // Si hay error, navegar de todas formas
      navigate(`/first-layout/detail-layout/${productId}`);
      // Scroll al tope incluso si hay error
      window.scrollTo(0, 0);
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="py-12" style={{ backgroundColor }}>
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: featuredProductsTitleColor }}>{featuredProductsTitle}</h2>
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
                <div 
                  key={product._id || product.id || idx} 
                  className="bg-white rounded-lg my-8 shadow-md overflow-hidden w-[290px] mx-auto flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
                  onClick={() => handleProductClick(product)}
                >
                  {/* Overlay de carga */}
                  {loadingProductId === String(product._id || product.id) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                      <div className="bg-white rounded-full p-3">
                        <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                  <img src={imageSrc} alt={productTitle} className="w-full h-[220px] object-cover" />
                  <div className="flex-1 flex flex-col justify-between p-4 bg-white">
                    <div>
                      <h3 className="text-base font-semibold mb-1 text-gray-900">{productTitle}</h3>
                      <p className="text-lg font-bold text-gray-800 mb-4">{typeof productPrice === 'number' ? `$${productPrice}` : productPrice}</p>
                    </div>
                    <button
                      className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded font-semibold transition-colors duration-200"
                      style={{
                        backgroundColor: cardButtonColor,
                        color: cardButtonTextColor,
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se active el click del contenedor
                        // Aquí puedes agregar la lógica del carrito si es necesario
                      }}
                    >
                      {cardButtonText}
                      <span className="ml-2"><FiShoppingCart size={20} color={cardButtonTextColor} /></span>
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <div 
                  key={product.id || idx} 
                  className="bg-white rounded-lg my-8 shadow-md overflow-hidden w-[290px] mx-auto flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => {
                    // Para productos dummy, redirigir a la vista de detalle genérica
                    navigate('/first-layout/detail-layout');
                    // Scroll al tope de la página
                    window.scrollTo(0, 0);
                  }}
                >
                  <img src={product.image || cardImage} alt={product.title} className="w-full h-[220px] object-cover" />
                  <div className="flex-1 flex flex-col justify-between p-4 bg-white">
                    <div>
                      <h3 className="text-base font-semibold mb-1 text-gray-900">{product.title}</h3>
                      <p className="text-lg font-bold text-gray-800 mb-4">{product.price}</p>
                    </div>
                    <button
                      className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded font-semibold transition-colors duration-200"
                      style={{
                        backgroundColor: cardButtonColor,
                        color: cardButtonTextColor,
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se active el click del contenedor
                        // Aquí puedes agregar la lógica del carrito si es necesario
                      }}
                    >
                      {cardButtonText}
                      <span className="ml-2"><FiShoppingCart size={20} color={cardButtonTextColor} /></span>
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
