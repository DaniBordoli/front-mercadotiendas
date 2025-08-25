import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    {
      title: 'Electrónica & Audio',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🖥️',
      productCount: '2,547 productos'
    },
    {
      title: 'Celulares',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '📱',
      productCount: '1,823 productos'
    },
    {
      title: 'Hogar & Muebles',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🏠',
      productCount: '3,156 productos'
    },
    {
      title: 'Moda & Accesorios',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '👗',
      productCount: '4,392 productos'
    },
    {
      title: 'Deportes & Fitness',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '👟',
      productCount: '1,674 productos'
    },
    {
      title: 'Belleza & Cuidado',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '💄',
      productCount: '2,089 productos'
    },
    {
      title: 'Vehículos & Accesorios',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🚗',
      productCount: '892 productos'
    },
    {
      title: 'Herramientas',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '🔧',
      productCount: '1,245 productos'
    },
    {
      title: 'Libros & Educación',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      icon: '📚',
      productCount: '967 productos'
    }
  ];

  const handleCategoryClick = (categoryTitle: string) => {
    // Navegar a páginas específicas para ciertas categorías
    if (categoryTitle === 'Electrónica & Audio') {
      navigate('/subcategoriaelectroaudio');
    } else {
      // Navegar a la página de búsqueda con la categoría seleccionada
      navigate(`/search?category=${encodeURIComponent(categoryTitle)}`);
    }
  };

  // Filtrar categorías basado en el término de búsqueda
  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Navbar />
      
      {/* Main Content */}
      <main className="flex-1 pt-5">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <nav className="flex items-center text-sm text-[#666666] mb-6">
            <span 
              className="hover:text-[#ff4f41] cursor-pointer transition-colors"
              onClick={() => navigate('/dashboard')}
            >
              Inicio
            </span>
            <i className="fa-solid fa-chevron-right mx-2 text-xs"></i>
            <span className="text-[#1c1c1e] font-medium">Categorías</span>
          </nav>
        </div>
        
        {/* Hero Banner */}
        <div className="relative h-80 md:h-80 sm:h-48 mb-8 md:mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30"></div>
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Hero Categories" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center text-white">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold font-space mb-2 md:mb-4">Todas las Categorías</h1>
              <p className="text-sm md:text-xl mb-4 md:mb-8 max-w-2xl px-4">Explorá nuestra amplia variedad</p>
              <button className="hidden md:block mx-auto px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#1c1c1e] transition-all duration-300 font-medium">
                Ver todas las ofertas
              </button>
            </div>
          </div>
        </div>

        {/* Search Input - Mobile Only */}
        <div className="md:hidden max-w-7xl mx-auto px-6 mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar categorías..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-4 pr-12 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41] shadow-sm"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <i className="fa-solid fa-magnifying-glass text-[#666666]"></i>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Promotional Row */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Desktop version */}
            <div className="hidden md:block relative bg-gradient-to-r from-[#ff4f41] to-[#e63946] rounded-xl p-6 text-white overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-20">
                <i className="fa-solid fa-laptop text-8xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-1">Hasta 40% OFF</h3>
              <p className="text-sm opacity-90">en Electrónica</p>
            </div>
            <div className="hidden md:block relative bg-gradient-to-r from-[#00a699] to-[#008b7a] rounded-xl p-6 text-white overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-20">
                <i className="fa-solid fa-shirt text-8xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-1">Moda en cuotas</h3>
              <p className="text-sm opacity-90">sin interés</p>
            </div>
            <div className="hidden md:block relative bg-gradient-to-r from-[#6c5ce7] to-[#5a4fcf] rounded-xl p-6 text-white overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-20">
                <i className="fa-solid fa-house text-8xl"></i>
              </div>
              <h3 className="text-lg font-semibold mb-1">Novedades en</h3>
              <p className="text-sm opacity-90">Hogar & Muebles</p>
            </div>
            
            {/* Mobile version - Single banner */}
            <div className="md:hidden col-span-full bg-gradient-to-r from-[#ff4f41] to-[#e63946] rounded-xl p-4 text-white">
              <h3 className="text-xl font-bold mb-1">Hasta 40% OFF en Electrónica</h3>
              <p className="text-sm opacity-90">Ofertas especiales por tiempo limitado</p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-2 gap-4 md:gap-8 mb-16 justify-items-center md:justify-items-stretch">
            {filteredCategories.map((category, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer md:w-full md:h-80"
                style={{ width: window.innerWidth < 768 ? '160px' : 'auto', height: window.innerWidth < 768 ? '220px' : 'auto' }}
                onClick={() => handleCategoryClick(category.title)}
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 md:aspect-video" style={{ width: window.innerWidth < 768 ? '158px' : 'auto', height: window.innerWidth < 768 ? '128px' : 'auto', margin: window.innerWidth < 768 ? '1px auto 0' : '0' }}>
                  <img 
                    src={category.image} 
                    alt={category.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 w-7 h-7 md:w-8 md:h-8 bg-white/90 rounded-full flex items-center justify-center">
                    <span className="text-sm md:text-base">{category.icon}</span>
                  </div>
                </div>
                <div className="p-3 md:p-6 flex flex-col justify-between" style={{ height: window.innerWidth < 768 ? '92px' : 'auto' }}>
                  <div>
                    <h3 className="text-sm md:text-lg font-semibold text-[#1c1c1e] mb-1 md:mb-2 leading-tight line-clamp-2">{category.title}</h3>
                    <p className="text-[#666666] text-xs md:text-sm">{category.productCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Section */}
          <div className="bg-white py-12 mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2">Seguridad en tus compras</h3>
                  <p className="text-sm text-[#666666]">Protección garantizada en cada transacción</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1l1.68 5.39A3 3 0 008.62 15h2.76A3 3 0 0014.32 12.39L16 7h-2.76A3 3 0 0010.38 4H3z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2">Envíos a todo el país</h3>
                  <p className="text-sm text-[#666666]">Recibí tus productos donde estés</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2">Pagá en cuotas</h3>
                  <p className="text-sm text-[#666666]">Hasta 12 cuotas sin interés</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterHome />
    </div>
  );
};

export default CategoriesPage;