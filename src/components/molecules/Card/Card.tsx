import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      className="card bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col relative"
      onClick={handleCardClick}
      style={{ 
        minHeight: '400px', 
        maxHeight: '400px',
        width: '260px',
        minWidth: '260px',
        maxWidth: '260px'
      }}
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
      <figure className="m-0 w-full flex-shrink-0" style={{ height: '220px' }}>
        <img
          className="w-full h-full object-cover"
          src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
          alt={title}
          style={{ 
            objectFit: 'cover',
            width: '100%',
            height: '100%'
          }}
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
        <p className="text-lg mb-2 font-space font-bold">{formattedPrice}</p>
        
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
  const [currentSlide, setCurrentSlide] = React.useState(0);

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


  const ITEMS_PER_SLIDE = 4;
  const totalSlides = Math.ceil(productsToShow.length / ITEMS_PER_SLIDE);
  const shouldShowCarousel = productsToShow.length > ITEMS_PER_SLIDE;

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => prev === 0 ? totalSlides - 1 : prev - 1);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => prev === totalSlides - 1 ? 0 : prev + 1);
  };

  const getVisibleProducts = () => {
    if (!shouldShowCarousel) return productsToShow;
    
    const startIndex = currentSlide * ITEMS_PER_SLIDE;
    const endIndex = startIndex + ITEMS_PER_SLIDE;
    return productsToShow.slice(startIndex, endIndex);
  };

  return (
    <div className="text-center mt-8">
      {loading ? (
        <FullScreenLoader />
      ) : (
        <div className="relative overflow-hidden">
         
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex justify-center gap-4 px-4"
            >
              {getVisibleProducts().map((card, index) => (
                <motion.div
                  key={`${currentSlide}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex-shrink-0"
                >
                  <Card 
                    imageSrc={card.imageSrc} 
                    title={card.title}
                    price={card.price}
                    category={card.category}
                    productId={card.productId}
                    shopId={card.shopId}
                    onClick={card.onClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          

          {shouldShowCarousel && (
            <>
            
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
                style={{ marginLeft: '-20px' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
        
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors z-10"
                style={{ marginRight: '-20px' }}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
              
        
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
