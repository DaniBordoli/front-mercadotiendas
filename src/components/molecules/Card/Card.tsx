import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  productId?: string;
  shopId?: string;
}

export const Card: React.FC<CardProps> = ({ 
  imageSrc, 
  title = "Jacket",
  price,
  category = "General",
  onClick,
  productId,
  shopId
}) => {
  const navigate = useNavigate();
  const { fetchProductById } = useSearchStore();
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(null);

  const handleCardClick = async () => {
    // Si hay un onClick personalizado, usarlo
    if (onClick) {
      onClick();
      return;
    }

    // Para productos con shopId y productId, navegar con precarga
    if (shopId && productId) {
      try {
        setLoadingProductId(productId);
        // Precargar el producto antes de navegar
        await fetchProductById(productId);
        navigate(`/shop/${shopId}/producto/${productId}`);
      } catch (error) {
        console.error('Error al precargar producto:', error);
        // Si hay error, navegar de todas formas
        navigate(`/shop/${shopId}/producto/${productId}`);
      } finally {
        setLoadingProductId(null);
      }
    } else {
      console.log('Card clicked');
    }
  };

  const formattedPrice = price !== undefined 
    ? `$${price.toLocaleString()}`
    : "Precio no disponible";

  return (
    <div 
      className="card ml-6 w-84 h-108 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col relative"
      onClick={handleCardClick}
      style={{ minHeight: '432px', maxHeight: '432px' }}
    >
      {/* Overlay de carga */}
      {loadingProductId === productId && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white rounded-full p-3">
            <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
      )}
      <figure className="m-0 w-full flex-shrink-0" style={{ height: '240px' }}>
        <img
          className="w-full h-full object-cover"
          src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
          alt={title}
          style={{ objectFit: 'cover' }}
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
        
        <div className="flex justify-center w-full">
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
    productId: undefined,
    shopId: undefined,
  },
  { 
    imageSrc: "https://images.pexels.com/photos/10274665/pexels-photo-10274665.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Chaqueta marrón de cuero",
    price: 100,
    category: "Ropa",
    onClick: undefined,
    productId: undefined,
    shopId: undefined,
  },
  { 
    imageSrc: "https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "Camiseta negra básica",
    price: 60,
    category: "Ropa",
    onClick: undefined,
    productId: undefined,
    shopId: undefined,
  },
];

export const CardList: React.FC = () => {
  const fetchAllProducts = require('../../../stores').useAuthStore((state: any) => state.fetchAllProducts);
  const { fetchProductById } = useSearchStore();
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState<any[]>([]);
  const [loadingProductId, setLoadingProductId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const prods = await fetchAllProducts();
        setProducts(prods);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [fetchAllProducts]);

  const handleCardClick = async (index: number, productId?: string, shopId?: string) => {
    console.log(`Card ${index + 1} clicked`);
    
    // Si tiene productId y shopId, navegar con precarga
    if (productId && shopId) {
      try {
        setLoadingProductId(productId);
        await fetchProductById(productId);
        // La navegación se manejará en el componente Card
      } catch (error) {
        console.error('Error al precargar producto:', error);
      } finally {
        setLoadingProductId(null);
      }
    }
  };

  // Si hay productos reales, usarlos. Si no, usar los mock de cardData
  const productsToShow = products && products.length > 0
    ? products.map((prod, idx) => ({
        imageSrc: prod.productImages?.[0] || prod.productImage || '',
        title: prod.nombre,
        price: prod.precio,
        category: prod.categoria || prod.estado || 'General',
        productId: prod._id,
        shopId: typeof prod.shop === 'object' ? prod.shop._id : prod.shop,
        onClick: undefined, // No usar onClick para productos reales
        isLoading: loadingProductId === prod._id,
      }))
    : cardData.map((card, idx) => ({
        ...card,
        onClick: () => handleCardClick(idx, card.productId, card.shopId),
        isLoading: false,
      }));

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
              productId={card.productId}
              shopId={card.shopId}
              onClick={card.onClick}
            />
          ))
        )}
      </div>
    </div>
  );
};
