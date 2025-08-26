import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { FaSearch } from 'react-icons/fa';
import { CardList } from '../components/molecules/Card/Card';
import { colors } from '../design/colors';
import Carousel from '../components/organisms/Carousel/Carousel';
import { Navbar } from '../components/organisms/Navbar';
import { useAuthStore, useShopStore } from '../stores';
import { useSearchStore } from '../stores';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

interface CategoryCount {
  name: string;
  count: number;
  icon: string;
  color: string;
}

const Dashboard: React.FC = () => {
    const { forceLoadProfile, token, isAuthenticated, getCurrentUserMode } = useAuthStore();
    const { setShop } = useShopStore();
    const navigate = useNavigate();
    const { fetchResultsByCategory } = useSearchStore();
    const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);

    // Redirección automática a /homebuyer si el modo es 'comprador'
    useEffect(() => {
        const currentMode = getCurrentUserMode();
        if (currentMode === 'comprador') {
            navigate('/homebuyer');
        }
    }, [getCurrentUserMode, navigate]);

    const handleCategorySearch = (categoryTerm: string) => {
        fetchResultsByCategory(categoryTerm);
        navigate(`/search?category=${encodeURIComponent(categoryTerm)}`);
    };

    // Función para obtener el conteo real de productos por categoría
    const fetchCategoryCounts = async () => {
        try {
            setIsLoadingCategories(true);
            
            // Lista de categorías disponibles
            const categories = [
                { name: 'Electrónica', icon: 'laptop', color: '#ff4f41' },
                { name: 'Moda', icon: 'shirt', color: '#00a699' },
                { name: 'Hogar', icon: 'house', color: '#ff4f41' },
                { name: 'Deportes', icon: 'dumbbell', color: '#00a699' },
                { name: 'Gaming', icon: 'gamepad', color: '#ff4f41' },
                { name: 'Cocina', icon: 'utensils', color: '#00a699' }
            ];

            // OBTENER DATOS REALES DEL BACKEND
            const { fetchAllProducts } = useAuthStore.getState();
            const backendProducts = await fetchAllProducts();
            
            // Contar productos por categoría
            const categoryCountsData: CategoryCount[] = categories.map(cat => {
                const count = backendProducts.filter(product => {
                    const productCategory = product.categoria || product.category;
                    return productCategory && productCategory.toLowerCase() === cat.name.toLowerCase();
                }).length;
                
                return {
                    ...cat,
                    count: count
                };
            });

            setCategoryCounts(categoryCountsData);
        } catch (error) {
            console.error('Error fetching category counts from backend:', error);
            // Fallback a datos estáticos en caso de error
            setCategoryCounts([
                { name: 'Electrónica', count: 2500, icon: 'laptop', color: '#ff4f41' },
                { name: 'Moda', count: 3800, icon: 'shirt', color: '#00a699' },
                { name: 'Hogar', count: 1900, icon: 'house', color: '#ff4f41' },
                { name: 'Deportes', count: 1200, icon: 'dumbbell', color: '#00a699' },
                { name: 'Gaming', count: 890, icon: 'gamepad', color: '#ff4f41' },
                { name: 'Cocina', count: 654, icon: 'utensils', color: '#00a699' }
            ]);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Función para formatear el número de productos
    const formatProductCount = (count: number): string => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k productos`;
        }
        return `${count} productos`;
    };

    useEffect(() => {
        fetchCategoryCounts();
    }, []);

    React.useEffect(() => {
        const loadUserData = async () => {
            if (isAuthenticated && token) {
                try {
                    console.log('[Dashboard] Forzando recarga de perfil de usuario...');
                    const userData = await forceLoadProfile();
                    
                    // Sincronizar shopStore con los datos del usuario
                    if (userData?.shop) {
                        setShop(userData.shop);
                        console.log('[Dashboard] Tienda sincronizada en shopStore');
                    }
                } catch (error) {
                    console.error('[Dashboard] Error al cargar perfil:', error);
                }
            }
        };

        loadUserData();
    }, [forceLoadProfile, token, isAuthenticated, setShop]);

    return (
        <div className="flex flex-col h-screen">
            <Navbar /> 
            <div className="flex-1"> 
                {/* Eliminamos el espaciador innecesario */}
               
                <div className="only-mobile">
                    <div className="">
                        <Carousel />
                    </div>
                    
                    {/* Sección ¿Cómo funciona? - Móvil */}
                    <section className="py-16 bg-white px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-space text-[#1c1c1e] mb-4">¿Cómo funciona?</h2>
                            <p className="text-lg text-[#666666]">Tres formas de ser parte del ecosistema</p>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#ff4f41]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-[#ff4f41]" fill="currentColor" viewBox="0 0 576 512">
                                        <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold font-space text-[#1c1c1e] mb-3">Compradores</h3>
                                <p className="text-[#666666] leading-relaxed text-sm">Explorá productos únicos de tiendas locales y descubrí nuevas marcas recomendadas por influencers</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#00a699]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-[#00a699]" fill="currentColor" viewBox="0 0 576 512">
                                        <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0H109.6C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9l-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3V384H128V250.6c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3V384v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384 252.6c-4 1-8 1.8-12.3 2.3z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold font-space text-[#1c1c1e] mb-3">Tiendas</h3>
                                <p className="text-[#666666] leading-relaxed text-sm">Creá tu tienda online, vendé tus productos y colaborá con influencers para amplificar tu alcance</p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-[#ff4f41]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-[#ff4f41]" fill="currentColor" viewBox="0 0 576 512">
                                        <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold font-space text-[#1c1c1e] mb-3">Influencers</h3>
                                <p className="text-[#666666] leading-relaxed text-sm">Monetizá tu contenido, colaborá con marcas y recibí comisiones por cada venta que generes</p>
                            </div>
                        </div>
                    </section>
                    
                    {/* Sección Tendencias de Hoy - Móvil */}
                    <section className="py-16 bg-white px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-space text-[#1c1c1e] mb-4">🔥 Tendencias de Hoy</h2>
                            <p className="text-lg text-[#666666]">Basado en clics de tu región</p>
                        </div>
                        <div>
                            <CardList />
                        </div>
                    </section>
                    
                    {/* Sección En Vivo Ahora - Móvil */}
                    <section className="py-16 bg-white px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">🔴 En vivo ahora</h2>
                            <p className="text-lg text-[#666666] mb-4">Mirá las transmisiones en vivo y comprá en tiempo real</p>
                            <button className="text-[#ff4f41] hover:text-[#ff4f41]/80 font-medium">Ver todas</button>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden">
                                <div className="relative">
                                    <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e83b0c34ea-a4b668758c6aff84855d.png" alt="live streaming setup with ring light camera fashion influencer" />
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-medium flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                                        EN VIVO
                                    </div>
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                        </svg>
                                        2.3k
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-[#1c1c1e] mb-2">Moda de Temporada</h3>
                                    <p className="text-sm text-[#666666] mb-3">con @SofiaStyle</p>
                                    <button className="w-full py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors">
                                        Ver transmisión
                                    </button>
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden">
                                <div className="relative">
                                    <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/0ef0eb797c-fff051fe43adba3f8e35.png" alt="tech review streaming setup with gadgets smartphones laptops" />
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-medium flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                                        EN VIVO
                                    </div>
                                    <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                                        <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                        </svg>
                                        1.8k
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="text-base font-semibold text-[#1c1c1e] mb-2">Tech Reviews</h3>
                                    <p className="text-sm text-[#666666] mb-3">con @TechMartín</p>
                                    <button className="w-full py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors">
                                        Ver transmisión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Sección Convertite en Influencer - Móvil */}
                    <section className="py-16 bg-gradient-to-br from-[#ff4f41]/10 to-[#00a699]/10 px-4">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold font-space text-[#1c1c1e] mb-6">Convertite en influencer</h2>
                            <p className="text-lg text-[#666666] mb-8 leading-relaxed">
                                Monetizá tu contenido, colaborá con marcas increíbles y construí tu imperio digital. Únete a nuestra red de creadores y empezá a ganar por lo que más te gusta hacer.
                            </p>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#00a699] mr-2" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                    </svg>
                                    <span className="text-[#666666]">Comisiones por venta</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#00a699] mr-2" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                    </svg>
                                    <span className="text-[#666666]">Exposición en el marketplace</span>
                                </div>
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#00a699] mr-2" fill="currentColor" viewBox="0 0 512 512">
                                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                    </svg>
                                    <span className="text-[#666666]">Herramientas gratis</span>
                                </div>
                            </div>
                            <button className="px-8 py-4 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/80 transition-colors font-medium text-lg">
                                Unite a la red
                            </button>
                        </div>
                    </section>

                    {/* Sección Categorías Populares - Móvil */}
                    <section className="py-16 bg-[#f8f8f8] px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-space text-[#1c1c1e] mb-4">Categorías Populares</h2>
                            <p className="text-lg text-[#666666]">Explorá por categoría y encontrá lo que buscás</p>
                        </div>
                        
                        {isLoadingCategories ? (
                            <div className="grid grid-cols-2 gap-4">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="bg-white rounded-xl p-4 text-center animate-pulse">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                                        <div className="h-5 bg-gray-200 rounded mb-1"></div>
                                        <div className="h-3 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {categoryCounts.map((category, index) => (
                                    <div 
                                        key={category.name}
                                        className="bg-white rounded-xl p-4 text-center hover:shadow-md transition-shadow cursor-pointer" 
                                        onClick={() => handleCategorySearch(category.name)}
                                    >
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`} 
                                             style={{ backgroundColor: `${category.color}10` }}>
                                            {category.icon === 'laptop' && (
                                                <svg className="w-6 h-6" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                    <path d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z"/>
                                                </svg>
                                            )}
                                            {category.icon === 'shirt' && (
                                                <svg className="w-6 h-6" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                    <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"/>
                                                </svg>
                                            )}
                                            {category.icon === 'house' && (
                                                <svg className="w-6 h-6" style={{ color: category.color }} fill="currentColor" viewBox="0 0 576 512">
                                                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
                                                </svg>
                                            )}
                                            {category.icon === 'dumbbell' && (
                                                <svg className="w-6 h-6" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                    <path d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"/>
                                                </svg>
                                            )}
                                            {category.icon === 'gamepad' && (
                                                <svg className="w-6 h-6" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                    <path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z"/>
                                                </svg>
                                            )}
                                            {category.icon === 'utensils' && (
                                                <svg className="w-6 h-6" style={{ color: category.color }} fill="currentColor" viewBox="0 0 448 512">
                                                    <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                                                </svg>
                                            )}
                                        </div>
                                        <h3 className="text-base font-semibold text-[#1c1c1e] mb-1">{category.name}</h3>
                                        <p className="text-xs text-[#666666]">{formatProductCount(category.count)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Sección Casos de Éxito - Móvil */}
                    <section className="py-16 bg-[#f8f8f8] px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold font-space text-[#1c1c1e] mb-4">Casos de éxito</h2>
                            <p className="text-lg text-[#666666]">Lo que dicen nuestros usuarios</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 border border-[#e5e5e7]">
                                <div className="flex items-center mb-4">
                                    <img className="w-12 h-12 rounded-full mr-3 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg" alt="Laura Mendez" />
                                    <div>
                                        <h4 className="text-base font-bold text-[#1c1c1e]">Laura Mendez</h4>
                                        <p className="text-sm text-[#666666]">Propietaria de "Estilo Urbano"</p>
                                    </div>
                                </div>
                                <p className="text-[#666666] italic leading-relaxed text-sm">"Desde que me uní a Mercado Tiendas, mis ventas aumentaron un 300%. La colaboración con influencers me permitió llegar a audiencias que nunca había alcanzado antes."</p>
                            </div>
                            
                            <div className="bg-white rounded-xl p-6 border border-[#e5e5e7]">
                                <div className="flex items-center mb-4">
                                    <img className="w-12 h-12 rounded-full mr-3 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="Martín Rodriguez" />
                                    <div>
                                        <h4 className="text-base font-bold text-[#1c1c1e]">Martín Rodriguez</h4>
                                        <p className="text-sm text-[#666666]">Influencer de tecnología</p>
                                    </div>
                                </div>
                                <p className="text-[#666666] italic leading-relaxed text-sm">"La plataforma me permite monetizar mi contenido de forma transparente. Ahora puedo recomendar productos que realmente uso y ganar por cada venta que genero."</p>
                            </div>
                        </div>
                    </section>

                    {/* Sección CTA Final - Móvil */}
                    <section className="py-16 bg-gradient-to-r from-[#ff4f41] to-[#ff4f41]/80 px-4">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold font-space text-white mb-6">¿Listo para empezar?</h2>
                            <p className="text-lg text-white/90 mb-8">Únete a miles de tiendas, influencers y compradores que ya forman parte de nuestra comunidad</p>
                            
                            <div className="flex flex-col gap-4 items-center">
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="w-full max-w-xs px-8 py-4 bg-white text-[#ff4f41] rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
                                >
                                    Registrate gratis
                                </button>
                                <span className="text-white hover:text-white/80 transition-colors font-medium text-lg underline cursor-pointer">
                                    ¿Sos influencer? Sumate a nuestra red
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Footer - Móvil */}
                    <FooterHome />

                </div>

               
                <div className="only-desktop">
                    <div className="mt-0">
                        <Carousel />
                    </div>
                    
                    {/* Sección ¿Cómo funciona? */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">¿Cómo funciona?</h2>
                                <p className="text-xl text-[#666666]">Tres formas de ser parte del ecosistema</p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-[#ff4f41]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-[#ff4f41]" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Compradores</h3>
                                    <p className="text-[#666666] leading-relaxed">Explorá productos únicos de tiendas locales y descubrí nuevas marcas recomendadas por influencers</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-[#00a699]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-[#00a699]" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M547.6 103.8L490.3 13.1C485.2 5 476.1 0 466.4 0H109.6C99.9 0 90.8 5 85.7 13.1L28.3 103.8c-29.6 46.8-3.4 111.9 51.9 119.4c4 .5 8.1 .8 12.1 .8c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.1 0 49.3-11.4 65.2-29c15.9 17.6 39.1 29 65.2 29c26.2 0 49.3-11.4 65.2-29c16 17.6 39.1 29 65.2 29c4.1 0 8.1-.3 12.1-.8c55.5-7.4 81.8-72.5 52.1-119.4zM499.7 254.9l-.1 0c-5.3 .7-10.7 1.1-16.2 1.1c-12.4 0-24.3-1.9-35.4-5.3V384H128V250.6c-11.2 3.5-23.2 5.4-35.6 5.4c-5.5 0-11-.4-16.3-1.1l-.1 0c-4.1-.6-8.1-1.3-12-2.3V384v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V384 252.6c-4 1-8 1.8-12.3 2.3z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Tiendas</h3>
                                    <p className="text-[#666666] leading-relaxed">Creá tu tienda online, vendé tus productos y colaborá con influencers para amplificar tu alcance</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-[#ff4f41]/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-[#ff4f41]" fill="currentColor" viewBox="0 0 576 512">
                                            <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Influencers</h3>
                                    <p className="text-[#666666] leading-relaxed">Monetizá tu contenido, colaborá con marcas y recibí comisiones por cada venta que generes</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-bold font-space text-[#1c1c1e]">🔥 Tendencias de Hoy</h2>
                            <p className="text-sm text-[#666666]">Basado en clics de tu región</p>
                        </div>
                    </div>
                    <div>
                        <CardList />
                    </div>
                    
                    {/* Sección En Vivo Ahora */}
                    <section className="py-20 bg-white">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h2 className="text-4xl font-bold font-space text-[#1c1c1e] mb-2">🔴 En vivo ahora</h2>
                                    <p className="text-xl text-[#666666]">Mirá las transmisiones en vivo y comprá en tiempo real</p>
                                </div>
                                <button className="text-[#ff4f41] hover:text-[#ff4f41]/80 font-medium">Ver todas</button>
                            </div>
                            
                            <div className="grid md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="relative">
                                        <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/e83b0c34ea-a4b668758c6aff84855d.png" alt="live streaming setup with ring light camera fashion influencer" />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-medium flex items-center">
                                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                                            EN VIVO
                                        </div>
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 576 512">
                                                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                            </svg>
                                            2.3k
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-[#1c1c1e] mb-2">Moda de Temporada</h3>
                                        <p className="text-sm text-[#666666] mb-3">con @SofiaStyle</p>
                                        <button className="w-full py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors">
                                            Ver transmisión
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="relative">
                                        <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/0ef0eb797c-fff051fe43adba3f8e35.png" alt="tech review streaming setup with gadgets smartphones laptops" />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-medium flex items-center">
                                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                                            EN VIVO
                                        </div>
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 576 512">
                                                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                            </svg>
                                            1.8k
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-[#1c1c1e] mb-2">Tech Reviews</h3>
                                        <p className="text-sm text-[#666666] mb-3">con @TechMartín</p>
                                        <button className="w-full py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors">
                                            Ver transmisión
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="relative">
                                        <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/360341204d-34197462d2c39847834f.png" alt="cooking live stream setup modern kitchen chef preparing food" />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-medium flex items-center">
                                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                                            EN VIVO
                                        </div>
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 576 512">
                                                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                            </svg>
                                            956
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-[#1c1c1e] mb-2">Cocina Saludable</h3>
                                        <p className="text-sm text-[#666666] mb-3">con @ChefAna</p>
                                        <button className="w-full py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors">
                                            Ver transmisión
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e5e7] overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="relative">
                                        <img className="w-full h-48 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/27b57943b9-3ddfec8a0c093a5c87f3.png" alt="fitness live stream setup home gym exercise equipment trainer" />
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 rounded-full text-white text-xs font-medium flex items-center">
                                            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
                                            EN VIVO
                                        </div>
                                        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/70 rounded-full text-white text-xs">
                                            <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 576 512">
                                                <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/>
                                            </svg>
                                            1.2k
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-base font-semibold text-[#1c1c1e] mb-2">Fitness en Casa</h3>
                                        <p className="text-sm text-[#666666] mb-3">con @FitCarlos</p>
                                        <button className="w-full py-2 bg-[#ff4f41] text-white rounded-lg text-sm font-semibold hover:bg-[#ff4f41]/80 transition-colors">
                                            Ver transmisión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Sección Convertite en Influencer */}
                    <section className="py-20 bg-gradient-to-br from-[#ff4f41]/10 to-[#00a699]/10">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex items-center justify-between">
                                <div className="max-w-2xl">
                                    <h2 className="text-5xl font-bold font-space text-[#1c1c1e] mb-6">Convertite en influencer</h2>
                                    <p className="text-xl text-[#666666] mb-8 leading-relaxed">
                                        Monetizá tu contenido, colaborá con marcas increíbles y construí tu imperio digital. Únete a nuestra red de creadores y empezá a ganar por lo que más te gusta hacer.
                                    </p>
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-[#00a699] mr-2" fill="currentColor" viewBox="0 0 512 512">
                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                            </svg>
                                            <span className="text-[#666666]">Comisiones por venta</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-[#00a699] mr-2" fill="currentColor" viewBox="0 0 512 512">
                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                            </svg>
                                            <span className="text-[#666666]">Exposición en el marketplace</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-[#00a699] mr-2" fill="currentColor" viewBox="0 0 512 512">
                                                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
                                            </svg>
                                            <span className="text-[#666666]">Herramientas gratis</span>
                                        </div>
                                    </div>
                                    <button className="px-8 py-4 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/80 transition-colors font-medium text-lg">
                                        Unite a la red
                                    </button>
                                </div>
                                <div className="hidden lg:block">
                                    <img className="w-96 h-96 object-cover rounded-xl" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/f459b10ca6-fef433353b71bc43742e.png" alt="content creator influencer working with professional camera ring light setup modern studio" />
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Sección Categorías Populares */}
                    <section className="py-20 bg-[#f8f8f8]">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">Categorías Populares</h2>
                                <p className="text-xl text-[#666666]">Explorá por categoría y encontrá lo que buscás</p>
                            </div>
                            
                            {isLoadingCategories ? (
                                <div className="grid md:grid-cols-6 gap-6">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="bg-white rounded-xl p-6 text-center animate-pulse">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-6 gap-6">
                                    {categoryCounts.map((category, index) => (
                                        <div 
                                            key={category.name}
                                            className="bg-white rounded-xl p-6 text-center hover:shadow-md transition-shadow cursor-pointer" 
                                            onClick={() => handleCategorySearch(category.name)}
                                        >
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`} 
                                                 style={{ backgroundColor: `${category.color}10` }}>
                                                {category.icon === 'laptop' && (
                                                    <svg className="w-8 h-8" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                        <path d="M128 32C92.7 32 64 60.7 64 96V352h64V96H512V352h64V96c0-35.3-28.7-64-64-64H128zM19.2 384C8.6 384 0 392.6 0 403.2C0 445.6 34.4 480 76.8 480H563.2c42.4 0 76.8-34.4 76.8-76.8c0-10.6-8.6-19.2-19.2-19.2H19.2z"/>
                                                    </svg>
                                                )}
                                                {category.icon === 'shirt' && (
                                                    <svg className="w-8 h-8" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                        <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"/>
                                                    </svg>
                                                )}
                                                {category.icon === 'house' && (
                                                    <svg className="w-8 h-8" style={{ color: category.color }} fill="currentColor" viewBox="0 0 576 512">
                                                        <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
                                                    </svg>
                                                )}
                                                {category.icon === 'dumbbell' && (
                                                    <svg className="w-8 h-8" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                        <path d="M96 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32V224v64V448c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V384H64c-17.7 0-32-14.3-32-32V288c-17.7 0-32-14.3-32-32s14.3-32 32-32V160c0-17.7 14.3-32 32-32H96V64zm448 0v64h32c17.7 0 32 14.3 32 32v64c17.7 0 32 14.3 32 32s-14.3 32-32 32v64c0 17.7-14.3 32-32 32H544v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32V288 224 64c0-17.7 14.3-32 32-32h32c17.7 0 32 14.3 32 32zM416 224v64H224V224H416z"/>
                                                    </svg>
                                                )}
                                                {category.icon === 'gamepad' && (
                                                    <svg className="w-8 h-8" style={{ color: category.color }} fill="currentColor" viewBox="0 0 640 512">
                                                        <path d="M192 64C86 64 0 150 0 256S86 448 192 448H448c106 0 192-86 192-192s-86-192-192-192H192zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24v32h32c13.3 0 24 10.7 24 24s-10.7 24-24 24H216v32c0 13.3-10.7 24-24 24s-24-10.7-24-24V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h32V200z"/>
                                                    </svg>
                                                )}
                                                {category.icon === 'utensils' && (
                                                    <svg className="w-8 h-8" style={{ color: category.color }} fill="currentColor" viewBox="0 0 448 512">
                                                        <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z"/>
                                                    </svg>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2">{category.name}</h3>
                                            <p className="text-sm text-[#666666]">{formatProductCount(category.count)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                    
                    {/* Sección Casos de Éxito */}
                    <section className="py-20 bg-[#f8f8f8]">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">Casos de éxito</h2>
                                <p className="text-xl text-[#666666]">Lo que dicen nuestros usuarios</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-xl p-8 border border-[#e5e5e7]">
                                    <div className="flex items-center mb-6">
                                        <img className="w-16 h-16 rounded-full mr-4 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-6.jpg" alt="Laura Mendez" />
                                        <div>
                                            <h4 className="text-lg font-bold text-[#1c1c1e]">Laura Mendez</h4>
                                            <p className="text-[#666666]">Propietaria de "Estilo Urbano"</p>
                                        </div>
                                    </div>
                                    <p className="text-[#666666] italic leading-relaxed">"Desde que me uní a Mercado Tiendas, mis ventas aumentaron un 300%. La colaboración con influencers me permitió llegar a audiencias que nunca había alcanzado antes."</p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-8 border border-[#e5e5e7]">
                                    <div className="flex items-center mb-6">
                                        <img className="w-16 h-16 rounded-full mr-4 object-cover" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" alt="Martín Rodriguez" />
                                        <div>
                                            <h4 className="text-lg font-bold text-[#1c1c1e]">Martín Rodriguez</h4>
                                            <p className="text-[#666666]">Influencer de tecnología</p>
                                        </div>
                                    </div>
                                    <p className="text-[#666666] italic leading-relaxed">"La plataforma me permite monetizar mi contenido de forma transparente. Ahora puedo recomendar productos que realmente uso y ganar por cada venta que genero."</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Sección Métricas del Sistema */}
                    <section className="py-20 bg-[#f8f8f8]">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">Nuestros números hablan</h2>
                                <p className="text-xl text-[#666666]">Una plataforma en constante crecimiento</p>
                            </div>
                            
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e5e7]">
                                    <div className="w-20 h-20 bg-[#ff4f41]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-[#ff4f41]" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z"/>
                                        </svg>
                                    </div>
                                    <div className="text-4xl font-bold font-space text-[#1c1c1e] mb-2">+50K</div>
                                    <p className="text-xl text-[#666666] mb-2">Productos</p>
                                    <p className="text-sm text-[#666666]">De miles de tiendas verificadas</p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e5e7]">
                                    <div className="w-20 h-20 bg-[#00a699]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-[#00a699]" fill="currentColor" viewBox="0 0 640 512">
                                            <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z"/>
                                        </svg>
                                    </div>
                                    <div className="text-4xl font-bold font-space text-[#1c1c1e] mb-2">1M+</div>
                                    <p className="text-xl text-[#666666] mb-2">Usuarios</p>
                                    <p className="text-sm text-[#666666]">Compradores, vendedores e influencers</p>
                                </div>
                                
                                <div className="bg-white rounded-xl p-8 text-center border border-[#e5e5e7]">
                                    <div className="w-20 h-20 bg-[#ff4f41]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <svg className="w-10 h-10 text-[#ff4f41]" fill="currentColor" viewBox="0 0 512 512">
                                            <path d="M256 48C141.1 48 48 141.1 48 256v40c0 13.3-10.7 24-24 24s-24-10.7-24-24V256C0 114.6 114.6 0 256 0S512 114.6 512 256V400.1c0 48.6-39.4 88-88.1 88L313.6 488c-8.3 14.3-23.8 24-41.6 24H240c-26.5 0-48-21.5-48-48s21.5-48 48-48h32c17.8 0 33.3 9.7 41.6 24l110.4 .1c22.1 0 40-17.9 40-40V256c0-114.9-93.1-208-208-208zM144 208h16c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H144c-35.3 0-64-28.7-64-64V272c0-35.3 28.7-64 64-64zm224 0c35.3 0 64 28.7 64 64v48c0 35.3-28.7 64-64 64H352c-17.7 0-32-14.3-32-32V240c0-17.7 14.3-32 32-32h16z"/>
                                        </svg>
                                    </div>
                                    <div className="text-4xl font-bold font-space text-[#1c1c1e] mb-2">24/7</div>
                                    <p className="text-xl text-[#666666] mb-2">Soporte</p>
                                    <p className="text-sm text-[#666666]">Atención al cliente siempre disponible</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Sección CTA Final */}
                    <section className="py-20 bg-gradient-to-r from-[#ff4f41] to-[#ff4f41]/80">
                        <div className="max-w-4xl mx-auto px-6 text-center">
                            <h2 className="text-5xl font-bold font-space text-white mb-6">¿Listo para empezar?</h2>
                            <p className="text-xl text-white/90 mb-8">Únete a miles de tiendas, influencers y compradores que ya forman parte de nuestra comunidad</p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button 
                                    onClick={() => navigate('/register')}
                                    className="px-8 py-4 bg-white text-[#ff4f41] rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg"
                                >
                                    Registrate gratis
                                </button>
                                <span className="text-white hover:text-white/80 transition-colors font-medium text-lg underline cursor-pointer">
                                    ¿Sos influencer? Sumate a nuestra red
                                </span>
                            </div>
                        </div>
                    </section>
                    
                    <FooterHome />
                    
                </div>
            </div>
        </div>
    )
}

export default Dashboard;