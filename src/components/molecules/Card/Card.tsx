import React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';
import '../../../styles/responsive.css';
import { useSearchStore } from '../../../stores';
import FullScreenLoader from '../FullScreenLoader';

interface CardProps {
  imageSrc?: string;
  title?: string;
  price?: number;
  category?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  imageSrc, 
  title = "Jacket",
  price,
  category = "General",
  onClick 
}) => {
  const handleCardClick = () => {
    if (onClick) onClick();
    else console.log('Card clicked');
  };

  const formattedPrice = price !== undefined 
    ? `$${price.toLocaleString()}`
    : "Precio no disponible";

  return (
    <div 
      className="card ml-6 w-84 h-108 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
      onClick={handleCardClick}
    >
      <figure className="m-0 w-full h-60 flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
          alt={title}
        />
      </figure>
      <div className="card-body p-4 flex flex-col items-start flex-grow">
        <p 
          style={{ color: colors.mediumGray }}
          className="text-xs font-light mb-1">{category}</p>
        <h5 
          className="card-title mb-1 font-semibold text-left text-base font-space line-clamp-2">
          {title}
        </h5>
        <p className="text-lg mb-2 font-space">{formattedPrice}</p>
        
        <div className="flex justify-center w-full mt-auto">
          <DesignButton 
            variant="primary"
            className="w-full"
          >
            Comprar
          </DesignButton>
        </div>
      </div>
    </div>
  );
};

const cardData = [
  { 
    imageSrc: "https://images.pexels.com/photos/447570/pexels-photo-447570.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Reloj negro elegante",
    price: 350,
    category: "Accesorios",
    onClick: undefined,
  },
  { 
    imageSrc: "https://images.pexels.com/photos/10274665/pexels-photo-10274665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Chaqueta marrón de cuero",
    price: 100,
    category: "Ropa",
    onClick: undefined,
  },
  { 
    imageSrc: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Camiseta negra básica",
    price: 60,
    category: "Ropa",
    onClick: undefined,
  },
];

export const CardList: React.FC = () => {
  const fetchProducts = require('../../../stores').useAuthStore((state: any) => state.fetchProducts);
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const prods = await fetchProducts();
        setProducts(prods);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  const handleCardClick = (index: number) => {
    console.log(`Card ${index + 1} clicked`);
  };

  // Si hay productos reales, usarlos. Si no, usar los mock de cardData
  const productsToShow = products && products.length > 0
    ? products.map((prod, idx) => ({
        imageSrc: prod.productImages?.[0] || prod.productImage || '',
        title: prod.nombre,
        price: prod.precio,
        category: prod.categoria || prod.estado || 'General',
        onClick: () => handleCardClick(idx),
      }))
    : cardData;

  return (
    <div className="text-center mt-8">
      <div className="flex justify-center flex-wrap">
        {loading ? (
          <FullScreenLoader />
        ) : (
          productsToShow.map((card, index) => (
            <Card 
              key={index} 
              imageSrc={card.imageSrc} 
              title={card.title}
              price={card.price}
              category={card.category}
              onClick={card.onClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
