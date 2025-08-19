import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';
import '../../../styles/responsive.css';
import { useSearchStore } from '../../../stores';
import FullScreenLoader from '../FullScreenLoader';
import { useCartStore } from '../../../stores/cartStore';
import { FaHeart } from 'react-icons/fa';

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
  const { addToCart } = useCartStore();
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (productId && shopId) {
      try {
        // Obtener el producto completo del store antes de agregarlo al carrito
        await fetchProductById(productId);
        // El producto se almacena en selectedProduct del store
        const { selectedProduct } = useSearchStore.getState();
        
        if (selectedProduct) {
          addToCart(selectedProduct, 1);
        } else {
          // Fallback: crear un producto básico si no se puede obtener del store
          const product = {
            id: productId,
            name: title || '',
            price: price || 0,
            imageUrls: imageSrc ? [imageSrc] : [],
            condition: 'new' as const,
            categoria: category || ''
          };
          addToCart(product, 1);
        }
      } catch (error) {
        console.error('Error al obtener producto para el carrito:', error);
        // Fallback en caso de error
        const product = {
          id: productId,
          name: title || '',
          price: price || 0,
          imageUrls: imageSrc ? [imageSrc] : [],
          condition: 'new' as const,
          categoria: category || ''
        };
        addToCart(product, 1);
      }
    }
  };

  const formattedPrice = price !== undefined 
    ? `$${price.toLocaleString()}`
    : "Precio no disponible";

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
      onClick={handleCardClick}
      style={{ 
        width: '290px',
        height: '338.96px',
        minWidth: '290px',
        maxWidth: '290px'
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
      
      <div className="relative" style={{ width: '287.33px', height: '161.63px' }}>
        <div className="w-full h-full bg-gray-100">
          <img
            className="w-full h-full object-cover"
            src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
            alt={title}
          />
        </div>
        <button className="absolute top-3 left-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
          <FaHeart className="text-[#666666] hover:text-[#ff4f41] transition-colors" />
        </button>
      </div>
      
      <div className="p-4" style={{ width: '287.33px', height: '174.67px' }}>
        <h3 className="text-base font-semibold text-[#1c1c1e] mb-2 text-left">{title}</h3>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 text-sm mr-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 576 512">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
          </div>
          <span className="text-xs text-[#666666]">(124)</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-[#1c1c1e]">{formattedPrice}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleAddToCart}
            className="flex-1 py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors"
          >
            Agregar
          </button>
          <button 
            onClick={handleCardClick}
            className="px-4 py-2 border border-[#e5e5e7] text-[#666666] rounded-lg text-sm font-medium hover:border-[#ff4f41] hover:text-[#ff4f41] transition-colors opacity-0 group-hover:opacity-100"
          >
            Ver más
          </button>
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

  // Mostrar solo productos reales, nunca los mock
  const productsToShow = products && products.length > 0
    ? products.map((prod, idx) => ({
        imageSrc: prod.productImages?.[0] || prod.productImage || '',
        title: prod.nombre,
        price: prod.precio,
        category: prod.categoria || prod.estado || 'General',
        productId: prod._id,
        shopId: typeof prod.shop === 'object' ? prod.shop._id : prod.shop,
        onClick: undefined,
        isLoading: loadingProductId === prod._id,
      }))
    : [];


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
