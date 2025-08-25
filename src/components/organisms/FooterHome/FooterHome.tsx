import React from 'react';

const FooterHome: React.FC = () => {
  return (
    <footer className="bg-[#1c1c1e] py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="md:col-span-2">
            <div className="text-xl md:text-2xl font-bold text-white mb-4">Mercado Tiendas</div>
            <p className="text-gray-400 mb-6 text-sm md:text-base">
              La plataforma que conecta tiendas, creadores y compradores en un ecosistema único de comercio colaborativo.
            </p>
            
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-3 text-sm md:text-base">Suscribite a nuestro newsletter</h4>
              <div className="flex w-full">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gray-800 text-white rounded-l-lg border border-gray-700 focus:outline-none focus:border-[#ff4f41] text-sm"
                />
                <button className="px-4 md:px-6 py-2 md:py-3 bg-[#ff4f41] text-white rounded-r-lg hover:bg-[#ff4f41]/80 transition-colors font-medium text-sm whitespace-nowrap border-l-0">
                  Suscribirme
                </button>
              </div>
            </div>
            
            <div className="flex space-x-3 md:space-x-4">
              <button className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
                </svg>
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 29.5 11.7 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                </svg>
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 512 512">
                  <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"/>
                </svg>
              </button>
              <button className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#ff4f41] transition-colors">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 576 512">
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/>
                </svg>
              </button>
            </div>
          </div>
          
          {/* Móvil: Compradores y Vendedores en la misma fila */}
          {/* Desktop: Mantiene la estructura original de 5 columnas */}
          <div className="md:hidden">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Compradores</h4>
                <ul className="space-y-1">
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Explorar productos
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Categorías
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Ofertas especiales
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Mi cuenta
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-3 text-sm">Vendedores</h4>
                <ul className="space-y-1">
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Crear mi tienda
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Centro de vendedores
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Herramientas
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                      Comisiones
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Desktop: Estructura original de 5 columnas */}
          <div className="hidden md:block">
            <h4 className="text-white font-semibold mb-4">Compradores</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Explorar productos
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Categorías
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Ofertas especiales
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Mi cuenta
                </span>
              </li>
            </ul>
          </div>
          
          <div className="hidden md:block">
            <h4 className="text-white font-semibold mb-4">Vendedores</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Crear mi tienda
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Centro de vendedores
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Herramientas
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Comisiones
                </span>
              </li>
            </ul>
          </div>
          
          <div className="hidden md:block">
            <h4 className="text-white font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Centro de ayuda
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Contacto
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Términos y condiciones
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Política de privacidad
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 md:pt-8">
          <div className="flex justify-center">
            <p className="text-gray-400 text-xs md:text-sm text-center">© 2025 Mercado Tiendas. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterHome;