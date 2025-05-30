import React, { useState } from 'react';
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
// Importar tipo Product desde el store
import type { Product } from '../../../stores/searchStore'; // Ajustar path relativo

// ELIMINAR definición local de Product
/*
interface Product {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
  rating?: number;
  storeName?: string;
  isNew?: boolean; // Definición antigua
  hasFreeShipping?: boolean;
  isFeatured?: boolean;
}
*/

interface ProductListItemProps {
  product: Product; // Ahora usa el tipo importado
  onClick?: (product: Product) => void;
}

// Componente Helper para Rating
const RatingStars: React.FC<{ rating?: number }> = ({ rating }) => {
  // Si no hay rating, mostrar 0 estrellas y (0.0)
  const safeRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center text-yellow-500">
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
      <span className="text-gray-500 text-xs ml-1">({safeRating.toFixed(1)})</span>
    </div>
  );
};

export const ProductListItem: React.FC<ProductListItemProps> = ({ product, onClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formattedPrice = `$${product.price.toLocaleString()}`;

  const handleClick = () => {
    if (onClick) onClick(product);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que el clic en el botón active el onClick del div padre
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? product.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Determinar la imagen a mostrar
  const displayImageUrl = product.imageUrls && product.imageUrls.length > 0
    ? product.imageUrls[currentImageIndex]
    : 'https://placehold.co/200x200?text=No+Image';

  return (
    <div 
      className="flex bg-white border rounded-md overflow-hidden shadow-sm mb-4 p-4 cursor-pointer hover:shadow-md transition-shadow relative"
      style={{ borderColor: '#E6E6E7' }}
      onClick={handleClick}
    >
      {/* Columna Imagen con controles */}
      <div className="w-32 md:w-48 flex-shrink-0 mr-4 relative group">
        <img 
          src={displayImageUrl} 
          alt={product.name} 
          className="w-full h-full object-contain transition-opacity duration-300"
        />
        {/* Botones de navegación de imagen (visibles en hover del grupo) */}
        {product.imageUrls && product.imageUrls.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage} 
              className="absolute top-1/2 left-1 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              aria-label="Previous Image"
            >
              <FaChevronLeft size={16}/>
            </button>
            <button 
              onClick={handleNextImage} 
              className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
              aria-label="Next Image"
            >
              <FaChevronRight size={16}/>
            </button>
          </>
        )}
      </div>

      {/* Columna Detalles */}
      <div className="flex flex-col flex-grow">
        {/* Etiquetas Superiores */} 
        <div className="flex items-center gap-2 mb-1">
          {/* Usar product.condition en lugar de product.isNew */}
          {product.condition === 'new' && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Nuevo</span>}
          {product.isFeatured && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Destacado</span>}
        </div>
        
        {/* Nombre producto H4 */}
        <h3 className="text-lg font-medium mb-1 line-clamp-2" style={{ color: '#1C1C1E' }}>{product.name}</h3>
        
        {/* Rating */}
        <RatingStars rating={product.rating} />

        {/* Nombre de la tienda */}
        {product.storeName && (
          <p className="text-xs text-gray-500 mt-1" style={{ color: '#666666' }}>Vendido por {product.storeName}</p>
        )}

        {/* Precio H4 */}
        <p className="text-2xl font-semibold my-2" style={{ color: '#1C1C1E' }}>{formattedPrice}</p>
        
        {/* Envío gratis (condicional) */}
        {product.hasFreeShipping && (
          <p className="text-sm mb-1 font-medium" style={{ color: '#00A699' }}>Envío gratis</p>
        )}

      </div>
    </div>
  );
};