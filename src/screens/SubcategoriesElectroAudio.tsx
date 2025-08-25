import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

const SubcategoriesElectroAudio: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 py-16 pt-32" style={{paddingTop: '20px'}}>
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-[#666666] mb-6">
            <span 
              className="hover:text-[#ff4f41] cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              Inicio
            </span>
            <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
            <span 
              className="hover:text-[#ff4f41] cursor-pointer transition-colors"
              onClick={() => navigate('/categories')}
            >
              Categorías
            </span>
            <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
            <span className="text-[#1c1c1e] font-medium">Electrónica & Audio</span>
          </nav>

          {/* Category Hero */}
          <div className="relative bg-white rounded-xl overflow-hidden mb-8 h-[300px]">
            {/* Desktop Image */}
            <img 
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
              alt="Electrónica & Audio" 
              className="hidden md:block w-full h-full object-cover"
            />
            {/* Mobile Image - Based on user's provided image */}
            <div className="md:hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Electrónica & Audio" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                {/* Desktop Layout */}
                <div className="hidden md:block max-w-xl">
                  <h1 className="text-4xl font-bold font-space text-white mb-3">Electrónica & Audio</h1>
                  <p className="text-lg text-white/90 mb-6">Explorá dispositivos, accesorios y más</p>
                  <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white hover:text-[#1c1c1e] transition-colors">
                    Explorar productos
                  </button>
                </div>
                {/* Mobile Layout */}
                <div className="md:hidden text-center w-full">
                  <h1 className="text-2xl font-bold font-space text-white mb-3">Electrónica & Audio</h1>
                  <p className="text-sm text-white/90">Dispositivos y accesorios</p>
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banners */}
          <section className="mb-12">
            <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
              {/* Banner 1 */}
              <div className="relative bg-gradient-to-r from-[#ff4f41] to-[#ff6b5a] rounded-xl overflow-hidden h-[160px] md:h-[160px] h-[140px]">
                <img 
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Audio Offer" 
                  className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-30"
                />
                <div className="relative z-10 p-6 md:p-6 p-4 h-full flex flex-col justify-center md:justify-center justify-center text-center md:text-left">
                  <h3 className="text-2xl md:text-2xl text-xl font-bold text-white mb-2 md:mb-2 mb-1">Hasta 30% OFF</h3>
                  <p className="text-white/90 mb-4 md:mb-4 mb-3 text-base md:text-base text-sm">Auriculares premium</p>
                  <button className="w-fit md:w-fit mx-auto md:mx-0 px-6 py-2 md:px-6 md:py-2 px-4 py-1.5 bg-white text-[#ff4f41] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm md:text-base">
                    Ver ofertas
                  </button>
                </div>
              </div>

              {/* Banner 2 */}
              <div className="relative bg-gradient-to-r from-[#00a699] to-[#00c4b6] rounded-xl overflow-hidden h-[160px] md:h-[160px] h-[140px]">
                <img 
                  src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Smartphone Offer" 
                  className="absolute right-0 top-0 w-1/2 h-full object-cover opacity-30"
                />
                <div className="relative z-10 p-6 md:p-6 p-4 h-full flex flex-col justify-center md:justify-center justify-center text-center md:text-left">
                  <h3 className="text-2xl md:text-2xl text-xl font-bold text-white mb-2 md:mb-2 mb-1">12 cuotas sin interés</h3>
                  <p className="text-white/90 mb-4 md:mb-4 mb-3 text-base md:text-base text-sm">En smartphones seleccionados</p>
                  <button className="w-fit md:w-fit mx-auto md:mx-0 px-6 py-2 md:px-6 md:py-2 px-4 py-1.5 bg-white text-[#00a699] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm md:text-base">
                    Ver modelos
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Subcategories Grid */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-6">Categorías</h2>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 md:gap-6">
              {/* Audio */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Audio" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Audio</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Auriculares y parlantes</p>
                </div>
              </div>

              {/* Celulares */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Celulares" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Celulares</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Smartphones y accesorios</p>
                </div>
              </div>

              {/* Laptops */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Laptops" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Laptops</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Notebooks y computadoras</p>
                </div>
              </div>

              {/* Smart Home */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Smart Home" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Smart Home</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Hogar inteligente</p>
                </div>
              </div>

              {/* Gaming */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Gaming" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Gaming</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Consolas y videojuegos</p>
                </div>
              </div>

              {/* Cámaras */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-full md:w-auto h-[220px] md:h-auto">
                <div className="aspect-video md:aspect-video overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Cámaras" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1">Cámaras</h3>
                  <p className="text-xs md:text-sm text-[#666666]">Fotografía y video</p>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Products */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-6">Productos Destacados</h2>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-4 md:gap-6">
              {/* Featured Product 1 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="iPhone 15 Pro" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-regular fa-heart text-[#666666] hover:text-[#ff4f41] transition-colors"></i>
                  </button>
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">iPhone 15 Pro Max 256GB</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <span className="text-xs text-[#666666] ml-2">(128)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1c1c1e]">$1.299.999</span>
                      <span className="text-sm text-[#666666] line-through ml-2">$1.499.999</span>
                    </div>
                    <span className="text-xs bg-[#ff4f41] text-white px-2 py-1 rounded">-13%</span>
                  </div>
                </div>
              </div>

              {/* Featured Product 2 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="AirPods Pro" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-regular fa-heart text-[#666666] hover:text-[#ff4f41] transition-colors"></i>
                  </button>
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">AirPods Pro (2da Gen)</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <span className="text-xs text-[#666666] ml-2">(89)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1c1c1e]">$249.999</span>
                      <span className="text-sm text-[#666666] line-through ml-2">$299.999</span>
                    </div>
                    <span className="text-xs bg-[#ff4f41] text-white px-2 py-1 rounded">-17%</span>
                  </div>
                </div>
              </div>

              {/* Featured Product 3 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group w-[160px] md:w-auto h-[280px] md:h-auto">
                <div className="relative aspect-square md:aspect-square overflow-hidden h-[128px] md:h-auto w-[158px] md:w-full mx-auto md:mx-0">
                  <img 
                    src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="MacBook Pro" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-regular fa-heart text-[#666666] hover:text-[#ff4f41] transition-colors"></i>
                  </button>
                </div>
                <div className="p-2 md:p-4 text-center md:text-left">
                  <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1 md:mb-2 line-clamp-2">MacBook Pro 14" M3</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <span className="text-xs text-[#666666] ml-2">(45)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1c1c1e]">$1.899.999</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Product 4 */}
              <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <div className="relative aspect-square overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="PlayStation 5" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="fa-regular fa-heart text-[#666666] hover:text-[#ff4f41] transition-colors"></i>
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2 line-clamp-2">PlayStation 5 Console</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <span className="text-xs text-[#666666] ml-2">(234)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#1c1c1e]">$599.999</span>
                      <span className="text-sm text-[#666666] line-through ml-2">$699.999</span>
                    </div>
                    <span className="text-xs bg-[#ff4f41] text-white px-2 py-1 rounded">-14%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <FooterHome />
    </div>
  );
};

export default SubcategoriesElectroAudio;