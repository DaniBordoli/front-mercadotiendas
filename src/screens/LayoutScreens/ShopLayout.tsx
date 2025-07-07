import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { SelectDefault } from '../../components/atoms/SelectDefault/SelectDefault';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useSearchStore } from '../../stores/searchStore';
import { useShopStore } from '../../stores/slices/shopStore';
import { fetchShopTemplate } from '../../services/api';
import { FiShoppingCart } from 'react-icons/fi';
import FullScreenLoader from '../../components/molecules/FullScreenLoader';

const ShopLayout: React.FC = () => {
  const [price, setPrice] = useState(500);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sort, setSort] = useState('latest');
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();

  // Obtener variables globales de estilo
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const setEditableVariables = useFirstLayoutStore(state => state.setEditableVariables);
  const shop = useShopStore(state => state.shop);
  const getShop = useShopStore(state => state.getShop);
  const fetchActiveProducts = require('../../stores').useAuthStore((state: any) => state.fetchActiveProducts);
  const fetchProductsByShop = require('../../stores').useAuthStore((state: any) => state.fetchProductsByShop);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  
  // Utilizar la store de búsqueda para los productos de respaldo
  const { baseSearchResults, fetchProductById } = useSearchStore();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  // Cargar shop y template
  useEffect(() => {
    const loadShopAndTemplate = async () => {
      try {
        // Si estamos en ShopView, no cargar la tienda del usuario autenticado
        // Los datos ya vienen desde ShopView
        if (shopId) {
          console.log('ShopLayout: En modo ShopView, usando datos de ShopView');
          return;
        }
        
        // Solo cargar datos propios si NO estamos en ShopView
        if (!shop) {
          await getShop();
        }
        // Cargar template solo si NO estamos en ShopView
        const response = await fetchShopTemplate();
        if (response && response.data && response.data.templateUpdate) {
          setEditableVariables(response.data.templateUpdate);
        }
      } catch (err) {
        console.error('Error loading shop or template:', err);
      }
    };
    loadShopAndTemplate();
  }, [shop, getShop, setEditableVariables, shopId]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        let prods: any[] = [];
        
        // Si estamos en ShopView, usar fetchProductsByShop
        if (shopId && shop) {
          console.log('ShopLayout: En ShopView, obteniendo productos de la tienda:', shop._id);
          prods = await fetchProductsByShop(shop._id);
        } else {
          // Si estamos en la propia tienda, usar fetchActiveProducts
          console.log('ShopLayout: En tienda propia, obteniendo productos activos');
          prods = await fetchActiveProducts();
        }
        
        // Los productos ya vienen filtrados por 'Activo' desde el backend
        setProducts(prods);
        console.log('ShopLayout: Productos cargados:', prods.length);
      } catch (err) {
        console.error('ShopLayout: Error al cargar productos:', err);
        // Filter out inactive products from search store backup
        let activeBackupProducts = baseSearchResults.filter(product =>
          !product.estado || product.estado === 'Activo'
        );
        
        // Si estamos en ShopView, filtrar por la tienda específica
        if (shopId && shop) {
          activeBackupProducts = activeBackupProducts.filter(product => {
            const productShopId = typeof product.shop === 'object' ? product.shop._id : product.shop;
            return productShopId === shop._id;
          });
        }
        
        setProducts(activeBackupProducts);
      } finally {
        setLoading(false);
      }
    };

    // Solo cargar productos si tenemos shop data
    if (shop) {
      loadProducts();
    }
  }, [shop, shopId, fetchActiveProducts, fetchProductsByShop, baseSearchResults]);

  // Función para manejar la navegación a detalle con precarga
  const handleProductClick = async (product: any) => {
    const productId = product?.id || product?._id;
    if (!productId) {
      if (shopId) {
        navigate(`/shop/${shopId}/producto/default`);
      } else {
        navigate('/first-layout/detail-layout');
      }
      return;
    }

    try {
      setLoadingProductId(productId);
      // Precargar el producto antes de navegar
      await fetchProductById(productId);
      
      // Navegar dependiendo del contexto (ShopView o normal)
      if (shopId) {
        navigate(`/shop/${shopId}/producto/${productId}`);
      } else {
        navigate(`/first-layout/detail-layout/${productId}`);
      }
    } catch (error) {
      console.error('Error al precargar producto:', error);
      // Si hay error, navegar de todas formas
      if (shopId) {
        navigate(`/shop/${shopId}/producto/${productId}`);
      } else {
        navigate(`/first-layout/detail-layout/${productId}`);
      }
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.navbarTitleColor || editableVariables.textColor}
        navbarTitleColor={editableVariables.navbarTitleColor}
        navbarLinksColor={editableVariables.navbarLinksColor}
        navbarIconsColor={editableVariables.navbarIconsColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <section className="py-8" style={{ backgroundColor: editableVariables.heroBackgroundColor }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" style={{ color: editableVariables.textColor }}>Inicio</h1>
          <div className="flex items-center space-x-1" style={{ color: editableVariables.textColor }}>
            <span>Inicio</span>
            <FaChevronRight className="text-gray-400" size={14} />
            <span className="font-semibold" style={{ color: editableVariables.primaryColor }}>Inicio</span>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto flex mt-8 mb-16 px-4">
        <aside className="w-64 px-6 py-6 rounded-lg shadow-sm border border-gray-200 h-fit" style={{ backgroundColor: editableVariables.navbarBackgroundColor }}>
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Categorias</h2>
            <div className="flex flex-col gap-3 mb-6">
              <label className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer">
                <input type="checkbox" className="mr-3 rounded" />
               Moda para Mujeres
              </label>
              <label className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer">
                <input type="checkbox" className="mr-3 rounded" />
                Colección para Hombres
              </label>
              <label className="flex items-center text-gray-600 hover:text-gray-800 cursor-pointer">
                <input type="checkbox" className="mr-3 rounded" />
                Accesorios
              </label>
            </div>
          </div>
          <hr className="my-6 border-gray-200" />
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Rango de Precio</h2>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>$0</span>
              <span>$1000</span>
            </div>
            <input
              type="range"
              min={0}
              max={1000}
              value={price}
              onChange={e => setPrice(Number(e.target.value))}
              className="w-full accent-blue-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-sm text-gray-700 mt-2 font-medium">Seleccionado: ${price}</div>
          </div>
          <hr className="my-6 border-gray-200" />
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Talla</h2>
            <div className="flex flex-wrap gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                    selectedSize === size
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <main className="flex-1 ml-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <span className="text-sm text-gray-700 font-medium text-left">
              {products.length > 0 ? `Mostrando 1-${products.length} de ${products.length} resultados` : 'No hay productos'}
            </span>
            <div className="w-full md:w-48">
              <SelectDefault
                options={[{ value: 'latest', label: 'Sort by latest' }]}
                value={sort}
                onChange={setSort}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <FullScreenLoader />
            ) : products && products.length > 0 ? (
              products.map((prod, idx) => (
                <div
                  key={prod?.id || prod?._id || idx}
                  className="bg-white rounded-lg overflow-hidden shadow my-8 w-full flex flex-col cursor-pointer hover:shadow-lg transition relative"
                  onClick={() => handleProductClick(prod)}
                  style={{ backgroundColor: '#fff' }}
                >
                  {/* Overlay de carga */}
                  {loadingProductId === (prod?.id || prod?._id) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
                      <div className="bg-white rounded-full p-3">
                        <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    </div>
                  )}
                  <img
                    src={prod?.imageUrls?.[0] || prod?.productImages?.[0] || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={prod?.name || prod?.nombre || `Producto ${idx + 1}`}
                    className="w-full h-[220px] object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-between p-4 bg-white">
                    <div>
                      <h3 className="text-base font-semibold mb-1 text-gray-900">{prod?.name || prod?.nombre || `Producto ${idx + 1}`}</h3>
                      <span className="text-lg font-bold text-gray-800 mb-4 block">
                        {prod?.price ? `$${prod.price.toLocaleString()}` : prod?.precio ? `$${prod.precio}` : '$99.99'}
                      </span>
                    </div>
                    <button
                      className="mt-auto w-full flex items-center justify-center gap-2 py-2 rounded font-semibold transition-colors duration-200"
                      style={{
                        backgroundColor: editableVariables.featuredProductsCardButtonColor,
                        color: editableVariables.featuredProductsCardButtonTextColor,
                      }}
                    >
                      Añadir al carrito
                      <span className="ml-2"><FiShoppingCart size={20} color={editableVariables.featuredProductsCardButtonTextColor} /></span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <FiShoppingCart className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay productos activos</h3>
                  <p className="text-gray-500">Actualmente no tienes productos disponibles en tu tienda.</p>
                </div>
              </div>
            )}
          </div>
          {products && products.length > 0 && (
            <div className="flex justify-center mt-10">
              <nav className="inline-flex items-center space-x-2">
                <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-500 hover:bg-gray-100">
                  <span className="sr-only">Anterior</span>
                  <FaChevronLeft />
                </button>
                <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-blue-600 text-white font-semibold">1</button>
                <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-700 hover:bg-gray-100">2</button>
                <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-700 hover:bg-gray-100">3</button>
                <button className="w-10 h-10 flex items-center justify-center border rounded-lg bg-white text-gray-500 hover:bg-gray-100">
                  <span className="sr-only">Siguiente</span>
                  <FaChevronRight />
                </button>
              </nav>
            </div>
          )}
        </main>
      </div>
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
    </div>
  );
};

export default ShopLayout;
