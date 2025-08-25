import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Importar store y tipos directamente del archivo
import { useSearchStore } from '../stores'; 
import type { Product, SortOrder } from '../stores/searchStore'; // Importar tipos directamente
import { Navbar } from '../components/organisms/Navbar';
import { ProductListItem } from '../components/molecules/ProductListItem';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { FilterSection } from '../components/molecules/FilterSection/FilterSection'; // Importar FilterSection
import { FaChevronDown } from 'react-icons/fa'; // Importar icono para filtros móviles

// Necesitamos adaptar CardList o crear una versión que acepte Productos del store
// Por ahora, asumiremos que CardList puede manejar los datos o crearemos un mapeo simple.

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    searchResults,
    isLoadingResults,
    fetchSearchResults,
    fetchResultsByCategory,
    sortOrder, // Obtener estado de ordenamiento
    setSortOrder, // Obtener acción de ordenamiento
    // Obtener estado y acciones de filtros
    availableFilters,
    selectedBrands,
    selectedCondition,
    priceRange,
    toggleBrandFilter,
    setConditionFilter,
    setPriceRange,
    clearFilters,
    // Añadir estado de paginación y total
    totalResults,
    currentPage,
    totalPages,
    goToPage,
    // Añadir estado de displayMode y loadMore
    displayMode,
    itemsToShow,
    loadMoreResults,
  } = useSearchStore();

  // Estado local para inputs de precio (para no actualizar en cada keystroke)
  const [localMinPrice, setLocalMinPrice] = useState<string>(priceRange.min?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(priceRange.max?.toString() || '');
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isMobileLiveOpen, setIsMobileLiveOpen] = useState(false);
  const [isMobileHowItWorksOpen, setIsMobileHowItWorksOpen] = useState(false);
  const [isMobileConditionOpen, setIsMobileConditionOpen] = useState(false);
  const [isMobilePriceOpen, setIsMobilePriceOpen] = useState(false);
  const [isMobileBrandOpen, setIsMobileBrandOpen] = useState(false);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);


  // Obtener el query y category de la URL
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';
  const category = queryParams.get('category') || '';

  useEffect(() => {
    if (category) {
      console.log(`[Page] Buscando resultados para categoría: ${category}`);
      fetchResultsByCategory(category);
    } else if (query) {
      console.log(`[Page] Buscando resultados para: ${query}`);
      fetchSearchResults({ term: query });
    } else {
      // Opcional: Redirigir si no hay query?
      // navigate('/dashboard');
    }
    // Dependencia de 'query' y 'category' para re-buscar si cambia la URL
  }, [query, category, fetchSearchResults, fetchResultsByCategory]);

  // Sincronizar estado local de precio si el global cambia (ej. al limpiar filtros o cambiar filtros disponibles)
  useEffect(() => {
    setLocalMinPrice(priceRange.min?.toString() || '');
    setLocalMaxPrice(priceRange.max?.toString() || '');
    // Podríamos también sincronizar si availableFilters.priceRange cambia, 
    // pero por ahora mantenemos la lógica de que el usuario controla los inputs locales.
  }, [priceRange]);

  const handleProductClick = (product: Product) => {
    // console.log('Producto clickeado en resultados:', product); // Comentar o eliminar log
    // Navegar a la página de detalle del producto usando el hook navigate
    // Pasar contexto de la búsqueda para breadcrumbs más precisos
    const searchContext = {
      type: isCategorySearch ? 'category' : 'search',
      value: isCategorySearch ? category : query,
      previousPath: location.pathname + location.search
    };
    
    navigate(`/producto/${product.id}`, { 
      state: { searchContext } 
    });
  };

  // Handler para el cambio en el dropdown
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrder = event.target.value as SortOrder;
    setSortOrder(newOrder);
  };

  // Aplicar filtro de precio
  const handleApplyPriceFilter = () => {
    const min = localMinPrice === '' ? null : parseInt(localMinPrice, 10);
    const max = localMaxPrice === '' ? null : parseInt(localMaxPrice, 10);
    // Validar que min <= max si ambos existen? 
    if (!isNaN(min as number) && !isNaN(max as number)) {
      if ((min as number) <= (max as number)) {
         setPriceRange({ min, max });
      } else {
         // Opcional: Mostrar error o invertir min/max
         console.warn("Precio mínimo no puede ser mayor al máximo");
         // Por ahora, aplicamos solo el mínimo si es inválido el rango
         setPriceRange({ min, max: null }); 
      }
    } else if (!isNaN(min as number)) {
       setPriceRange({ min, max: null });
    } else if (!isNaN(max as number)) {
       setPriceRange({ min: null, max });
    } else {
       setPriceRange({ min: null, max: null }); // Limpiar si ambos inputs están vacíos/inválidos
    }
  };


  
  // Componente de Paginación - solo se muestra en modo pagination
  const PaginationComponent = () => {
      if (displayMode !== 'pagination' || totalPages <= 1) return null;
      return (
          <div className="flex justify-center items-center space-x-2 mt-6">
              <button 
                onClick={() => goToPage(currentPage - 1)} 
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2">Página {currentPage} de {totalPages}</span>
              <button 
                onClick={() => goToPage(currentPage + 1)} 
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
          </div>
      );
  }

  // Componente del botón "Cargar más resultados"
  const LoadMoreButton = () => {
      const { baseSearchResults, selectedBrands, selectedCondition, priceRange } = useSearchStore();
      
      // Aplicar filtros para obtener el total real de resultados disponibles
      const applyFilters = (products: any[], filters: any) => {
          return products.filter(product => {
              // Filtro por marca
              if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
                  return false;
              }
              // Filtro por condición
              if (filters.selectedCondition && product.condition !== filters.selectedCondition) {
                  return false;
              }
              // Filtro por precio
              if (filters.priceRange.min !== null && product.price < filters.priceRange.min) {
                  return false;
              }
              if (filters.priceRange.max !== null && product.price > filters.priceRange.max) {
                  return false;
              }
              return true;
          });
      };
      
      const filteredResults = applyFilters(baseSearchResults, { selectedBrands, selectedCondition, priceRange });
      const totalAvailable = filteredResults.length;
      
      // No mostrar el botón si estamos en modo pagination
      if (displayMode === 'pagination') return null;
      
      // No mostrar si no hay más resultados disponibles
      if (itemsToShow >= totalAvailable) return null;
      
      const buttonText = displayMode === 'initial' ? 'Cargar más resultados' : 'Ver todos los resultados';
      
      return (
          <div className="flex justify-center mt-6 mb-16">
              <button 
                onClick={loadMoreResults}
                className="px-6 py-3 bg-[#ff4f41] text-white rounded-lg hover:bg-[#e63e32] transition-colors font-medium flex items-center justify-center"
                style={{ backgroundColor: '#ff4f41' }}
              >
                {buttonText}
              </button>
          </div>
      );
  }

  const showBreadcrumbs = Boolean(query || category);
  const isCategorySearch = Boolean(category);

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}> {/* Fondo Ultra Light Gray */} 
      <Navbar />
      {/* Breadcrumbs */}
      {showBreadcrumbs && (
        <div className="container mx-auto px-4 pt-0 md:pt-4 mt-0 md:mt-2">
          <div className="py-1 md:py-4">
            <div className="flex items-center text-sm text-[#1c1c1e] font-medium">
              <button onClick={() => navigate('/')} className="hover:text-[#ff4f41]">Inicio</button>
              <span className="mx-2 text-xs text-[#666666]">›</span>
              {isCategorySearch ? (
                <>
                  <span className="hover:text-[#ff4f41] cursor-pointer" onClick={() => navigate('/categories')}>Categorías</span>
                  <span className="mx-2 text-xs text-[#666666]">›</span>
                  <span className="text-[#ff4f41] font-semibold">{category}</span>
                </>
              ) : (
                <>
                  <span className="hover:text-[#ff4f41] cursor-default">Resultados</span>
                  <span className="mx-2 text-xs text-[#666666]">›</span>
                  <span className="text-[#ff4f41] font-semibold">"{query}"</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Contenedor principal con padding y centrado */}
      <div className="container mx-auto px-4 pt-6 md:pt-6 flex flex-col md:flex-row gap-8" style={{ marginTop: 0 }}> {/* Aumentar pt-0 a pt-6 en móvil para más espacio después del header */}
        
        {/* Columna Izquierda (Filtros) */}
        <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0"> 
          {/* Móvil: Ordenar por y resultados arriba de los filtros */}
          <div className="md:hidden mb-6"> {/* Aumentar mb-4 a mb-6 para más espacio */}
            {/* Cantidad de resultados */}
            <div className="mb-5"> {/* Aumentar mb-3 a mb-5 para más espacio entre imagen2 y cantidad de resultados */}
              <h1 className="text-lg font-semibold" style={{ color: '#1C1C1E' }}>
                {`${totalResults} resultados`}
              </h1>
            </div>
            
            {/* Dropdown de Ordenamiento - Móvil */}
            <div className="w-full">
              <button 
                className="flex items-center justify-between w-full px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                onClick={() => setIsMobileSortOpen(!isMobileSortOpen)}
              >
                <span>{sortOrder === 'relevance' ? 'Más relevantes' : 
                       sortOrder === 'price_asc' ? 'Menor precio' :
                       sortOrder === 'price_desc' ? 'Mayor precio' :
                       sortOrder === 'rating_desc' ? 'Mejor calificados' : 'Más relevantes'}</span>
                <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${isMobileSortOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown de opciones de ordenamiento */}
              {isMobileSortOpen && (
                <div className="absolute mt-2 z-[9999] w-full">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="py-1">
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortOrder === 'relevance' ? 'bg-sky-50 text-sky-600' : 'text-gray-700'}`}
                        onClick={() => {
                          setSortOrder('relevance');
                          setIsMobileSortOpen(false);
                        }}
                      >
                        Más relevantes
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortOrder === 'price_asc' ? 'bg-sky-50 text-sky-600' : 'text-gray-700'}`}
                        onClick={() => {
                          setSortOrder('price_asc');
                          setIsMobileSortOpen(false);
                        }}
                      >
                        Menor precio
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortOrder === 'price_desc' ? 'bg-sky-50 text-sky-600' : 'text-gray-700'}`}
                        onClick={() => {
                          setSortOrder('price_desc');
                          setIsMobileSortOpen(false);
                        }}
                      >
                        Mayor precio
                      </button>
                      <button 
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${sortOrder === 'rating_desc' ? 'bg-sky-50 text-sky-600' : 'text-gray-700'}`}
                        onClick={() => {
                          setSortOrder('rating_desc');
                          setIsMobileSortOpen(false);
                        }}
                      >
                        Mejor calificados
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow-sm sticky top-20"> {/* Sticky para que se quede visible */} 
            {/* Desktop: Mostrar título y botón limpiar filtros */}
            <div className="hidden md:flex justify-between items-center mb-1 border-b border-gray-200 pb-3"> {/* Solo mostrar en desktop */}
              <h2 className="text-xl font-semibold" style={{ color: '#1C1C1E' }}>Filtros</h2>
              <button 
                onClick={clearFilters} 
                className="text-sm text-[#ff4f41] hover:text-[#ff4f41]/80 hover:underline transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
            
            {/* Móvil: Contenedor dinámico de filtros */}
            <div className="md:hidden">
              {/* Contenedor principal que se ajusta dinámicamente */}
              <div className="relative">
                {/* Fila de botones de filtros */}
                <div className="flex gap-3 overflow-x-auto pb-2 mb-4">
                  {/* Filtro Condición */}
                  <div className="flex-shrink-0 min-w-[90px] relative">
                    <button 
                       className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-all duration-200 relative ${
                         isMobileConditionOpen 
                           ? 'bg-sky-100 text-sky-700 border-sky-300' 
                           : selectedCondition
                           ? 'bg-sky-50 text-sky-600 border-sky-200'
                           : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                       }`}
                       onClick={() => {
                         setIsMobileConditionOpen(!isMobileConditionOpen);
                         if (!isMobileConditionOpen) {
                           setIsMobilePriceOpen(false);
                           setIsMobileBrandOpen(false);
                         }
                       }}
                     >
                       <span className="whitespace-nowrap">Condición</span>
                       <FaChevronDown className={`text-xs ml-1 transition-transform duration-200 ${
                         isMobileConditionOpen ? 'rotate-180' : ''
                       }`} />
                       {selectedCondition && (
                         <div className="absolute -top-1 -right-1 w-2 h-2 bg-sky-500 rounded-full"></div>
                       )}
                     </button>
                  </div>

                  {/* Filtro Rango de Precio */}
                  <div className="flex-shrink-0 min-w-[80px] relative">
                    <button 
                       className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-all duration-200 relative ${
                         isMobilePriceOpen 
                           ? 'bg-sky-100 text-sky-700 border-sky-300' 
                           : (priceRange.min || priceRange.max)
                           ? 'bg-sky-50 text-sky-600 border-sky-200'
                           : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                       }`}
                       onClick={() => {
                         setIsMobilePriceOpen(!isMobilePriceOpen);
                         if (!isMobilePriceOpen) {
                           setIsMobileConditionOpen(false);
                           setIsMobileBrandOpen(false);
                         }
                       }}
                     >
                       <span className="whitespace-nowrap">Precio</span>
                       <FaChevronDown className={`text-xs ml-1 transition-transform duration-200 ${
                         isMobilePriceOpen ? 'rotate-180' : ''
                       }`} />
                       {(priceRange.min || priceRange.max) && (
                         <div className="absolute -top-1 -right-1 w-2 h-2 bg-sky-500 rounded-full"></div>
                       )}
                     </button>
                  </div>

                  {/* Filtro Marcas (solo si hay marcas disponibles) */}
                  {availableFilters && availableFilters.brands.length > 0 && (
                    <div className="flex-shrink-0 min-w-[80px] relative">
                      <button 
                         className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm border transition-all duration-200 relative ${
                           isMobileBrandOpen 
                             ? 'bg-sky-100 text-sky-700 border-sky-300' 
                             : selectedBrands.length > 0
                             ? 'bg-sky-50 text-sky-600 border-sky-200'
                             : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                         }`}
                         onClick={() => {
                           setIsMobileBrandOpen(!isMobileBrandOpen);
                           if (!isMobileBrandOpen) {
                             setIsMobileConditionOpen(false);
                             setIsMobilePriceOpen(false);
                           }
                         }}
                       >
                         <span className="whitespace-nowrap">Marca</span>
                         <FaChevronDown className={`text-xs ml-1 transition-transform duration-200 ${
                           isMobileBrandOpen ? 'rotate-180' : ''
                         }`} />
                         {selectedBrands.length > 0 && (
                           <div className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-sky-500 text-white text-[10px] rounded-full flex items-center justify-center px-1">
                             {selectedBrands.length}
                           </div>
                         )}
                       </button>
                    </div>
                  )}
                </div>

                {/* Contenedor dinámico para los dropdowns */}
                 <div className={`transition-all duration-300 ease-in-out overflow-hidden w-full ${
                   (isMobileConditionOpen || isMobilePriceOpen || isMobileBrandOpen) 
                     ? 'max-h-[400px] opacity-100 mb-4' 
                     : 'max-h-0 opacity-0 mb-0'
                 }`}>
                   <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-full max-w-full">
                    {/* Contenido del filtro Condición */}
                     {isMobileConditionOpen && (
                       <div className="p-4 border-b border-gray-100 last:border-b-0 w-full">
                         <h4 className="text-sm font-medium text-gray-900 mb-3">Condición</h4>
                         <div className="space-y-3 w-full">
                          <label className="flex items-center text-sm cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={selectedCondition === 'new'}
                              onChange={() => setConditionFilter(selectedCondition === 'new' ? null : 'new')}
                              className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                            />
                            <span className={`${selectedCondition === 'new' ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>Nuevo</span>
                          </label>
                          
                          <label className="flex items-center text-sm cursor-pointer">
                            <input 
                              type="checkbox"
                              checked={selectedCondition === 'used'}
                              onChange={() => setConditionFilter(selectedCondition === 'used' ? null : 'used')}
                              className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                            />
                            <span className={`${selectedCondition === 'used' ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>Usado</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Contenido del filtro Precio */}
                     {isMobilePriceOpen && (
                       <div className="p-4 border-b border-gray-100 last:border-b-0 w-full">
                         <h4 className="text-sm font-medium text-gray-900 mb-3">Rango de Precio</h4>
                         <div className="space-y-3 w-full">
                           <div className="flex items-center gap-2 w-full">
                             <input 
                               type="number" 
                               placeholder="Mín" 
                               value={localMinPrice}
                               onChange={(e) => setLocalMinPrice(e.target.value)}
                               min={availableFilters?.priceRange.min}
                               className="flex-1 min-w-0 text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                               style={{ borderColor: '#E6E6E7' }}
                             />
                             <span className="text-gray-500 text-sm px-1 flex-shrink-0">-</span>
                             <input 
                               type="number" 
                               placeholder="Máx" 
                               value={localMaxPrice}
                               onChange={(e) => setLocalMaxPrice(e.target.value)}
                               max={availableFilters?.priceRange.max}
                               className="flex-1 min-w-0 text-sm p-2 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                               style={{ borderColor: '#E6E6E7' }}
                             />
                           </div>
                           <button 
                             onClick={handleApplyPriceFilter}
                             className="w-full text-sm bg-sky-600 hover:bg-sky-700 text-white py-2 rounded transition-colors"
                           >
                             Aplicar
                           </button>
                         </div>
                      </div>
                    )}

                    {/* Contenido del filtro Marcas */}
                     {isMobileBrandOpen && availableFilters && availableFilters.brands.length > 0 && (
                       <div className="p-4 border-b border-gray-100 last:border-b-0 w-full">
                         <h4 className="text-sm font-medium text-gray-900 mb-3">Marcas</h4>
                         <div className="space-y-3 max-h-48 overflow-y-auto w-full">
                          {availableFilters.brands.map((brand: string) => (
                            <label key={brand} className="flex items-center text-sm cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={selectedBrands.includes(brand)} 
                                onChange={() => toggleBrandFilter(brand)}
                                className="mr-3 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                              />
                              <span className={`${selectedBrands.includes(brand) ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>{brand}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop: Filtros originales */}
            <div className="hidden md:block">
              {/* Filtro Condición */}
              <FilterSection title="Condición">
                <div className="flex flex-col space-y-1 pt-1">
                  <label className="flex items-center text-sm cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={selectedCondition === 'new'}
                      onChange={() => setConditionFilter(selectedCondition === 'new' ? null : 'new')}
                      className="mr-2 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <span className={`${selectedCondition === 'new' ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>Nuevo</span>
                  </label>
                  
                  <label className="flex items-center text-sm cursor-pointer">
                      <input 
                          type="checkbox"
                          checked={selectedCondition === 'used'}
                          onChange={() => setConditionFilter(selectedCondition === 'used' ? null : 'used')}
                          className="mr-2 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                      />
                      <span className={`${selectedCondition === 'used' ? 'text-sky-600 font-medium' : 'text-gray-700'}`}>Usado</span>
                  </label>
                </div>
              </FilterSection>

              {/* Filtro Rango de Precio */}
              <FilterSection title="Precio">
                <div className="pt-1">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        placeholder={`Mín (${availableFilters?.priceRange.min ?? '-'})`} 
                        value={localMinPrice}
                        onChange={(e) => setLocalMinPrice(e.target.value)}
                        min={availableFilters?.priceRange.min}
                        className="w-full text-sm p-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                        style={{ borderColor: '#E6E6E7' }}
                      />
                      <span>-</span>
                      <input 
                        type="number" 
                        placeholder={`Máx (${availableFilters?.priceRange.max ?? '-'})`} 
                        value={localMaxPrice}
                        onChange={(e) => setLocalMaxPrice(e.target.value)}
                        max={availableFilters?.priceRange.max}
                        className="w-full text-sm p-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                        style={{ borderColor: '#E6E6E7' }}
                      />
                    </div>
                    <button 
                      onClick={handleApplyPriceFilter}
                      className="mt-2 w-full text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 rounded"
                    >
                      Aplicar
                    </button>
                </div>
              </FilterSection>

              {/* Filtro Marcas (solo si hay marcas disponibles) */}
              {availableFilters && availableFilters.brands.length > 0 && (
                <FilterSection title="Marca">
                  <div className="space-y-1 max-h-40 overflow-y-auto pt-1">
                    {availableFilters.brands.map((brand: string) => (
                      <label key={brand} className="flex items-center text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)} 
                          onChange={() => toggleBrandFilter(brand)}
                          className="mr-2 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </FilterSection>
              )}
            </div>
          </div>
        </aside>

        {/* Columna Derecha (Resultados) */}
        <main className="flex-grow w-full md:w-3/4 lg:w-4/5"> 
          {/* Desktop: Encabezado de Resultados */}
          <div className="hidden md:flex mb-4 justify-between items-center"> {/* Usar flex para alinear */} 
            <div>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: '#1C1C1E' }}>
                {`Mostrando ${totalResults} resultados`}
              </h1>
            </div>
             {/* Dropdown de Ordenamiento */}
            <div className="flex items-center">
              <label htmlFor="sortOrder" className="text-sm mr-2" style={{ color: '#666666' }}>Ordenar por:</label>
              <select 
                id="sortOrder"
                value={sortOrder} 
                onChange={handleSortChange}
                className="text-sm p-1 border rounded bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                style={{ borderColor: '#E6E6E7' }} // Borde Light Gray
              >
                <option value="relevance">Más relevantes</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
                <option value="rating_desc">Mejor calificados</option>
              </select>
            </div>
          </div>

          {/* Lista de Productos */}
          {isLoadingResults ? (
            <p>Cargando resultados...</p>
          ) : (
            <>
              {searchResults.length > 0 ? (
                // Usar ProductListItem en lugar de Card
                <div className="flex flex-col gap-0"> {/* Cambiar a flex-col, quitar gap si ProductListItem tiene mb */}
                  {searchResults.map((product: Product) => (
                    <ProductListItem 
                      key={product.id} 
                      product={product}
                      onClick={handleProductClick} 
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded shadow-sm" style={{ borderColor: '#E6E6E7' }}>
                   <p className="text-base" style={{ color: '#1C1C1E' }}>
                     No se encontraron resultados para {category ? `la categoría "${category}"` : `"${query}"`}.
                   </p>
                   <p className="text-sm mt-2" style={{ color: '#666666' }}>
                     {category ? 'No hay productos disponibles en esta categoría.' : 'Intenta con otras palabras o revisa la ortografía.'}
                   </p>
                </div>
              )}
              {/* Botón Cargar más resultados */}
              <LoadMoreButton />
              {/* Componente de paginación */}
              <PaginationComponent /> 
            </>
          )}
        </main>
      </div>
      <FooterHome />
    </div>
  );
};

export default SearchResultsPage;