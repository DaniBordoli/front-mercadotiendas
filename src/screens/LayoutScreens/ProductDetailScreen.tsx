import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaChevronRight, FaStar, FaRegStar, FaHeart, FaTruck, FaUndo } from 'react-icons/fa';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useSearchStore } from '../../stores/searchStore';
import { useCartStore } from '../../stores/cartStore';
import FullScreenLoader from '../../components/molecules/FullScreenLoader';

// Tipos adicionales para la interfaz de Product si es necesario
declare module '../../stores/searchStore' {
  interface Product {
    description?: string;
    features?: string[];
    oldPrice?: number;
  }
}

const ProductDetailScreen: React.FC = () => {
  const { id, productId } = useParams<{ id?: string; productId?: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'description' | 'reviews'>('description');
  const [notification, setNotification] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  
  // Usar productId si está disponible (desde ShopView), sino usar id (desde rutas normales)
  const actualProductId = productId || id;
  
  const { 
    selectedProduct, 
    isLoadingProduct, 
    fetchProductById, 
    clearSelectedProduct,
    productReviews,
    baseSearchResults
  } = useSearchStore();
  
  const addToCart = useCartStore(state => state.addToCart);

  // Función para cargar reseñas desde el backend
  const fetchReviews = async (productId: string) => {
    setIsLoadingReviews(true);
    try {
      const response = await fetch(`${API_URL}/reviews/product/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        // El backend devuelve las reseñas en la propiedad 'message'
        const reviewsData = data.message || data.data || [];
        // Asegurar que reviewsData es un array
        const reviewsArray = Array.isArray(reviewsData) ? reviewsData : [];
        setReviews(reviewsArray);
      } else {
        console.error('Error al cargar reseñas:', await response.text());
        setReviews([]);
        // Opcional: mostrar notificación de error al usuario
        if (response.status === 404) {
          // Producto no encontrado, pero no es crítico para mostrar la página
          console.warn('Producto no encontrado para cargar reseñas');
        } else if (response.status >= 500) {
          // Error del servidor
          console.error('Error del servidor al cargar reseñas');
        }
      }
    } catch (error) {
      console.error('Error al cargar reseñas:', error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Función para enviar reseña al backend
  const submitReview = async (reviewData: { rating: number; comment: string }) => {
    if (!user || !isAuthenticated) {
      setNotification({
        show: true,
        message: 'Debes iniciar sesión para escribir una reseña'
      });
      setTimeout(() => setNotification({show: false, message: ''}), 3000);
      return;
    }

    const token = getStorageItem('token');
    if (!token) {
      setNotification({
        show: true,
        message: 'No tienes permisos para escribir una reseña'
      });
      setTimeout(() => setNotification({show: false, message: ''}), 3000);
      return;
    }

    setIsSubmittingReview(true);
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: actualProductId,
          rating: reviewData.rating,
          comment: reviewData.comment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setNotification({
          show: true,
          message: 'Reseña enviada correctamente!'
        });
        setIsWritingReview(false);
        
        // Recargar reseñas después de crear una nueva
        if (actualProductId) {
          await fetchReviews(actualProductId);
        }
      } else {
        const errorData = await response.json();
        let errorMessage = 'Error al enviar la reseña';
        
        // Mensajes de error específicos según el código de estado
        if (response.status === 400) {
          if (errorData.message?.includes('rating')) {
            errorMessage = 'Por favor, selecciona una calificación del 1 al 5';
          } else if (errorData.message?.includes('comment')) {
            errorMessage = 'Por favor, escribe un comentario para tu reseña';
          } else if (errorData.message?.includes('productId')) {
            errorMessage = 'Producto no válido';
          } else if (errorData.message?.includes('ya has enviado')) {
            errorMessage = 'Ya has enviado una reseña para este producto';
          } else {
            errorMessage = errorData.message || 'Datos de la reseña inválidos';
          }
        } else if (response.status === 401) {
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
        } else if (response.status === 404) {
          errorMessage = 'Producto no encontrado';
        } else if (response.status === 500) {
          errorMessage = 'Error interno del servidor. Intenta nuevamente más tarde';
        } else {
          errorMessage = errorData.message || 'Error desconocido al enviar la reseña';
        }
        
        setNotification({
          show: true,
          message: errorMessage
        });
      }
    } catch (error) {
      console.error('Error al enviar reseña:', error);
      let errorMessage = 'Error de conexión. Verifica tu conexión a internet';
      
      // Verificar si es un error de red
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet';
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }
      
      setNotification({
        show: true,
        message: errorMessage
      });
    } finally {
      setIsSubmittingReview(false);
    }
    
    setTimeout(() => setNotification({show: false, message: ''}), 3000);
  };

  // Funciones para manejar reseñas
  const handleOpenReviewForm = () => {
    if (!user || !isAuthenticated) {
      setNotification({
        show: true,
        message: 'Debes iniciar sesión para escribir una reseña'
      });
      setTimeout(() => setNotification({show: false, message: ''}), 3000);
      return;
    }
    setIsWritingReview(true);
  };

  const handleCancelReview = () => {
    setIsWritingReview(false);
  };

  const handleReviewSubmit = async (reviewData: { rating: number; comment: string }) => {
    await submitReview(reviewData);
  };

  // Calcular estadísticas de reseñas
  const totalReviews = Array.isArray(reviews) ? reviews.length : 0;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / totalReviews
    : selectedProduct?.rating || 0;

  // Cargar los datos del producto cuando se monta el componente
  useEffect(() => {
    if (actualProductId) {
      console.log(`[ProductDetailScreen] Cargando producto con ID: ${actualProductId}`);
      console.log(`[ProductDetailScreen] Estilos aplicados:`, editableVariables);
      
      // Solo cargar si no está ya cargado o si es diferente al actual
      if (!selectedProduct || selectedProduct.id !== actualProductId) {
        fetchProductById(actualProductId);
      }
      
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [actualProductId, fetchProductById, clearSelectedProduct, editableVariables]); // Añadido editableVariables
  
  // Mostrar pantalla de carga si el producto está cargando
  if (isLoadingProduct) {
    return (
      <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
        <NavBar
          navbarLinks={editableVariables.navbarLinks}
          navbarTitle={editableVariables.navbarTitle}
          backgroundColor={editableVariables.navbarBackgroundColor}
          textColor={editableVariables.textColor}
          fontType={editableVariables.fontType}
          logoUrl={editableVariables.logoUrl}
        />
        <FullScreenLoader />
        <Footer
          backgroundColor={editableVariables.footerBackgroundColor}
          textColor={editableVariables.footerTextColor}
          footerDescription={editableVariables.footerDescription}
        />
      </div>
    );
  }

  // Si no está cargando y no hay producto, mostrar mensaje de error
  if (!isLoadingProduct && !selectedProduct && actualProductId) {
    return (
      <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
        <NavBar
          navbarLinks={editableVariables.navbarLinks}
          navbarTitle={editableVariables.navbarTitle}
          backgroundColor={editableVariables.navbarBackgroundColor}
          textColor={editableVariables.textColor}
          fontType={editableVariables.fontType}
          logoUrl={editableVariables.logoUrl}
        />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4" style={{ color: editableVariables.textColor }}>
            Producto no encontrado
          </h2>
          <p className="mb-6" style={{ color: editableVariables.textColor }}>
            No pudimos encontrar el producto que buscas.
          </p>
          <button
            onClick={() => navigate('/first-layout')}
            className="px-6 py-3 rounded text-white font-semibold"
            style={{ backgroundColor: editableVariables.primaryColor }}
          >
            Volver a la tienda
          </button>
        </div>
        <Footer
          backgroundColor={editableVariables.footerBackgroundColor}
          textColor={editableVariables.footerTextColor}
          footerDescription={editableVariables.footerDescription}
        />
      </div>
    );
  }  return (
    <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      {notification.show && (
        <div 
          className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg flex items-center"
          style={{ backgroundColor: editableVariables.primaryColor }}
        >
          <span className="mr-2">✓</span>
          {notification.message}
        </div>
      )}
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        navbarTitleColor={editableVariables.navbarTitleColor}
        navbarLinksColor={editableVariables.navbarLinksColor}
        navbarIconsColor={editableVariables.navbarIconsColor}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />      <section className="py-2" style={{ backgroundColor: editableVariables.heroBackgroundColor || '#f8f9fa' }}>
        <div className="max-w-7xl mx-auto px-12">
          <div className="flex items-center space-x-2 text-sm">
            <span style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>Home</span>
            <FaChevronRight style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} size={12} />
            <span style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>Shop</span>
            <FaChevronRight style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} size={12} />
            <span className="font-semibold" style={{ color: editableVariables.primaryColor || '#007bff' }}>{selectedProduct?.name || "Producto"}</span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 mt-8 px-4">

        <div className="flex-1 flex flex-col items-center">
          <div className="w-full max-w-2xl h-[600px] bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden mb-4 border">
            <img
              src={selectedProduct?.imageUrls?.[selectedImage] || "https://via.placeholder.com/600x600?text=No+Image"}
              alt={selectedProduct?.name || "Producto"}
              className="object-cover w-full h-full"
            />
          </div>

          <div className="flex gap-3 mt-2 w-full max-w-2xl">
            {selectedProduct?.imageUrls?.map((img, index) => (
              <button
                key={index}
                className={`w-1/4 h-20 rounded border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'} overflow-hidden bg-gray-200`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>        <div className="w-full max-w-md flex flex-col">
          <h2 className="text-2xl font-bold mb-2">{selectedProduct?.name || "Producto"}</h2>

          <div className="flex items-center mb-2">
            {[1,2,3,4,5].map(i =>
              i <= (selectedProduct?.rating || 0) ? (
                <FaStar key={i} className="text-yellow-400 mr-1" />
              ) : (
                <FaRegStar key={i} className="text-yellow-400 mr-1" />
              )
            )}
            <span className="ml-2 text-sm" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>({productReviews?.length || 0} Reseñas)</span>
          </div>

          <div className="text-2xl font-bold mb-4" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#333' }}>${selectedProduct?.price?.toLocaleString() || "0.00"}</div>

          <div className="mb-4 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: editableVariables.accentColor || '#f8f9fa' }}>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="font-medium" style={{ color: editableVariables.textColor, opacity: 0.7 }}>Estado:</span>
                <span style={{ color: editableVariables.textColor }} className="font-semibold">
                  {selectedProduct?.condition === 'new' ? 'Nuevo' : 'Usado'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium" style={{ color: editableVariables.textColor, opacity: 0.7 }}>Marca:</span>
                <span style={{ color: editableVariables.textColor }} className="font-semibold">
                  {selectedProduct?.brand || 'No especificada'}
                </span>
              </div>
              {selectedProduct?.shop?.name && (
                <div className="flex flex-col col-span-2">
                  <span className="font-medium" style={{ color: editableVariables.textColor, opacity: 0.7 }}>Vendedor:</span>
                  <span style={{ color: editableVariables.textColor }} className="font-semibold">
                    {selectedProduct.shop.name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="mb-4" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>
            {selectedProduct?.descripcion || selectedProduct?.description || "No hay descripción disponible para este producto."}
          </p>

          <div className="mb-4">
            {selectedProduct?.variantes && selectedProduct.variantes.length > 0 ? (
              <div className="space-y-4">
                {selectedProduct.variantes.map((variante, index) => (
                  <div key={index}>
                    <div className="text-sm font-semibold mb-2">{variante.tipo}</div>
                    <div className="flex gap-2 flex-wrap">
                      {variante.valores.map((valor: string) => (
                        <button
                          key={valor}
                          onClick={() => setSelectedVariants(prev => ({ 
                            ...prev, 
                            [variante.tipo]: valor 
                          }))}
                          className={`px-3 py-1 rounded border text-xs font-medium ${
                            selectedVariants[variante.tipo] === valor
                              ? 'text-white'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                          }`}
                          style={selectedVariants[variante.tipo] === valor ? { 
                            backgroundColor: editableVariables.primaryColor,
                            borderColor: editableVariables.primaryColor
                          } : {}}
                        >
                          {valor}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>
                Este producto no tiene variantes disponibles.
              </div>
            )}
          </div>
  
          <div className="mb-4">
            <div className="text-sm font-semibold mb-2">Cantidad</div>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold bg-white hover:bg-gray-100"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >-</button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                className="w-8 h-8 flex items-center justify-center border rounded text-lg font-bold bg-white hover:bg-gray-100"
                onClick={() => setQuantity(q => q + 1)}
              >+</button>
            </div>
          </div>
 
          <div className="flex gap-2 mt-4">            <button 
              onClick={() => {
                if (selectedProduct) {                  addToCart(selectedProduct, quantity);
                  
                  // Show notification
                  setNotification({
                    show: true,
                    message: `${selectedProduct.name} añadido al carrito!`
                  });
                    // Hide notification after 2 seconds
                  setTimeout(() => {
                    setNotification({show: false, message: ''});
                    // Ya no navegamos al carrito, solo mostramos la notificación
                  }, 1500);
                  
                }
              }} 
              className="flex-1 px-4 py-2 text-white bg-blue-500 rounded font-semibold transition hover:opacity-90"
              style={{ backgroundColor: editableVariables.primaryColor }}
            >
              Añadir al Carrito
            </button>
            <button className="w-12 h-12 flex items-center justify-center border rounded bg-white hover:bg-gray-50 transition"
              style={{ color: editableVariables.primaryColor }}
            >
              <FaHeart size={22} />
            </button>
          </div>          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>
              <FaTruck className="text-lg" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} />
              {selectedProduct?.hasFreeShipping ? 'Envío gratuito' : 'Envío disponible'}
            </div>
            <div className="flex items-center gap-2" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>
              <FaUndo className="text-lg" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} />
              Política de devolución: 30 días
            </div>
          </div>
        </div>
      </div>

      <div className="w-full" style={{ backgroundColor: editableVariables.heroBackgroundColor, marginTop: '3rem', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex border-b mb-6">            <button
              className="px-4 py-2 text-sm font-medium border-b-2"
              type="button"
              style={{ color: tab === 'description' ? editableVariables.textColor : editableVariables.textColor, borderColor: tab === 'description' ? editableVariables.textColor : 'transparent' }}
              onClick={() => setTab('description')}
            >
              Descripción
            </button>
            <button
                className="px-4 py-2 text-sm font-medium border-b-2"
                type="button"
                style={{ color: tab === 'reviews' ? editableVariables.textColor : editableVariables.textColor, borderColor: tab === 'reviews' ? editableVariables.textColor : 'transparent' }}
                onClick={() => setTab('reviews')}
              >
                Reviews ({productReviews?.length || 0})
              </button>
          </div>
          <div>            {tab === 'description' && (
              <>
                <h3 className="text-lg font-semibold mb-2" style={{ color: editableVariables.textColor }}>Descripción del Producto</h3>
                <p className="mb-4" style={{ color: editableVariables.textColor }}>
                  {selectedProduct?.descripcion || selectedProduct?.description || 
                    `Experimenta el máximo rendimiento con la "${selectedProduct?.name}".
                     ${selectedProduct?.condition === 'new' ? 'Totalmente nuevo y listo para usar.' : 'En excelente estado, comprobado para asegurar su rendimiento.'}`
                  }
                </p>
                <div className="pl-0 space-y-1" style={{ color: editableVariables.textColor }}>
                  {(selectedProduct?.features || []).map((feature, index) => (
                    <div key={index}>{feature}</div>
                  ))}
                  {(!selectedProduct?.features || selectedProduct.features.length === 0) && (
                    <>
                      {selectedProduct?.hasFreeShipping && <div>Envío gratuito</div>}
                    </>
                  )}
                </div>
              </>
            )}            {tab === 'reviews' && (
              <div style={{ color: editableVariables.textColor }}>
                <h3 className="text-lg font-semibold mb-2">Reviews ({productReviews?.length || 0})</h3>
                {productReviews && productReviews.length > 0 ? (
                  <div className="space-y-4">
                    {productReviews.map(review => (
                      <div key={review.id} className="border rounded-md p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">{review.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center mb-2">
                          {[1,2,3,4,5].map(i =>
                            i <= review.rating ? (
                              <FaStar key={i} className="text-yellow-400 mr-1" />
                            ) : (
                              <FaRegStar key={i} className="text-yellow-400 mr-1" />
                            )
                          )}
                        </div>
                        <p className="text-sm">{review.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Este producto aún no tiene reseñas.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>      <div className="max-w-7xl mx-auto mt-16 px-4 pb-16">
        <h3 className="text-lg font-semibold mb-6">También te puede interesar</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {baseSearchResults.slice(0, 4).map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="relative rounded-lg overflow-hidden shadow group h-96 flex items-stretch bg-white"
              onClick={() => navigate(`/first-layout/detail-layout/${relatedProduct.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <img
                  src={relatedProduct.imageUrls[0] || "https://via.placeholder.com/300x400?text=No+Image"}
                  alt={relatedProduct.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
                <h3 className="text-lg font-semibold text-left mb-1 drop-shadow line-clamp-2">{relatedProduct.name}</h3>
                <span className="font-bold text-lg mb-2 text-left block">${relatedProduct.price.toLocaleString()}</span>
                <div className="flex justify-center">                  <button 
                    className="px-4 w-full py-2 text-white rounded transition text-sm"
                    style={{ backgroundColor: editableVariables.primaryColor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(relatedProduct, 1);
                      navigate('/first-layout/cart-layout');
                    }}
                  >
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
          {baseSearchResults.length === 0 && [1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="relative rounded-lg overflow-hidden shadow group h-96 flex items-stretch bg-white"
            >
              <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                <img
                  src={`https://via.placeholder.com/300x400?text=Product+${idx}`}
                  alt={`Product ${idx}`}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="relative z-10 flex flex-col justify-end h-full w-full p-4">
                <h3 className="text-lg font-semibold text-left mb-1 drop-shadow">Product {idx}</h3>
                <span className="font-bold text-lg mb-2 text-left block">$99.99</span>
                <div className="flex justify-center">                  <button className="px-4 w-full py-2 text-white rounded transition text-sm"
                    style={{ backgroundColor: editableVariables.primaryColor }}>
                    Añadir al Carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default ProductDetailScreen;
