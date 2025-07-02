import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Importar store y tipos directamente del archivo
import { useSearchStore } from '../stores'; 
import type { Product, SortOrder } from '../stores/searchStore'; // Importar tipos directamente
import { Navbar } from '../components/organisms/Navbar';
import { ProductListItem } from '../components/molecules/ProductListItem';
import { Footer } from '../components/organisms/Footer';
import { FilterSection } from '../components/molecules/FilterSection/FilterSection'; // Importar FilterSection

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
  } = useSearchStore();

  // Estado local para inputs de precio (para no actualizar en cada keystroke)
  const [localMinPrice, setLocalMinPrice] = useState<string>(priceRange.min?.toString() || '');
  const [localMaxPrice, setLocalMaxPrice] = useState<string>(priceRange.max?.toString() || '');

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
    navigate(`/producto/${product.id}`);
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
  
  // TODO: Implementar componente de Paginación
  const PaginationComponent = () => {
      // Placeholder - Aquí iría la lógica para renderizar botones/números de página
      if (totalPages <= 1) return null;
      return (
          <div className="flex justify-center items-center space-x-2 mt-6">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}>Anterior</button>
              <span>Página {currentPage} de {totalPages}</span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalPages}>Siguiente</button>
          </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}> {/* Fondo Ultra Light Gray */} 
      <Navbar />
      {/* Contenedor principal con padding y centrado */}
      <div className="container mx-auto px-4 pt-24 flex flex-col md:flex-row gap-6"> {/* flex-col en móvil */}
        
        {/* Columna Izquierda (Filtros) */}
        <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0"> 
          <div className="bg-white p-4 rounded shadow-sm sticky top-24"> {/* Sticky para que se quede visible */} 
            <div className="flex justify-between items-center mb-1 border-b border-gray-200 pb-3"> {/* Ajustar padding/border */}
              <h2 className="text-xl font-semibold" style={{ color: '#1C1C1E' }}>Filtros</h2>
              <button 
                onClick={clearFilters} 
                className="text-sm text-sky-600 hover:text-sky-800"
              >
                Limpiar filtros
              </button>
            </div>
            
            {/* Filtro Condición */}
            <FilterSection title="Condición">
              <div className="flex flex-col space-y-1 pt-1"> {/* Añadir padding top ligero si es necesario */}
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
              <div className="pt-1"> {/* Añadir padding top ligero si es necesario */}
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      placeholder={`Mín (${availableFilters?.priceRange.min ?? '-'})`} 
                      value={localMinPrice}
                      onChange={(e) => setLocalMinPrice(e.target.value)}
                      min={availableFilters?.priceRange.min} // Añadir min/max HTML
                      className="w-full text-sm p-1 border rounded focus:outline-none focus:ring-1 focus:ring-sky-500"
                      style={{ borderColor: '#E6E6E7' }}
                    />
                    <span>-</span>
                    <input 
                      type="number" 
                      placeholder={`Máx (${availableFilters?.priceRange.max ?? '-'})`} 
                      value={localMaxPrice}
                      onChange={(e) => setLocalMaxPrice(e.target.value)}
                      max={availableFilters?.priceRange.max} // Añadir min/max HTML
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
                <div className="space-y-1 max-h-40 overflow-y-auto pt-1"> {/* Scroll si hay muchas marcas, añadir padding top */}
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
        </aside>

        {/* Columna Derecha (Resultados) */}
        <main className="flex-grow w-full md:w-3/4 lg:w-4/5"> 
          {/* Encabezado de Resultados */}
          <div className="mb-4 flex justify-between items-center"> {/* Usar flex para alinear */} 
            <div>
              <h1 className="text-2xl font-semibold mb-1" style={{ color: '#1C1C1E' }}>
                {category ? `Categoría: ${category}` : query}
              </h1>
              <p className="text-sm" style={{ color: '#666666' }}>{totalResults} resultados</p>
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
              {/* Añadir componente de paginación */}
              <PaginationComponent /> 
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage; 