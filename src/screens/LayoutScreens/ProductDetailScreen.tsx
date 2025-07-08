import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FaChevronRight, FaStar, FaRegStar, FaHeart, FaTruck, FaUndo, FaMinus, FaPlus } from 'react-icons/fa';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useSearchStore } from '../../stores/searchStore';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores';
import { getStorageItem } from '../../utils/storage';
import FullScreenLoader from '../../components/molecules/FullScreenLoader';

// Configuración de la API
const API_URL = process.env.REACT_APP_API_URL;

// Interfaces para las reseñas
interface Review {
  _id: string;
  userId: string;
  userName: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Función para calcular tiempo transcurrido
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

// Componente para mostrar estrellas de calificación
const RatingStars: React.FC<{ rating?: number, reviewCount?: number, showReviewCountLink?: boolean }> = ({ 
  rating, 
  reviewCount, 
  showReviewCountLink = true 
}) => {
  const safeRating = typeof rating === 'number' && rating >= 0 && rating <= 5 ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center text-yellow-500 mb-2">
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
      {[...Array(emptyStars)].map((_, i) => <FaRegStar key={`empty-${i}`} />)}
      {reviewCount !== undefined && (
        <span className={`text-gray-500 text-xs ml-2 ${showReviewCountLink ? 'hover:underline cursor-pointer' : ''}`}>
          ({reviewCount} reseñas)
        </span>
      )}
    </div>
  );
};

// Componente para formulario de reseña
const ReviewForm: React.FC<{
  productId: string;
  onCancel: () => void;
  onSubmit: (reviewData: { rating: number; comment: string }) => void;
}> = ({ productId, onCancel, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validateForm = () => {
    const newErrors: { rating?: string; comment?: string } = {};
    
    if (rating === 0) {
      newErrors.rating = 'Por favor, selecciona una calificación';
    }
    
    if (!comment.trim()) {
      newErrors.comment = 'Por favor, escribe un comentario';
    } else if (comment.trim().length < 10) {
      newErrors.comment = 'El comentario debe tener al menos 10 caracteres';
    } else if (comment.trim().length > 500) {
      newErrors.comment = 'El comentario no puede exceder 500 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSubmit({ rating, comment: comment.trim() });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Escribir una reseña</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Calificación</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="text-2xl focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  {star <= (hoveredRating || rating) ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-300" />
                  )}
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Comentario
              <span className="text-gray-400 text-xs ml-1">
                ({comment.length}/500)
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                errors.comment 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              rows={4}
              placeholder="Escribe tu opinión sobre el producto... (mínimo 10 caracteres)"
              maxLength={500}
            />
            {errors.comment && (
              <p className="text-red-500 text-xs mt-1">{errors.comment}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const { user, isAuthenticated } = useAuthStore();
  
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
      // Solo cargar si no está ya cargado o si es diferente al actual
      if (!selectedProduct || selectedProduct.id !== actualProductId) {
        fetchProductById(actualProductId);
      }
      
      // Cargar reseñas del producto
      fetchReviews(actualProductId);
      
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [actualProductId, fetchProductById, clearSelectedProduct, editableVariables]);
  
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

          <RatingStars rating={averageRating} reviewCount={totalReviews} showReviewCountLink={true} />

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
                Reseñas ({totalReviews})
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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Opiniones de clientes ({totalReviews})</h3>
                  <button
                    onClick={handleOpenReviewForm}
                    className="px-4 py-2 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: editableVariables.primaryColor }}
                  >
                    Escribir opinión
                  </button>
                </div>
                
                {isLoadingReviews ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Cargando reseñas...</p>
                  </div>
                ) : totalReviews > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border rounded-md p-4 bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm">{review.userName || 'Usuario Anónimo'}</span>
                          <span className="text-xs text-gray-500">
                            {review.createdAt ? timeAgo(review.createdAt) : 'Hace un momento'}
                          </span>
                        </div>
                        <RatingStars rating={review.rating} showReviewCountLink={false} />
                        <p className="text-sm mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Todavía no hay opiniones para este producto.</p>
                    <button
                      onClick={handleOpenReviewForm}
                      className="px-6 py-2 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: editableVariables.primaryColor }}
                    >
                      ¡Sé el primero en escribir una!
                    </button>
                  </div>
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
      
      {/* Formulario de reseña */}
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

export default ProductDetailScreen;
