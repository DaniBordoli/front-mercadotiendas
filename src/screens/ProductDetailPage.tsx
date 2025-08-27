import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useSearchStore } from '../stores';
import { useCartStore } from '../stores/cartStore';
import { useShopStore } from '../stores/slices/shopStore';
import { useAuthStore } from '../stores';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { FaStar, FaRegStar, FaChevronLeft, FaChevronRight, FaMinus, FaPlus, FaTruck, FaShieldAlt, FaCreditCard, FaHeart, FaSpinner } from 'react-icons/fa';
import { DesignButton } from '../components/atoms/DesignButton';
import { colors } from '../design/colors';
import { ReviewForm } from '../components/organisms/ReviewForm/ReviewForm';
import type { Review } from '../stores/searchStore';

const timeAgo = (isoDateString: string): string => {
    const date = new Date(isoDateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `Hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `Hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `Hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `Hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `Hace ${Math.floor(interval)} minutos`;
    return 'Hace un momento';
};

const RatingStars: React.FC<{ rating?: number, reviewCount?: number, showReviewCountLink?: boolean }> = ({ rating, reviewCount, showReviewCountLink = true }) => {
  // Si no hay rating, mostrar 0 estrellas
  const safeRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center text-yellow-500 mb-2">
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
      {reviewCount !== undefined && (
          <span className={`text-gray-500 text-xs ml-2 ${showReviewCountLink ? 'hover:underline cursor-pointer' : ''}`}>({reviewCount} reseñas)</span>
      )}
    </div>
  );
};

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  // Agregar hooks de navegación y ubicación
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedProduct,
    isLoadingProduct,
    fetchProductById,
    clearSelectedProduct,
    productReviews,
    isLoadingReviews,
    addReview,
    fetchRelatedProducts,
  } = useSearchStore();
  const addToCart = useCartStore(state => state.addToCart);
  const { getShop, shop } = useShopStore();
  const user = useAuthStore(state => state.user);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'especificaciones' | 'opiniones' | 'preguntas'>('descripcion');
  // Estados para productos relacionados
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [currentRelatedIndex, setCurrentRelatedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // Mostrar el nombre de la tienda del producto, no del usuario logueado
  const shopName = selectedProduct?.shop?.name || null;

  useEffect(() => {
    if (id) {
      console.log(`[Page] Obteniendo producto con ID: ${id}`);
      fetchProductById(id);
      setCurrentImageIndex(0);
      setQuantity(1);
    } else {
      console.error("[Page] No se encontró id en la URL.");
    }
    return () => {
      console.log("[Page] Limpiando producto seleccionado y reviews.");
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  // Cargar productos relacionados cuando se selecciona un producto
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (selectedProduct && id) {
        setIsLoadingRelated(true);
        try {
          const related = await fetchRelatedProducts(id);
          setRelatedProducts(related);
          setCurrentRelatedIndex(0); // Resetear índice
        } catch (error) {
          console.error('Error cargando productos relacionados:', error);
        } finally {
          setIsLoadingRelated(false);
        }
      }
    };
    
    loadRelatedProducts();
  }, [selectedProduct, id, fetchRelatedProducts]);

  // Manejar cambios de tamaño de ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Funciones para manejar navegación de productos relacionados
  const handlePrevRelated = () => {
    if (relatedProducts.length > 6) {
      setCurrentRelatedIndex(prev => Math.max(0, prev - 6));
    }
  };

  const handleNextRelated = () => {
    if (relatedProducts.length > 6) {
      const maxIndex = Math.max(0, relatedProducts.length - 6);
      setCurrentRelatedIndex(prev => Math.min(maxIndex, prev + 6));
    }
  };

  const canGoPrev = currentRelatedIndex > 0;
  const canGoNext = currentRelatedIndex + 6 < relatedProducts.length;

  // Obtener productos visibles (2 para mobile, 6 para web)
  const getVisibleProducts = () => {
    const itemsToShow = isMobile ? 2 : 6;
    return relatedProducts.slice(currentRelatedIndex, currentRelatedIndex + itemsToShow);
  };

  // Derivar breadcrumbs a partir del estado de navegación o del producto
  const navState: any = (location as any)?.state || {};
  const searchContext = (navState.searchContext || {}) as { type?: 'search' | 'category'; value?: string; previousPath?: string };
  const isFromCategory = searchContext.type === 'category';
  const isFromSearch = searchContext.type === 'search';

  const breadcrumbItems = (() => {
    const items: { label: string; onClick?: () => void; active?: boolean }[] = [];
    items.push({ label: 'Inicio', onClick: () => navigate('/') });
    if (isFromCategory && searchContext.value) {
      items.push({ label: 'Categorías', onClick: () => navigate('/categories') });
      items.push({
        label: String(searchContext.value),
        onClick: () => {
          if (searchContext.previousPath) {
            navigate(searchContext.previousPath);
          } else {
            navigate(`/search?category=${encodeURIComponent(String(searchContext.value))}`);
          }
        }
      });
    } else if (isFromSearch && searchContext.value) {
      items.push({
        label: 'Resultados',
        onClick: searchContext.previousPath
          ? () => navigate(searchContext.previousPath!)
          : () => navigate(`/search?q=${encodeURIComponent(String(searchContext.value))}`)
      });
      items.push({ label: `"${String(searchContext.value)}"` });
    } else if (selectedProduct && selectedProduct.categoria) {
      items.push({ label: 'Categorías', onClick: () => navigate('/categories') });
      const category = selectedProduct.categoria; // ensure non-undefined
      items.push({
        label: category,
        onClick: () => navigate(`/search?category=${encodeURIComponent(category)}`)
      });
    }
    return items;
  })();

  const Breadcrumbs = () => (
    <div className="container mx-auto px-4 pt-4 mt-2">
      <div className="py-4">
        <div className="flex items-center text-sm text-[#1c1c1e] font-medium">
          {breadcrumbItems.map((item, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="mx-2 text-xs text-[#666666]">›</span>}
              {item.onClick ? (
                <button onClick={item.onClick} className="hover:text-[#ff4f41]">{item.label}</button>
              ) : (
                <span className={item.active ? 'text-[#ff4f41] font-semibold' : ''}>{item.label}</span>
              )}
            </React.Fragment>
          ))}
          {breadcrumbItems.length > 0 && (
            <>
              <span className="mx-2 text-xs text-[#666666]">›</span>
              <span className="text-[#ff4f41] font-semibold">{selectedProduct?.name || 'Producto'}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? selectedProduct.imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === selectedProduct.imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = () => {
      if (!selectedProduct) return;
      addToCart(selectedProduct, quantity);
  };

  const handleOpenReviewForm = () => {
    setIsWritingReview(true);
  };

  const handleCancelReview = () => {
    setIsWritingReview(false);
  };

  const handleReviewSubmit = (reviewData: { rating: number; text: string }) => {
    if (!selectedProduct) return;
    console.log(`[Page] Enviando opinión para ${selectedProduct.id}:`, reviewData);
    addReview(selectedProduct.id, reviewData);
    setIsWritingReview(false);
  };

  if (isLoadingProduct) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.ultraLightGray }}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 flex justify-center items-center">
          <p>Cargando detalles del producto...</p>
        </main>
        <FooterHome />
      </div>
    );
  }

  if (!selectedProduct && id) {
     return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.ultraLightGray }}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 pt-6 pb-8">
           <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md border" style={{ borderColor: colors.lightGray }}>
             <h2 className="text-xl font-semibold mb-2" style={{ color: colors.darkGray }}>Producto no encontrado</h2>
             <p style={{ color: colors.mediumGray }}>No pudimos encontrar un producto con el ID "{id}".</p>
           </div>
        </main>
        <FooterHome />
      </div>
     );
  }

  if (!selectedProduct) {
       return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.ultraLightGray }}>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 pt-6 pb-8">
             <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md border" style={{ borderColor: colors.lightGray }}>
               <h2 className="text-xl font-semibold mb-2" style={{ color: colors.darkGray }}>Error</h2>
               <p style={{ color: colors.mediumGray }}>No se pudo cargar la información del producto.</p>
             </div>
          </main>
          <FooterHome />
        </div>
       );
  }

  const displayImageUrl = selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0
    ? selectedProduct.imageUrls[currentImageIndex]
    : 'https://placehold.co/600x600?text=No+Image';
    
  const formattedPrice = `$${selectedProduct.price.toLocaleString()}`;
  const oldPrice = selectedProduct.price < 1000 ? selectedProduct.price * 1.2 : selectedProduct.price + 100;
  const formattedOldPrice = `$${Math.round(oldPrice).toLocaleString()}`;
  const discountPercentage = Math.round(((oldPrice - selectedProduct.price) / oldPrice) * 100);

  const totalReviews = productReviews.length;
  const averageRating = totalReviews > 0
      ? productReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : selectedProduct.rating;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.ultraLightGray }}>
      <Navbar />
      {/* Breadcrumbs dinámicos */}
      <Breadcrumbs />
      <main className="flex-grow container mx-auto px-4 pt-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-6">
          {/* Product Gallery */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 mb-4">
                <img 
                  src={displayImageUrl} 
                  alt={selectedProduct.name} 
                  className="w-full h-[292px] md:h-[600px] object-cover transition-transform duration-300 hover:scale-110 cursor-zoom-in"
                  onClick={() => setIsZoomModalOpen(true)}
                />
                {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage} 
                      className="absolute top-1/2 left-4 transform -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-[#ff4f41] transition-colors shadow-lg border-2 border-transparent hover:border-[#ff4f41]"
                      aria-label="Previous Image"
                    >
                      <FaChevronLeft size={20}/>
                    </button>
                    <button 
                      onClick={handleNextImage} 
                      className="absolute top-1/2 right-4 transform -translate-y-1/2 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-[#ff4f41] transition-colors shadow-lg border-2 border-transparent hover:border-[#ff4f41]"
                      aria-label="Next Image"
                    >
                      <FaChevronRight size={20}/>
                    </button>
                  </>
                )}
                <button className="absolute top-4 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-[#ff4f41] transition-colors shadow-lg border-2 border-transparent hover:border-[#ff4f41]">
                  <FaHeart className="text-xl text-[#ff4f41]" />
                </button>
              </div>
              {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                <div className="grid grid-cols-6 gap-3">
                  {selectedProduct.imageUrls.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-full h-16 md:h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-[#ff4f41] opacity-100' 
                          : 'border-transparent hover:border-[#ff4f41] opacity-60 hover:opacity-100'
                      } bg-gradient-to-br from-gray-50 to-gray-100`}
                    >
                      <img src={url} alt={`Vista ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Product Info */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm border border-[#e5e5e7] md:pt-8 pt-6">
              {/* Badges de estado del producto */}
               <div className="flex items-center gap-2 mb-3 md:px-0 px-2">
              {selectedProduct.condition === 'new' && (
                <span className="px-3 py-1 bg-[#ff4f41]/10 text-[#ff4f41] rounded-full text-sm font-semibold">Nuevo</span>
              )}
              {selectedProduct.condition === 'used' && (
                <span className="px-3 py-1 bg-orange-500/10 text-orange-700 rounded-full text-sm font-semibold">Usado</span>
              )}
              {/* Badge destacado - se puede mostrar condicionalmente */}
              <span className="px-3 py-1 bg-[#00a699]/10 text-[#00a699] rounded-full text-sm font-semibold">Destacado</span>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold font-space mb-1.5" style={{ color: colors.darkGray }}>{selectedProduct.name}</h1>
            
            <div className="flex items-center text-xs mb-2 font-medium" style={{color: colors.mediumGray}}>
                {shopName ? (
                  <span>Tienda: {shopName}</span>
                ) : (
                  <span>SKU: {selectedProduct.id.toUpperCase().substring(0,8)}</span>
                )}
                {shopName && <span className='mx-2'>|</span>}
                {shopName && <span>Vendido por: <a href="#" className="text-sky-600 hover:underline">{shopName}</a></span>}
            </div>

            <RatingStars rating={averageRating} reviewCount={totalReviews} showReviewCountLink={true} />

            <div className="my-4">
                 <span className="text-3xl lg:text-4xl font-semibold mr-3" style={{color: colors.darkGray}}>{formattedPrice}</span>
                 {discountPercentage > 0 && (
                     <span className="text-lg line-through mr-2" style={{color: colors.mediumGray}}>{formattedOldPrice}</span>
                 )}
                 
                 {/* Badge de descuento */}
                 {discountPercentage > 0 && (
                   <div className="mt-2">
                     <span className="inline-block px-3 py-1 bg-[#ff4f41]/10 text-[#ff4f41] rounded-full text-sm font-semibold">
                       Ahorrás ${Math.round(oldPrice - selectedProduct.price).toLocaleString()} - {discountPercentage}% OFF
                     </span>
                   </div>
                 )}
                 
                 {selectedProduct.hasFreeShipping && (
                    <p className="text-sm mt-2 font-medium flex items-center" style={{ color: colors.accentTeal }}>
                        <FaTruck className="mr-1.5"/> Envío gratis
                    </p>
                )}
            </div>

            <div className="mb-6">
              {selectedProduct.variantes && selectedProduct.variantes.length > 0 ? (
                <div className="space-y-4">
                  {selectedProduct.variantes.map((variante, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.darkGray }}>
                        {variante.tipo}:
                      </label>
                      <select
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none w-full max-w-xs"
                        value={selectedVariants[variante.tipo] || ''}
                        onChange={e => setSelectedVariants(prev => ({ 
                          ...prev, 
                          [variante.tipo]: e.target.value 
                        }))}
                      >
                        <option value="">Seleccionar {variante.tipo.toLowerCase()}...</option>
                        {variante.valores.map((valor, valueIndex) => (
                          <option key={valueIndex} value={valor}>
                            {valor}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Este producto no tiene variantes disponibles.
                </div>
              )}
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 sr-only" style={{ color: colors.darkGray }}>Cantidad:</label>
                        <div className="inline-flex items-center border rounded overflow-hidden" style={{borderColor: colors.lightGray}}>
                            <button onClick={decreaseQuantity} className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none" disabled={quantity <= 1} aria-label="Disminuir cantidad">
                                <FaMinus size={12} style={{color: colors.mediumGray}}/>
                            </button>
                            <span className="px-4 py-1.5 text-base font-medium w-12 text-center border-l border-r" style={{ color: colors.darkGray, borderColor: colors.lightGray }}>{quantity}</span>
                            <button onClick={increaseQuantity} className="px-3 py-2 hover:bg-gray-100 focus:outline-none" aria-label="Aumentar cantidad">
                                <FaPlus size={12} style={{color: colors.mediumGray}}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Trust Badges */}
                <div className="space-y-2 mb-8" id="trust-badges">
                    <div className="flex items-center text-sm text-[#00a699]">
                        <FaTruck className="mr-2" />
                        <span className="font-semibold">Envío gratis</span>
                    </div>
                    <div className="flex items-center text-sm text-[#00a699]">
                        <FaShieldAlt className="mr-2" />
                        <span className="font-semibold">Garantía 2 años</span>
                    </div>
                    <div className="flex items-center text-sm text-[#00a699]">
                        <FaCreditCard className="mr-2" />
                        <span className="font-semibold">Pago seguro</span>
                    </div>
                </div>

                {/* Purchase Buttons */}
                <div className="space-y-3 mt-4 mb-6" id="purchase-buttons">
                    <button 
                        onClick={() => {
                            // Lógica básica para comprar ahora (por ahora solo añade al carrito)
                            handleAddToCart();
                        }}
                        className="w-full py-4 bg-[#ff4f41] border-2 border-[#ff4f41] text-white rounded-lg font-semibold text-lg text-center hover:bg-[#ff4f41]/80 transition-colors"
                    >
                        Comprar ahora
                    </button>
                    <button 
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-white border-2 border-[#ff4f41] text-[#ff4f41] rounded-lg font-semibold text-lg hover:bg-[#ff4f41]/5 transition-colors"
                    >
                        Agregar al carrito
                    </button>
                </div>

                {/* Seller Info */}
                <div className="bg-gray-50 p-4 rounded-lg" id="seller-info">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <img className="w-10 h-10 rounded-full object-cover mr-3" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="TechStore" />
                            <div>
                                <h4 className="font-semibold text-[#1c1c1e] text-sm">{shopName || 'TechStore Pro'}</h4>
                                <div className="flex items-center">
                                    <div className="flex text-yellow-400 text-xs mr-2">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                    <span className="text-xs text-[#666666]">(4.9)</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 bg-white border border-[#e5e5e7] text-[#666666] rounded-lg hover:bg-gray-50 transition-colors text-xs hidden md:block">
                                Ver tienda
                            </button>
                            <button className="px-3 py-1 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/80 transition-colors text-xs">
                                Seguir
                            </button>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs - Desktop version */}
        <div className="mb-8 hidden md:block" id="product-tabs">
            <div className="border-b border-[#e5e5e7]">
                <nav className="flex space-x-8">
                    <button 
                        onClick={() => setActiveTab('descripcion')}
                        className={`py-4 px-1 border-b-2 font-medium ${
                            activeTab === 'descripcion' 
                                ? 'border-[#ff4f41] text-[#ff4f41]' 
                                : 'border-transparent text-[#666666] hover:text-[#1c1c1e]'
                        }`}
                    >
                        Descripción
                    </button>
                    <button 
                        onClick={() => setActiveTab('especificaciones')}
                        className={`py-4 px-1 border-b-2 font-medium ${
                            activeTab === 'especificaciones' 
                                ? 'border-[#ff4f41] text-[#ff4f41]' 
                                : 'border-transparent text-[#666666] hover:text-[#1c1c1e]'
                        }`}
                    >
                        Especificaciones
                    </button>
                    <button 
                        onClick={() => setActiveTab('opiniones')}
                        className={`py-4 px-1 border-b-2 font-medium ${
                            activeTab === 'opiniones' 
                                ? 'border-[#ff4f41] text-[#ff4f41]' 
                                : 'border-transparent text-[#666666] hover:text-[#1c1c1e]'
                        }`}
                    >
                        Opiniones ({totalReviews})
                    </button>
                    <button 
                        onClick={() => setActiveTab('preguntas')}
                        className={`py-4 px-1 border-b-2 font-medium ${
                            activeTab === 'preguntas' 
                                ? 'border-[#ff4f41] text-[#ff4f41]' 
                                : 'border-transparent text-[#666666] hover:text-[#1c1c1e]'
                        }`}
                    >
                        Preguntas
                    </button>
                </nav>
            </div>
            
            {/* Desktop Tab Content */}
            {activeTab === 'descripcion' && (
                <div className="py-6">
                    <div className="prose max-w-none">
                        <div className="text-[#666666] leading-relaxed space-y-3">
                            {selectedProduct.descripcion || selectedProduct.description ? (
                                <p>{selectedProduct.descripcion || selectedProduct.description}</p>
                            ) : (
                                <p className="italic text-gray-400">Este producto no tiene descripción.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'especificaciones' && (
                <div className="py-6">
                    <div className="text-[#666666] space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-800 mb-2">Características Generales</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Marca:</span>
                                        <span className="font-medium">{selectedProduct.brand || 'No especificado'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Nombre:</span>
                                        <span className="font-medium">{selectedProduct.name || 'No especificado'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Categoría:</span>
                                        <span className="font-medium">{selectedProduct.categoria || 'Sin categoría'}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Condición:</span>
                                        <span className="font-medium">{selectedProduct.condition === 'new' ? 'Nuevo' : 'Usado'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-gray-800 mb-2">Especificaciones Técnicas</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Dimensiones:</span>
                                        <span className="font-medium">25 x 15 x 8 cm</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Material:</span>
                                        <span className="font-medium">Plástico ABS</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Garantía:</span>
                                        <span className="font-medium">12 meses</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-100 pb-1">
                                        <span className="text-gray-600">Origen:</span>
                                        <span className="font-medium">Importado</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'opiniones' && (
                <div className="py-6">
                    <div className="space-y-6">
                        {/* Resumen de calificaciones */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-semibold text-gray-800">Calificaciones de clientes</h4>
                                <div className="flex items-center space-x-2">
                                    <div className="flex text-yellow-400">
                                        {'★'.repeat(4)}{'☆'.repeat(1)}
                                    </div>
                                    <span className="text-gray-600">4.2 de 5</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                {[5,4,3,2,1].map(stars => (
                                    <div key={stars} className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600 w-8">{stars}★</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-400 h-2 rounded-full" 
                                                style={{width: `${stars === 5 ? 45 : stars === 4 ? 35 : stars === 3 ? 15 : stars === 2 ? 3 : 2}%`}}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">{stars === 5 ? 45 : stars === 4 ? 35 : stars === 3 ? 15 : stars === 2 ? 3 : 2}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Opiniones individuales */}
                        <div className="space-y-4">
                            {[
                                {
                                    nombre: 'María González',
                                    fecha: '15 de Enero, 2024',
                                    calificacion: 5,
                                    titulo: 'Excelente producto',
                                    comentario: 'Muy buena calidad, llegó rápido y en perfectas condiciones. Lo recomiendo totalmente.'
                                },
                                {
                                    nombre: 'Carlos Rodríguez',
                                    fecha: '10 de Enero, 2024',
                                    calificacion: 4,
                                    titulo: 'Buena compra',
                                    comentario: 'El producto cumple con lo esperado. La entrega fue puntual y el empaque estaba bien.'
                                },
                                {
                                    nombre: 'Ana López',
                                    fecha: '5 de Enero, 2024',
                                    calificacion: 4,
                                    titulo: 'Satisfecha con la compra',
                                    comentario: 'Buen producto, aunque esperaba que fuera un poco más grande. En general estoy conforme.'
                                }
                            ].map((opinion, index) => (
                                <div key={index} className="border-b border-gray-100 pb-4">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h5 className="font-medium text-gray-800">{opinion.nombre}</h5>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <div className="flex text-yellow-400 text-sm">
                                                    {'★'.repeat(opinion.calificacion)}{'☆'.repeat(5-opinion.calificacion)}
                                                </div>
                                                <span className="text-sm text-gray-500">{opinion.fecha}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <h6 className="font-medium text-gray-800 mb-1">{opinion.titulo}</h6>
                                    <p className="text-gray-600 text-sm">{opinion.comentario}</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Ver todas las opiniones
                        </button>
                    </div>
                </div>
            )}
            
            {activeTab === 'preguntas' && (
                <div className="py-6">
                    <div className="space-y-6">
                        {/* Hacer una pregunta */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2">¿Tienes alguna pregunta sobre este producto?</h4>
                            <p className="text-gray-600 text-sm mb-3">Pregúntale al vendedor y otros compradores te ayudarán</p>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Hacer una pregunta
                            </button>
                        </div>

                        {/* Preguntas y respuestas */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-800">Preguntas y respuestas</h4>
                            
                            {[
                                {
                                    pregunta: '¿Viene con garantía?',
                                    usuario: 'Pedro M.',
                                    fecha: '12 de Enero, 2024',
                                    respuesta: 'Sí, incluye garantía oficial de 12 meses.',
                                    respondidoPor: 'Vendedor',
                                    fechaRespuesta: '12 de Enero, 2024'
                                },
                                {
                                    pregunta: '¿Cuánto tiempo tarda en llegar?',
                                    usuario: 'Laura S.',
                                    fecha: '8 de Enero, 2024',
                                    respuesta: 'El envío demora entre 3 a 5 días hábiles dependiendo de tu ubicación.',
                                    respondidoPor: 'Vendedor',
                                    fechaRespuesta: '8 de Enero, 2024'
                                },
                                {
                                    pregunta: '¿Está disponible en otros colores?',
                                    usuario: 'Miguel R.',
                                    fecha: '5 de Enero, 2024',
                                    respuesta: 'Por el momento solo tenemos disponible en el color mostrado en las imágenes.',
                                    respondidoPor: 'Vendedor',
                                    fechaRespuesta: '6 de Enero, 2024'
                                }
                            ].map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    {/* Pregunta */}
                                    <div className="mb-3">
                                        <div className="flex items-start justify-between mb-1">
                                            <h5 className="font-medium text-gray-800">P: {item.pregunta}</h5>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Por {item.usuario} • {item.fecha}
                                        </div>
                                    </div>
                                    
                                    {/* Respuesta */}
                                    {item.respuesta && (
                                        <div className="bg-gray-50 p-3 rounded">
                                            <div className="mb-1">
                                                <span className="font-medium text-gray-800">R: </span>
                                                <span className="text-gray-700">{item.respuesta}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Por {item.respondidoPor} • {item.fechaRespuesta}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Ver todas las preguntas
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Mobile Description Card */}
        <div className="mb-8 md:hidden">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e5e5e7]">
                <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4">Descripción</h3>
                <div className="text-[#666666] leading-relaxed text-left">
                    {selectedProduct.descripcion || selectedProduct.description ? (
                        <p>{selectedProduct.descripcion || selectedProduct.description}</p>
                    ) : (
                        <p className="italic text-gray-400">Este producto no tiene descripción.</p>
                    )}
                </div>
            </div>
        </div>

        {/* Related Products */}
        <div className="mb-12" id="related-products">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold font-space text-[#1c1c1e]">También te puede interesar</h3>
                {!isMobile && relatedProducts.length > 6 && (
                    <div className="flex items-center gap-2 mb-3 md:px-0 px-2">
                        <button 
                            onClick={handlePrevRelated}
                            disabled={!canGoPrev}
                            className={`w-10 h-10 bg-white border border-[#e5e5e7] rounded-lg flex items-center justify-center transition-colors ${
                                canGoPrev ? 'hover:bg-[#f8f8f8] text-[#666666]' : 'text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <FaChevronLeft />
                        </button>
                        <button 
                            onClick={handleNextRelated}
                            disabled={!canGoNext}
                            className={`w-10 h-10 bg-white border border-[#e5e5e7] rounded-lg flex items-center justify-center transition-colors ${
                                canGoNext ? 'hover:bg-[#f8f8f8] text-[#666666]' : 'text-gray-300 cursor-not-allowed'
                            }`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                )}
            </div>
            
            {isLoadingRelated ? (
                <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin text-2xl text-[#ff4f41]" />
                    <span className="ml-2 text-gray-600">Cargando productos relacionados...</span>
                </div>
            ) : relatedProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No se encontraron productos relacionados</p>
                </div>
            ) : (
                <div className={`grid gap-0 md:gap-4 ${
                    isMobile ? 'grid-cols-2 justify-center justify-items-center' : 'grid-cols-3 lg:grid-cols-6'
                }`}>
                    {getVisibleProducts().map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white md:rounded-xl max-md:rounded-none shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-md transition-shadow cursor-pointer max-md:w-[140px] max-md:h-[169px]"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
                            <img 
                                className="w-full md:h-36 max-md:h-20 object-cover" 
                                src={product.imageUrls?.[0] || product.imagen || product.images?.[0] || '/placeholder-image.jpg'} 
                                alt={product.name || product.nombre || 'Producto'}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-image.jpg';
                                }}
                            />
                            <div className="md:p-3 max-md:p-2">
                                <h4 className="font-semibold text-[#1c1c1e] mb-1 md:text-sm max-md:text-xs line-clamp-2">
                                    {product.name || product.nombre || 'Producto sin nombre'}
                                </h4>
                                <div className="md:text-base max-md:text-sm font-bold text-[#1c1c1e] mb-2">
                                    ${product.price || product.precio || '0.00'}
                                </div>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const productToAdd = {
                                            id: product.id,
                                            name: product.name || product.nombre || 'Producto',
                                            price: parseFloat(product.price?.toString() || product.precio?.toString() || '0'),
                                            imageUrls: product.imageUrls || (product.imagen ? [product.imagen] : (product.images || ['/placeholder-image.jpg'])),
                                            condition: 'new' as const,
                                            categoria: product.categoria || product.category || '',
                                            storeName: product.storeName || product.shop?.name || '',
                                            shop: product.shop
                                        };
                                        addToCart(productToAdd, 1);
                                    }}
                                    className="w-full md:py-1.5 max-md:py-1 bg-[#ff4f41] text-white md:rounded-lg max-md:rounded hover:bg-[#ff4f41]/80 transition-colors md:text-xs max-md:text-xs"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            

        </div>

      </main>
      <FooterHome />

      {isWritingReview && selectedProduct && (
        <ReviewForm
            productId={selectedProduct.id}
            onCancel={handleCancelReview}
            onSubmit={handleReviewSubmit}
        />
      )}
      
      {/* Modal de Zoom */}
      {isZoomModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-4xl p-4">
            <button 
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl hover:text-gray-300 z-10"
            >
              ×
            </button>
            <img 
              src={displayImageUrl} 
              alt={selectedProduct?.name} 
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;