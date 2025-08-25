import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { FaStar } from 'react-icons/fa';

const SubcategoriaModa: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 py-16" style={{paddingTop: '20px'}}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-[#666666] mb-6">
            <span className="hover:text-[#ff4f41] cursor-pointer" onClick={() => navigate('/dashboard')}>Inicio</span>
            <span className="mx-2">›</span>
            <span className="hover:text-[#ff4f41] cursor-pointer" onClick={() => navigate('/categories')}>Categorías</span>
            <span className="mx-2">›</span>
            <span className="text-[#1c1c1e] font-medium">Moda</span>
          </nav>

          {/* Category Hero */}
          <div className="relative bg-white rounded-xl overflow-hidden mb-8 h-[300px]">
            {/* Desktop Image */}
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Moda & Accesorios" 
              className="hidden md:block w-full h-full object-cover"
            />
            {/* Mobile Image */}
            <div className="md:hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Moda & Accesorios" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                {/* Desktop Layout */}
                <div className="hidden md:block max-w-xl">
                  <h1 className="text-4xl font-bold font-space text-white mb-3">Moda & Accesorios</h1>
                  <p className="text-lg text-white/90 mb-6">Descubrí ropa, calzado y complementos para cada estilo</p>
                  <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#1c1c1e] transition-colors">
                    Explorar moda
                  </button>
                </div>
                {/* Mobile Layout */}
                <div className="md:hidden text-center w-full">
                  <h1 className="text-2xl font-bold font-space text-white mb-3">Moda & Accesorios</h1>
                  <p className="text-sm text-white/90">Descubrí ropa, calzado y complementos para cada estilo</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banners */}
          <section className="mb-12">
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
              {/* Banner 1 */}
              <div className="relative bg-gradient-to-r from-[#ff4f41] to-[#ff6b5a] rounded-xl overflow-hidden h-[160px]">
                <img 
                  className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-30" 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/42c629da0a-1c2fb691ce838e13fd4d.png" 
                  alt="summer fashion collection clothing items colorful"
                />
                <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-2">Nuevas colecciones de verano</h3>
                  <p className="text-white/90 mb-4 text-sm">Las últimas tendencias</p>
                  <button className="w-fit px-4 py-2 bg-white text-[#ff4f41] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm">
                    Ver colección
                  </button>
                </div>
              </div>

              {/* Banner 2 */}
              <div className="relative bg-gradient-to-r from-[#00a699] to-[#00c4b6] rounded-xl overflow-hidden h-[160px]">
                <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-2">Hasta 40% OFF en Calzado</h3>
                  <p className="text-white/90 mb-4 text-sm">Zapatos, zapatillas y más</p>
                  <button className="w-fit px-4 py-2 bg-white text-[#00a699] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm">
                    Ver ofertas
                  </button>
                </div>
              </div>

              {/* Banner 3 */}
              <div className="relative bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] rounded-xl overflow-hidden h-[160px]">
                <img 
                  className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-30" 
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a49d06ea26-ec5f45e74e4590e7ac34.png" 
                  alt="luxury accessories watches bags jewelry premium fashion items"
                />
                <div className="relative z-10 p-6 h-full flex flex-col justify-center">
                  <h3 className="text-xl font-bold text-white mb-2">Accesorios premium en cuotas</h3>
                  <p className="text-white/90 mb-4 text-sm">Sin interés</p>
                  <button className="w-fit px-4 py-2 bg-white text-[#8b5cf6] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm">
                    Ver cuotas
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Subcategories Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-6">Categorías</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-4 md:gap-6">
              {/* Mostrar solo 4 productos en móvil, todos en desktop */}
              {/* Ropa de Mujer */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5f8ec5c4f5-04317a286b616a66ad74.png" 
                    alt="stylish young woman wearing trendy fashionable clothing colorful outfit modern style"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Ropa de Mujer</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Vestidos, blusas y más</p>
                </div>
              </div>

              {/* Ropa de Hombre */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a07eab8f2a-4e49888277f955d47b13.png" 
                    alt="attractive young man wearing fashionable clothing modern casual style trendy outfit"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Ropa de Hombre</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Camisas, pantalones y más</p>
                </div>
              </div>

              {/* Calzado */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/72753cac89-71d97b4abf8313f6c2bf.png" 
                    alt="shoes sneakers footwear collection"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Calzado</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Zapatos y zapatillas</p>
                </div>
              </div>

              {/* Carteras y Bolsos */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/07619d81d4-117909e18a2714d9bfef.png" 
                    alt="handbags purses leather bags fashion accessories collection"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Carteras y Bolsos</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Bolsos y mochilas</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-6">Productos Destacados</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-4 md:gap-6">
              {/* Product 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5f8ec5c4f5-04317a286b616a66ad74.png" 
                    alt="elegant dress fashion clothing"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Vestido Elegante de Temporada</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(124)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$89.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>

              {/* Product 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a07eab8f2a-4e49888277f955d47b13.png" 
                    alt="men casual shirt modern style"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Camisa Casual Premium</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(89)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$45.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>

              {/* Product 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d724341fce-d10c793dcd12174cc903.png" 
                    alt="designer handbag luxury purse fashion accessory"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Cartera de Diseño Exclusiva</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(76)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$299.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>

              {/* Product 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/72753cac89-71d97b4abf8313f6c2bf.png" 
                    alt="premium sneakers athletic footwear"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Zapatillas Premium Sport</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar className="text-gray-300" />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(52)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$159.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* More Products */}
          <section className="mb-12">
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-4 md:gap-6 mb-8">
              {/* Additional Product 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/72753cac89-71d97b4abf8313f6c2bf.png" 
                    alt="men casual shirt modern style fashion clothing"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Camisa Casual Hombre</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar className="text-gray-300" />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(34)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$39.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>

              {/* Additional Product 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/5f8ec5c4f5-04317a286b616a66ad74.png" 
                    alt="women summer dress fashion clothing"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Vestido de Verano</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(67)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$65.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>

              {/* Additional Product 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden bg-[#f8f8f8] h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/07619d81d4-117909e18a2714d9bfef.png" 
                    alt="leather handbag fashion accessory"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-base font-medium text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">Bolso de Cuero Premium</h3>
                  <div className="flex items-center mb-1 md:mb-2 justify-center md:justify-start">
                    <div className="flex text-yellow-400 text-xs md:text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar className="text-gray-300" />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(45)</span>
                  </div>
                  <div className="text-sm md:text-lg font-bold text-[#ff4f41] mb-2 md:mb-3">$189.99</div>
                  <button className="w-full py-1 md:py-2 px-2 md:px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors text-xs md:text-sm">
                    Ver producto
                  </button>
                </div>
              </div>

              {/* Additional Product 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="aspect-square overflow-hidden bg-[#f8f8f8]">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/a07eab8f2a-4e49888277f955d47b13.png" 
                    alt="men formal jacket business clothing"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-medium text-[#1c1c1e] mb-2 line-clamp-2">Chaqueta Formal Ejecutiva</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                      <FaStar />
                    </div>
                    <span className="text-xs text-[#666666] ml-1">(91)</span>
                  </div>
                  <div className="text-lg font-bold text-[#ff4f41] mb-3">$249.99</div>
                  <button className="w-full py-2 px-4 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors">
                    Ver producto
                  </button>
                </div>
              </div>
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <button className="px-8 py-3 border border-[#ff4f41] text-[#ff4f41] rounded-lg font-medium hover:bg-[#ff4f41] hover:text-white transition-colors">
                Ver más productos
              </button>
            </div>
          </section>
        </div>
      </main>
      
      <FooterHome />
    </>
  );
};

export default SubcategoriaModa;