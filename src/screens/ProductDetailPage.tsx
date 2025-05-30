import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSearchStore } from '../stores';
import { useCartStore } from '../stores/cartStore';
import { Navbar } from '../components/organisms/Navbar';
import { Footer } from '../components/organisms/Footer';
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
  const { id } = useParams<{ id: string }>(); // Cambiado de productId a id
  const {
    selectedProduct,
    isLoadingProduct,
    fetchProductById,
    clearSelectedProduct,
    productReviews,
    isLoadingReviews,
    addReview,
  } = useSearchStore();
  const addToCart = useCartStore(state => state.addToCart);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWritingReview, setIsWritingReview] = useState(false);

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
        <Footer />
      </div>
    );
  }

  if (!selectedProduct && id) {
     return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.ultraLightGray }}>
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
           <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md border" style={{ borderColor: colors.lightGray }}>
             <h2 className="text-xl font-semibold mb-2" style={{ color: colors.darkGray }}>Producto no encontrado</h2>
             <p style={{ color: colors.mediumGray }}>No pudimos encontrar un producto con el ID "{id}".</p>
           </div>
        </main>
        <Footer />
      </div>
     );
  }

  if (!selectedProduct) {
       return (
        <div className="flex flex-col min-h-screen" style={{ backgroundColor: colors.ultraLightGray }}>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
             <div className="text-center py-10 bg-white p-6 rounded-lg shadow-md border" style={{ borderColor: colors.lightGray }}>
               <h2 className="text-xl font-semibold mb-2" style={{ color: colors.darkGray }}>Error</h2>
               <p style={{ color: colors.mediumGray }}>No se pudo cargar la información del producto.</p>
             </div>
          </main>
          <Footer />
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
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-6 md:py-10 md:px-12 rounded-lg shadow-md border grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16" style={{ borderColor: colors.lightGray }}>
          
          <div className="flex flex-col items-center">
            <div className="relative group w-full aspect-square flex justify-center items-center mb-4 border rounded-md overflow-hidden" style={{ borderColor: colors.lightGray }}>
              <img 
                src={displayImageUrl} 
                alt={selectedProduct.name} 
                className="max-w-full max-h-full object-contain transition-opacity duration-300"
              />
              {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage} 
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Previous Image"
                  >
                    <FaChevronLeft size={20}/>
                  </button>
                  <button 
                    onClick={handleNextImage} 
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none z-10"
                    aria-label="Next Image"
                  >
                    <FaChevronRight size={20}/>
                  </button>
                </>
              )}
            </div>
            {selectedProduct.imageUrls && selectedProduct.imageUrls.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-1 justify-center w-full">
                {selectedProduct.imageUrls.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 flex-shrink-0 rounded border-2 p-0.5 overflow-hidden focus:outline-none transition-all duration-200 ${index === currentImageIndex ? 'border-sky-500' : 'border-transparent hover:border-gray-300'}`}
                  >
                    <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {selectedProduct.condition === 'new' && (
              <span className="text-xs font-medium text-blue-700 mb-1 self-start">Nuevo</span>
            )}
            {selectedProduct.condition === 'used' && (
              <span className="text-xs font-medium text-orange-700 mb-1 self-start">Usado</span>
            )}
            
            <h1 className="text-2xl lg:text-3xl font-bold font-space mb-1.5" style={{ color: colors.darkGray }}>{selectedProduct.name}</h1>
            
            <div className="flex items-center text-xs mb-2 font-medium" style={{color: colors.mediumGray}}>
                <span>SKU: {selectedProduct.id.toUpperCase().substring(0,8)}</span> 
                {selectedProduct.storeName && <span className='mx-2'>|</span>} 
                {selectedProduct.storeName && <span>Vendido por: <a href="#" className="text-sky-600 hover:underline">{selectedProduct.storeName}</a></span>}
            </div>

            <RatingStars rating={averageRating} reviewCount={totalReviews} showReviewCountLink={true} />

            <div className="my-4">
                 <span className="text-3xl lg:text-4xl font-semibold mr-3" style={{color: colors.darkGray}}>{formattedPrice}</span>
                 {discountPercentage > 0 && (
                     <>
                        <span className="text-lg line-through mr-2" style={{color: colors.mediumGray}}>{formattedOldPrice}</span>
                        <span className="text-lg font-semibold" style={{color: colors.accentTeal}}>{discountPercentage}% OFF</span>
                     </>
                 )}
                 {selectedProduct.hasFreeShipping && (
                    <p className="text-sm mt-2 font-medium flex items-center" style={{ color: colors.accentTeal }}>
                        <FaTruck className="mr-1.5"/> Envío gratis
                    </p>
                )}
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: colors.darkGray }}>Color:</label>
                <div className="flex space-x-2">
                    <button className="w-8 h-8 rounded-full bg-black border-2 border-sky-500 ring-1 ring-offset-1 ring-sky-500 focus:outline-none" aria-label="Color Negro"></button>
                    <button className="w-8 h-8 rounded-full bg-gray-300 border-2 border-transparent hover:border-gray-400 focus:outline-none focus:border-gray-500" aria-label="Color Gris"></button>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
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
                <div className="flex-grow">
                    <DesignButton 
                        variant="primary"
                        onClick={handleAddToCart}
                        fullWidth
                        className='text-base font-space'
                        style={{ height: '48px'}}
                    >
                        Añadir al carrito
                    </DesignButton>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm" style={{color: colors.mediumGray}}>
                 <div className="flex items-center">
                     <FaTruck size={16} className="mr-2" style={{ color: colors.primaryRed }}/> Envío en 24/48h
                 </div>
                 <div className="flex items-center">
                     <FaShieldAlt size={16} className="mr-2" style={{ color: colors.primaryRed }}/> Garantía de calidad
                 </div>
                 <div className="flex items-center">
                     <FaCreditCard size={16} className="mr-2" style={{ color: colors.primaryRed }}/> Pago seguro
                 </div>
                 <div className="flex items-center">
                     <FaTruck size={16} className="mr-2" style={{ color: colors.primaryRed }}/> Devolución gratuita
                 </div>
            </div>

            <div className="mt-8 pt-6 border-t" style={{ borderColor: colors.lightGray }}>
                <h2 className="text-lg font-bold font-space mb-3" style={{ color: colors.darkGray }}>Descripción</h2>
                <div className="text-sm leading-relaxed space-y-3" style={{ color: colors.mediumGray }}>
                    <p>
                        Experimenta el máximo rendimiento con la "{selectedProduct.name}".
                        Equipada con componentes de última generación y diseñada para los gamers más exigentes.
                    </p>
                    <p>
                        {selectedProduct.storeName ? `Vendido por ${selectedProduct.storeName}, esta` : 'Esta'} laptop ofrece gráficos impresionantes y una velocidad de procesamiento increíble para tus juegos y tareas intensivas.
                        {selectedProduct.condition === 'new' ? ' Totalmente nueva y lista para desatar su poder.' : ' En excelente estado de segunda mano, comprobada para asegurar su rendimiento.'}
                    </p>
                </div>
            </div>

          </div>
        </div> 

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border mt-8" style={{ borderColor: colors.lightGray }}>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold font-space" style={{ color: colors.darkGray }}>Opiniones de clientes ({totalReviews})</h2>
                 <DesignButton variant="secondary" size='medium' onClick={handleOpenReviewForm}>
                    Escribir opinión
                 </DesignButton>
            </div>
            
            {isLoadingReviews ? (
                <div className="flex justify-center items-center py-6">
                    <FaSpinner className="animate-spin text-sky-500 mr-2" size={20}/>
                    <span style={{ color: colors.mediumGray }}>Cargando opiniones...</span>
                </div>
            ) : totalReviews > 0 ? (
                <div className="space-y-5">
                    {productReviews.map((review) => (
                        <div key={review.id} className="border rounded-md p-4 bg-gray-50" style={{borderColor: colors.lightGray}}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-sm" style={{color: colors.darkGray}}>{review.userName}</span>
                                <span className="text-xs" style={{color: colors.mediumGray}}>{timeAgo(review.createdAt)}</span>
                            </div>
                            <RatingStars rating={review.rating} showReviewCountLink={false}/> 
                            <p className="text-sm mt-1" style={{color: colors.mediumGray}}>{review.text}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-sm py-6" style={{ color: colors.mediumGray }}>
                    Todavía no hay opiniones para este producto. ¡Sé el primero en escribir una!
                </p>
            )}
        </div>

         <div className="mt-12">
             <h2 className="text-xl font-bold font-space mb-6 text-center md:text-left" style={{ color: colors.darkGray }}>Productos relacionados</h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[...Array(4)].map((_, i) => (
                     <div key={i} className="bg-white rounded-lg shadow border overflow-hidden flex flex-col group" style={{ borderColor: colors.lightGray }}>
                         <div className="aspect-[4/3] w-full overflow-hidden">
                             <img 
                                src={`https://placehold.co/300x225?text=Relacionado+${i+1}`} 
                                alt={`Producto relacionado ${i+1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                             />
                         </div>
                         <div className="p-4 flex flex-col flex-grow">
                            <p className="text-sm font-medium text-left line-clamp-2 mb-2 flex-grow" style={{color: colors.darkGray}}>Nombre Producto Relacionado {i+1}</p>
                            <div className="flex justify-between items-center mt-auto pt-2">
                                <p className="text-lg font-semibold" style={{color: colors.darkGray}}>$ {(100 + i * 50).toLocaleString()}</p>
                                <button className="p-1 text-gray-400 hover:text-red-500 focus:outline-none transition-colors" aria-label="Añadir a favoritos">
                                    <FaHeart size={18}/>
                                </button>
                            </div>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

      </main>
      <Footer />

      {isWritingReview && selectedProduct && (
        <ReviewForm
            productId={selectedProduct.id}
            onCancel={handleCancelReview}
            onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default ProductDetailPage;