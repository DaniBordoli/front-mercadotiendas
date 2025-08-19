import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaChevronRight, FaStar, FaRegStar, FaHeart, FaTruck, FaShieldAlt, FaCreditCard } from 'react-icons/fa';
import { Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useSearchStore } from '../../stores/searchStore';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/slices/authSlice';
import { getStorageItem } from '../../utils/storage';
import { API_URL } from '../../config';
import { ReviewForm } from '../../components/organisms/ReviewForm/ReviewForm';
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
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<'description' | 'reviews'>('description');
  const [notification, setNotification] = useState<{show: boolean, message: string}>({show: false, message: ''});
  
  // Review-related states
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  
  // Auth state
  const { user, isAuthenticated } = useAuthStore();
  
  // Usar productId si está disponible (desde ShopView), sino usar id (desde rutas normales)
  const actualProductId = productId || id;
  
  const { 
    selectedProduct, 
    isLoadingProduct, 
    fetchProductById, 
    clearSelectedProduct,
    baseSearchResults
  } = useSearchStore();
  
  const addToCart = useCartStore(state => state.addToCart);

  // Estados locales para reviews (no usar el searchStore para reviews)
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

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
        
        let reviewsData = [];
        if (data.data && Array.isArray(data.data)) {
          reviewsData = data.data;
        } else if (data.message && Array.isArray(data.message)) {
          reviewsData = data.message;
        } else if (Array.isArray(data)) {
          reviewsData = data;
        }
        
        const reviewsArray = Array.isArray(reviewsData) ? reviewsData : [];
        setReviews(reviewsArray);
      } else {
        setReviews([]);
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
        setNotification({
          show: true,
          message: 'Reseña enviada correctamente!'
        });
        
        if (actualProductId) {
          await fetchReviews(actualProductId);
        }
      } else {
        const errorData = await response.json();
        let errorMessage = 'Error al enviar la reseña';
        
        if (response.status === 400) {
          errorMessage = errorData.message || 'Datos de la reseña inválidos';
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
      setNotification({
        show: true,
        message: 'Error de conexión. Verifica tu conexión a internet'
      });
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

  const handleReviewSubmit = async (reviewData: { rating: number; text: string }) => {
    if (!actualProductId) return;
    await submitReview({ rating: reviewData.rating, comment: reviewData.text });
    setIsWritingReview(false);
  };

  // Calcular estadísticas de reseñas
  const totalReviews = Array.isArray(reviews) ? reviews.length : 0;
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / totalReviews
    : selectedProduct?.rating || 0;

  // Cargar los datos del producto cuando se monta el componente
  useEffect(() => {
    if (actualProductId) {
      if (!selectedProduct || selectedProduct.id !== actualProductId) {
        fetchProductById(actualProductId);
      }
      
      fetchReviews(actualProductId);
      
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
  }

  return (
    <div style={{ backgroundColor: editableVariables.heroBackgroundColor || '#f8f9fa' }}>
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
            {(() => {
              const navState = (location.state as any) || {};
              const searchContext: { type?: 'search' | 'category'; value?: string; previousPath?: string } = navState.searchContext || {};
              const items: { label: string; onClick?: () => void; active?: boolean }[] = [];
              items.push({ label: 'Inicio', onClick: () => navigate('/first-layout') });
              if (searchContext.type === 'category' && searchContext.value) {
                items.push({ label: 'Categorías', onClick: () => navigate('/first-layout/shop-layout') });
                items.push({ label: String(searchContext.value), active: true });
              } else if (searchContext.type === 'search' && searchContext.value) {
                items.push({ label: 'Resultados', onClick: searchContext.previousPath ? () => navigate(searchContext.previousPath!) : undefined });
                items.push({ label: `"${String(searchContext.value)}"`, active: true });
              } else if (selectedProduct?.categoria) {
                items.push({ label: 'Categorías', onClick: () => navigate('/first-layout/shop-layout') });
                items.push({ label: selectedProduct.categoria, active: true });
              }
              return (
                <>
                  {items.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <FaChevronRight style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} size={12} />}
                      {item.onClick ? (
                        <button onClick={item.onClick} style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} className="hover:underline">
                          {item.label}
                        </button>
                      ) : (
                        <span style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} className={item.active ? 'font-semibold' : ''}>{item.label}</span>
                      )}
                    </React.Fragment>
                  ))}
                  {items.length > 0 && (
                    <>
                      <FaChevronRight style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }} size={12} />
                      <span className="font-semibold" style={{ color: editableVariables.primaryColor || '#007bff' }}>{selectedProduct?.name || "Producto"}</span>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-6">
          {/* Product Gallery */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 mb-4">
                <img
                  src={selectedProduct?.imageUrls?.[selectedImage] || "https://via.placeholder.com/600x600?text=No+Image"}
                  alt={selectedProduct?.name || "Producto"}
                  className="w-full h-[600px] object-cover transition-transform duration-300 hover:scale-110 cursor-zoom-in"
                  onClick={() => setIsZoomModalOpen(true)}
                />
                <button className="absolute top-4 right-4 w-14 h-14 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-[#ff4f41] transition-colors shadow-lg border-2 border-transparent hover:border-[#ff4f41]">
                  <FaHeart className="text-xl text-[#ff4f41]" />
                </button>
              </div>
              {selectedProduct?.imageUrls && selectedProduct.imageUrls.length > 1 && (
                <div className="grid grid-cols-6 gap-3">
                  {selectedProduct.imageUrls.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 ${
                        index === selectedImage 
                          ? 'border-[#ff4f41] opacity-100' 
                          : 'border-transparent hover:border-[#ff4f41] opacity-60 hover:opacity-100'
                      } bg-gradient-to-br from-gray-50 to-gray-100`}
                    >
                      <img src={img} alt={`Vista ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sticky Product Info */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-[#e5e5e7]">
          {/* Badges de estado del producto */}
          <div className="flex gap-2 mb-3">
            {selectedProduct?.condition === 'new' && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#e8f5e8', color: '#2d5a2d' }}>
                Nuevo
              </span>
            )}
            {selectedProduct?.condition === 'used' && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                Usado
              </span>
            )}
            {selectedProduct?.isFeatured && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#d1ecf1', color: '#0c5460' }}>
                Destacado
              </span>
            )}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{selectedProduct?.name || "Producto"}</h2>

          <div className="flex items-center mb-2">
            {[1,2,3,4,5].map(i =>
              i <= (selectedProduct?.rating || 0) ? (
                <FaStar key={i} className="text-yellow-400 mr-1" />
              ) : (
                <FaRegStar key={i} className="text-yellow-400 mr-1" />
              )
            )}
            <span className="ml-2 text-sm" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#666' }}>({totalReviews} Reseñas)</span>
          </div>

          <div className="text-2xl font-bold mb-2" style={{ color: editableVariables.productPageTextColor || editableVariables.textColor || '#333' }}>${selectedProduct?.price?.toLocaleString() || "0.00"}</div>
          
          {/* Badge de descuento */}
          {selectedProduct?.oldPrice && selectedProduct.oldPrice > selectedProduct.price && (
            <div className="mb-4">
              <span className="px-3 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: '#ffebee', color: '#c62828' }}>
                Ahorrás ${(selectedProduct.oldPrice - selectedProduct.price).toLocaleString()} - {Math.round(((selectedProduct.oldPrice - selectedProduct.price) / selectedProduct.oldPrice) * 100)}% OFF
              </span>
            </div>
          )}

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
 
          {/* Trust badges mejorados */}
          <div className="mt-4 space-y-2 mb-6">
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
          <div className="space-y-3 mb-6">
            <button 
              onClick={() => {
                // Lógica para comprar ahora: agregar al carrito y redirigir
                console.log('Botón Comprar ahora clickeado');
                if (selectedProduct) {
                  console.log('Producto seleccionado:', selectedProduct);
                  addToCart(selectedProduct, quantity);
                  
                  // Show notification
                  setNotification({
                    show: true,
                    message: `${selectedProduct.name} añadido al carrito y redirigiendo...`
                  });
                  
                  // Redirigir al carrito después de un breve delay
                  console.log('Iniciando redirección en 1 segundo...');
                  setTimeout(() => {
                    console.log('Ejecutando redirección a /cart-list');
                    setNotification({show: false, message: ''});
                    navigate('/cart-list');
                  }, 1000);
                } else {
                  console.log('No hay producto seleccionado');
                }
              }} 
              className="w-full py-4 bg-[#ff4f41] text-white rounded-lg font-semibold text-lg hover:bg-[#ff4f41]/80 transition-colors"
            >
              Comprar ahora
            </button>
            
            <button 
              onClick={() => {
                if (selectedProduct) {
                  addToCart(selectedProduct, quantity);
                  
                  // Show notification
                  setNotification({
                    show: true,
                    message: `${selectedProduct.name} añadido al carrito!`
                  });
                  setTimeout(() => {
                    setNotification({show: false, message: ''});
                  }, 1500);
                }
              }} 
              className="w-full py-4 bg-white border-2 border-[#ff4f41] text-[#ff4f41] rounded-lg font-semibold text-lg hover:bg-[#ff4f41]/5 transition-colors"
            >
              Agregar al carrito
            </button>
          </div>

              {/* Seller Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img className="w-10 h-10 rounded-full object-cover mr-3" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="TechStore" />
                    <div>
                      <h4 className="font-semibold text-[#1c1c1e] text-sm">TechStore Pro</h4>
                      <div className="flex items-center">
                        <div className="flex text-yellow-400 text-xs mr-2">
                          <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span className="text-xs text-[#666666]">(4.9)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-[#e5e5e7] text-[#666666] rounded-lg hover:bg-gray-50 transition-colors text-xs">
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

        {/* Product Description and Reviews Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#e5e5e7] mt-8 max-w-7xl mx-auto">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex border-b mb-6">
              <button
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
                Reviews ({totalReviews})
              </button>
            </div>
            <div>
              {tab === 'description' && (
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Reviews ({totalReviews})</h3>
                  {!isWritingReview && (
                    <button
                      onClick={handleOpenReviewForm}
                      className="px-4 py-2 text-white rounded text-sm"
                      style={{ backgroundColor: editableVariables.primaryColor }}
                    >
                      Escribir Reseña
                    </button>
                  )}
                </div>
                
                {isLoadingReviews ? (
                  <div className="text-center py-4">
                    <span style={{ color: editableVariables.textColor }}>Cargando reseñas...</span>
                  </div>
                ) : reviews && reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div key={review._id || review.id} className="border rounded-md p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">{review.userName || 'Usuario Anónimo'}</span>
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
                        <p className="text-sm">{review.comment || review.text}</p>
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

        {/* Related Products Section */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-[#e5e5e7] mt-8 max-w-7xl mx-auto">
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
    </div>
  </div>
      
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
      
      {isWritingReview && actualProductId && (
        <ReviewForm
          productId={actualProductId}
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
              src={selectedProduct?.imageUrls?.[selectedImage] || "https://via.placeholder.com/600x600?text=No+Image"} 
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

export default ProductDetailScreen;
