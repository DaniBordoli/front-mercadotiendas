import React from 'react';
import { Navbar } from '../components/organisms/Navbar/Navbar';

const HomeBuyer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8f8f8] font-sans">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative h-96 rounded-xl overflow-hidden">
            <img className="absolute inset-0 w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c7d3526dd6-ee55f01e71bcdda22e5b.png" alt="online shopping ecommerce virtual marketplace people using computers smartphones tablets buying products digital commerce technology modern bright clean professional photography workspace" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff4f41]/85 via-[#ff4f41]/65 to-black/45"></div>
            <div className="relative h-full flex items-center">
              <div className="w-full flex flex-col md:grid md:grid-cols-12 gap-8 px-4 md:px-12">
                <div className="col-span-12 md:col-span-7 flex flex-col justify-center py-8">
                  <h1 className="text-6xl font-bold text-white mb-6 leading-tight font-space">
                    Hot Sale hasta<br /><span className="text-white/90">50% OFF</span>
                  </h1>
                  <p className="text-xl text-white/95 mb-6 leading-relaxed max-w-lg">
                    En miles de productos seleccionados de tecnología, moda y hogar
                  </p>
                  <div className="flex items-center gap-4 mb-8">
                    <button className="px-8 py-4 bg-white text-[#ff4f41] rounded-lg hover:bg-gray-50 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      Ver ofertas
                    </button>
                    <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#ff4f41] transition-all duration-200 font-semibold text-lg">
                      Explorar categorías
                    </button>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 flex items-center justify-center py-8">
                  <div className="relative">
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#00a699]/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl z-10 border border-white/30">
                      <span className="text-2xl font-bold text-white">50%</span>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                      <div className="grid grid-cols-2 gap-3 w-72 h-56">
                        <img className="w-full h-24 object-cover rounded-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/99c2ad4254-156c47070bd989c5f603.png" alt="smartphone modern phone electronics technology sleek black premium device" />
                        <img className="w-full h-24 object-cover rounded-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d2386e6ae0-f060276c294f70b75514.png" alt="wireless headphones modern audio technology white premium" />
                        <img className="w-full h-24 object-cover rounded-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2ead2207ac-8219dd487ff095642772.png" alt="sneakers shoes fashion urban style modern colorful trendy" />
                        <img className="w-full h-24 object-cover rounded-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7ccc5406e1-b3430d575e88e133aa69.png" alt="laptop computer modern silver technology workspace sleek design" />
                        <img className="w-full h-20 object-cover rounded-lg col-span-2" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/bc5e5716ca-eb5e036f7d4072a67b8d.png" alt="smartwatch fitness tracker technology wearable modern black digital display" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Row */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#00a699]/10 rounded-full flex items-center justify-center mr-3">
                  <i className="text-[#00a699] fas fa-truck text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1c1c1e]">Envíos gratis</p>
                  <p className="text-xs text-[#666666]">desde $33.000</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#ff4f41]/10 rounded-full flex items-center justify-center mr-3">
                  <i className="text-[#ff4f41] fas fa-credit-card text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1c1c1e]">Pagá en cuotas</p>
                  <p className="text-xs text-[#666666]">sin interés</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#00a699]/10 rounded-full flex items-center justify-center mr-3">
                  <i className="text-[#00a699] fas fa-shield-alt text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1c1c1e]">Comprá con</p>
                  <p className="text-xs text-[#666666]">seguridad</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#ff4f41]/10 rounded-full flex items-center justify-center mr-3">
                  <i className="text-[#ff4f41] fas fa-gift text-xl"></i>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1c1c1e]">Ofertas</p>
                  <p className="text-xs text-[#666666]">exclusivas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="py-8 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#1c1c1e] mb-6">Categorías destacadas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div className="relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-48">
              <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/bbf11b7c58-57a4fb451d137f146736.png" alt="smartphones electronics technology modern devices" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white font-bold text-2xl mb-1">Celulares</h3>
                <p className="text-white/90 text-sm">Últimos modelos disponibles</p>
              </div>
            </div>
            <div className="relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-48">
              <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/862b287b04-6286e317ced7f058b50b.png" alt="laptop computer technology workspace modern" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white font-bold text-2xl mb-1">Computación</h3>
                <p className="text-white/90 text-sm">Notebooks y accesorios</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6">
            <div className="relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-48">
              <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d6a5c65d0d-ef3c9139af93f437c1df.png" alt="fashion clothing trendy modern style" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white font-bold text-2xl mb-1">Moda</h3>
                <p className="text-white/90 text-sm">Tendencias 2024</p>
              </div>
            </div>
            <div className="relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-48">
              <img className="w-full h-full object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/8f13aaf978-aa6cc7792653066c82a5.png" alt="home decor furniture modern living room" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white font-bold text-2xl mb-1">Hogar</h3>
                <p className="text-white/90 text-sm">Decorá tu espacio</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Deals */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1c1c1e]">Ofertas del día</h2>
            <a href="#" className="text-[#ff4f41] hover:underline font-semibold">Ver todas</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img className="w-full h-48 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/99c2ad4254-156c47070bd989c5f603.png" alt="smartphone" />
                <div className="absolute top-2 left-2 bg-[#ff4f41] text-white px-2 py-1 rounded text-xs font-bold">-30%</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1c1c1e] mb-2 line-clamp-2">iPhone 15 Pro Max 256GB</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-[#1c1c1e]">$899.999</span>
                  <span className="text-sm text-gray-500 line-through">$1.299.999</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.8)</span>
                </div>
                <p className="text-xs text-[#00a699] font-semibold">Envío gratis</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img className="w-full h-48 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d2386e6ae0-f060276c294f70b75514.png" alt="headphones" />
                <div className="absolute top-2 left-2 bg-[#ff4f41] text-white px-2 py-1 rounded text-xs font-bold">-25%</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1c1c1e] mb-2 line-clamp-2">AirPods Pro 2da Gen</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-[#1c1c1e]">$199.999</span>
                  <span className="text-sm text-gray-500 line-through">$269.999</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.9)</span>
                </div>
                <p className="text-xs text-[#00a699] font-semibold">Envío gratis</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img className="w-full h-48 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2ead2207ac-8219dd487ff095642772.png" alt="sneakers" />
                <div className="absolute top-2 left-2 bg-[#ff4f41] text-white px-2 py-1 rounded text-xs font-bold">-40%</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1c1c1e] mb-2 line-clamp-2">Nike Air Max 270</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-[#1c1c1e]">$89.999</span>
                  <span className="text-sm text-gray-500 line-through">$149.999</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="far fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.6)</span>
                </div>
                <p className="text-xs text-[#00a699] font-semibold">Envío gratis</p>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img className="w-full h-48 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7ccc5406e1-b3430d575e88e133aa69.png" alt="laptop" />
                <div className="absolute top-2 left-2 bg-[#ff4f41] text-white px-2 py-1 rounded text-xs font-bold">-20%</div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[#1c1c1e] mb-2 line-clamp-2">MacBook Air M2 13"</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold text-[#1c1c1e]">$1.199.999</span>
                  <span className="text-sm text-gray-500 line-through">$1.499.999</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.9)</span>
                </div>
                <p className="text-xs text-[#00a699] font-semibold">Envío gratis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended for you */}
      <section className="py-8 bg-[#f8f8f8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1c1c1e]">Recomendado para ti</h2>
            <a href="#" className="text-[#ff4f41] hover:underline font-semibold">Ver más</a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <img className="w-full h-32 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/bc5e5716ca-eb5e036f7d4072a67b8d.png" alt="smartwatch" />
              <div className="p-3">
                <h3 className="font-semibold text-[#1c1c1e] text-sm mb-1 line-clamp-2">Apple Watch Series 9</h3>
                <span className="text-sm font-bold text-[#1c1c1e]">$399.999</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.8)</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <img className="w-full h-32 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/99c2ad4254-156c47070bd989c5f603.png" alt="smartphone" />
              <div className="p-3">
                <h3 className="font-semibold text-[#1c1c1e] text-sm mb-1 line-clamp-2">Samsung Galaxy S24</h3>
                <span className="text-sm font-bold text-[#1c1c1e]">$799.999</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="far fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.7)</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <img className="w-full h-32 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d2386e6ae0-f060276c294f70b75514.png" alt="headphones" />
              <div className="p-3">
                <h3 className="font-semibold text-[#1c1c1e] text-sm mb-1 line-clamp-2">Sony WH-1000XM5</h3>
                <span className="text-sm font-bold text-[#1c1c1e]">$299.999</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.9)</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <img className="w-full h-32 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/2ead2207ac-8219dd487ff095642772.png" alt="sneakers" />
              <div className="p-3">
                <h3 className="font-semibold text-[#1c1c1e] text-sm mb-1 line-clamp-2">Adidas Ultraboost 22</h3>
                <span className="text-sm font-bold text-[#1c1c1e]">$129.999</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="far fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.6)</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
              <img className="w-full h-32 object-cover rounded-t-lg" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/7ccc5406e1-b3430d575e88e133aa69.png" alt="laptop" />
              <div className="p-3">
                <h3 className="font-semibold text-[#1c1c1e] text-sm mb-1 line-clamp-2">Dell XPS 13</h3>
                <span className="text-sm font-bold text-[#1c1c1e]">$999.999</span>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex text-yellow-400">
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                    <i className="fas fa-star text-xs"></i>
                  </div>
                  <span className="text-xs text-gray-500">(4.8)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
        
      {/* Footer */}
      <footer className="bg-[#1c1c1e] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold font-space text-white mb-4">Mercado Tiendas</div>
              <p className="text-gray-400 mb-6">La plataforma que conecta tiendas, creadores y compradores en un ecosistema único de comercio colaborativo.</p>
              
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Suscribite a nuestro newsletter</h4>
                <div className="flex">
                  <input type="email" placeholder="Tu email" className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none focus:border-[#ff4f41]" />
                  <button className="px-6 py-3 bg-[#ff4f41] text-white rounded-r-lg hover:bg-[#ff4f41]/80 transition-colors font-medium">
                    Suscribirme
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                  <i className="fab fa-facebook text-white"></i>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                  <i className="fab fa-instagram text-white"></i>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                  <i className="fab fa-twitter text-white"></i>
                </button>
                <button className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                  <i className="fab fa-youtube text-white"></i>
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Compradores</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Explorar productos</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Categorías</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Ofertas especiales</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Mi cuenta</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Vendedores</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Crear mi tienda</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Centro de vendedores</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Herramientas</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Comisiones</span></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2">
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Centro de ayuda</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Contacto</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Términos y condiciones</span></li>
                <li><span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Política de privacidad</span></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 Mercado Tiendas. Todos los derechos reservados.</p>
              <div className="flex items-center space-x-6">
                <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Blog</span>
                <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Prensa</span>
                <span className="text-gray-400 hover:text-white transition-colors text-sm cursor-pointer">Carreras</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeBuyer;