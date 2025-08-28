import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../../atoms/Logo';
import { FaShop, FaUser, FaRegCircleQuestion, FaChevronDown, FaStar, FaUserPlus } from "react-icons/fa6";
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart, FaSearch, FaRegUserCircle, FaLaptop, FaTshirt, FaHome, FaDumbbell, FaGamepad, FaBars, FaStore, FaTimes } from "react-icons/fa";
import { useAuthStore, useSearchStore } from '../../../stores/index';
import { SearchSuggestions } from '../../molecules/SearchSuggestions';
import { DesignButton } from '../../atoms/DesignButton';
import { RiRobot2Line } from "react-icons/ri";
import { BsShop } from "react-icons/bs";
import { InputDefault } from '../../atoms/InputDefault/InputDefault';
import { useCartStore } from '../../../stores/cartStore';
import Toast from '../../atoms/Toast';
import { useShopStore } from '../../../stores/slices/shopStore';
import { fetchMainCategories } from '../../../stores/slices/authSlice';
import './NavbarMobile.css';
import CartPreview from '../../molecules/CartPreview';
import UserModeSelector from '../../molecules/UserModeSelector';

export const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartPreviewVisible, setIsCartPreviewVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchDropdownVisible, setIsSearchDropdownVisible] = useState(false);
  const [isUserDropdownVisible, setIsUserDropdownVisible] = useState(false);
  const [isCartDropdownVisible, setIsCartDropdownVisible] = useState(false);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'info',
  });
  const navigate = useNavigate();
  

  const logout = useAuthStore(state => state.logout);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const forceLoadProfile = useAuthStore(state => state.forceLoadProfile);
  const {
    searchTerm,
    suggestions,
    fetchSuggestions,
    fetchSearchResults,
    fetchResultsByCategory,
    clearSuggestions,
    setSearchTerm,
  } = useSearchStore();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { checkShopAccess } = useShopStore();
  const { 
    getShop: getShopInfo 
  } = useShopStore();

  const handleLogout = () => {
    logout();
    navigate('/dashboard');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (query.trim() === '') {
      clearSuggestions();
      setShowSuggestions(false);
      return;
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: { id: string; name: string }) => {
    const searchTermToSend = suggestion.name;
    setSearchTerm(searchTermToSend);
    clearSuggestions();
    setShowSuggestions(false);
    fetchSearchResults({ term: searchTermToSend });
    navigate(`/search?q=${encodeURIComponent(searchTermToSend)}`);
  };

  const handleCategorySearch = (categoryTerm: string) => {
    setSearchTerm(categoryTerm);
    clearSuggestions();
    setShowSuggestions(false);
    fetchResultsByCategory(categoryTerm);
    navigate(`/search?category=${encodeURIComponent(categoryTerm)}`);
    setIsCategoryMenuOpen(false);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim() !== '') {
      clearSuggestions();
      setShowSuggestions(false);
      fetchSearchResults({ term: searchTerm });
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const openCategoryMenu = () => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setIsCategoryMenuOpen(true);
  };

  const closeCategoryMenu = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setIsCategoryMenuOpen(false);
    }, 100);
  };

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  const handleShopAccess = (targetPath: string) => {
    const { canAccess, message } = checkShopAccess();
    if (!canAccess) {
      setToast({
        show: true,
        message: message,
        type: 'error',
      });
      return;
    }
    navigate(targetPath);
  };

  useEffect(() => {
    if (searchTerm.trim() !== '' && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (searchTerm.trim() === '') {
      setShowSuggestions(false);
    }
  }, [suggestions, searchTerm]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('.search-container')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (categoryTimeoutRef.current) {
        clearTimeout(categoryTimeoutRef.current);
      }
    };
  }, []);


  

  useEffect(() => {

    let isMounted = true;
    
    const loadUserProfile = async () => {

      if (token && isMounted) {

        
        try {
          const loadedUser = await forceLoadProfile();
          // Cargar información de la tienda si el usuario tiene una
          if (loadedUser?.shop && isMounted) {
            try {
              await getShopInfo();
            } catch (error) {
              // Error silencioso al cargar tienda
            }
          }
        } catch (error) {
          // Error silencioso
        }
      }
    };
    
    loadUserProfile();
    

    return () => {
      isMounted = false;
    };
  }, [token, forceLoadProfile, getShopInfo]);
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchMainCategories();
        const formattedCategories = categoriesData.map((category: any) => ({
          value: category.id || category._id,
          label: category.name
        }));
        setCategories([
          { value: 'laptop', label: 'Laptop' },
          ...formattedCategories
        ]);
      } catch (error) {
        setCategories([{ value: 'laptop', label: 'Laptop' }]);
      }
    };
    
    loadCategories();
  }, []);

  const isUserReady = user && !user.loading;
  

  const [forceUpdate, setForceUpdate] = useState(0);
  

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="navbar-desktop w-full bg-white px-4 py-2 flex items-center justify-between flex-nowrap z-50 fixed top-0 left-0 border-b border-gray-200">
        <div className="container flex w-full max-w-full mx-auto">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-1 w-full">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                <Logo width={165} height={40} color="skyblue" />
              </div>
              <div className="flex-1 w-full search-container max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <InputDefault
                    type="text"
                    placeholder="Buscá por marca, modelo o palabra clave"
                    value={searchTerm}
                    onChange={handleSearchChange ? (v) => handleSearchChange({ target: { value: v } } as any) : undefined}
                    icon={<FaSearch className="text-[#666666]" />}
                    className="w-full h-11 pl-4 pr-12 bg-[#f8f8f8] rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                  />
                  <SearchSuggestions 
                    suggestions={suggestions}
                    onSuggestionClick={handleSuggestionClick}
                    isVisible={showSuggestions}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-6 whitespace-nowrap mt-1 pr-4">
          <div className="flex items-center space-x-6 whitespace-nowrap">
            <div className="relative group" onMouseEnter={openCategoryMenu} onMouseLeave={closeCategoryMenu}>
              <span className="cursor-pointer hover:text-red-500 transition-colors flex items-center font-medium">
                Categorías
                <FaChevronDown className="ml-1 text-xs" />
              </span>
              {isCategoryMenuOpen && (
                <div className="absolute bg-white shadow-lg rounded-lg border border-[#e5e5e7] mt-2 w-56 z-10"
                  onMouseEnter={openCategoryMenu} onMouseLeave={closeCategoryMenu}>
                  <div className="py-2">
                    <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer"
                      onClick={() => handleCategorySearch('Electrónica')}>
                      <FaLaptop className="mr-3 text-[#ff4f41] flex-shrink-0" />
                      Electrónica
                    </span>
                    <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#00a699] transition-colors cursor-pointer"
                      onClick={() => handleCategorySearch('Moda')}>
                      <FaTshirt className="mr-3 text-[#00a699] flex-shrink-0" />
                      Moda
                    </span>
                    <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer"
                      onClick={() => handleCategorySearch('Hogar')}>
                      <FaHome className="mr-3 text-[#ff4f41] flex-shrink-0" />
                      Hogar
                    </span>
                    <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#00a699] transition-colors cursor-pointer"
                      onClick={() => handleCategorySearch('Deportes')}>
                      <FaDumbbell className="mr-3 text-[#00a699] flex-shrink-0" />
                      Deportes
                    </span>
                    <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer"
                      onClick={() => handleCategorySearch('Gaming')}>
                      <FaGamepad className="mr-3 text-[#ff4f41] flex-shrink-0" />
                      Gaming
                    </span>
                    <div className="border-t border-[#e5e5e7] mt-2 pt-2">
                      <span className="flex items-center px-4 py-3 text-[#ff4f41] hover:bg-[#f8f8f8] transition-colors font-medium cursor-pointer"
                        onClick={() => navigate('/categories')}>
                        Ver todas las categorías
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <span className="cursor-pointer hover:text-red-500 transition-colors flex items-center font-medium">
                En Vivo
                <FaChevronDown className="ml-1 text-xs" />
              </span>
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-[#e5e5e7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <span className="block px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer">
                    <span className="text-red-500 mr-3">🔴</span>En vivo ahora
                  </span>
                  <span className="block px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer">
                    <span className="mr-3">📅</span>Próximas transmisiones
                  </span>
                  <span className="block px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer">
                    <span className="mr-3">🧑‍💻</span>Tutoriales en vivo
                  </span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <span className="cursor-pointer hover:text-red-500 transition-colors flex items-center font-medium">
                ¿Cómo Funciona?
                <FaChevronDown className="ml-1 text-xs" />
              </span>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#e5e5e7] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer">
                    <FaShoppingCart className="mr-3 text-[#ff4f41] flex-shrink-0" />
                    Para compradores
                  </span>
                  <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#00a699] transition-colors cursor-pointer">
                    <BsShop className="mr-3 text-[#00a699] flex-shrink-0" />
                    Para tiendas
                  </span>
                  <span className="flex items-center px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] hover:text-[#ff4f41] transition-colors cursor-pointer">
                    <FaStar className="mr-3 text-[#ff4f41] flex-shrink-0" />
                    Para influencers
                  </span>
                </div>
              </div>
            </div>
            <span className="cursor-pointer hover:text-red-500 transition-colors" onClick={() => navigate('/contacto')}>Contacto</span>
          </div>
          {isAuthenticated ? (
            <>
              <div 
                className="flex items-center cursor-pointer px-2 hover:text-red-500 transition-colors relative"
                onClick={() => navigate('/cart-list')}
                onMouseEnter={() => setIsCartPreviewVisible(true)}
                onMouseLeave={() => setIsCartPreviewVisible(false)}
              >
                <span className="relative mr-2">
                  {cartCount > 0 && (
                    <span
                      className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold"
                      style={{ minWidth: 18, minHeight: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      {cartCount}
                    </span>
                  )}
                  <FaShoppingCart className="text-xl" />
                </span>

                <CartPreview 
                  isVisible={isCartPreviewVisible} 
                  onMouseEnter={() => setIsCartPreviewVisible(true)}
                  onMouseLeave={() => setIsCartPreviewVisible(false)}
                />
              </div>
              
              {/* Mostrar "Crear tienda" si no tiene tienda, "Ver mi tienda" si ya la tiene */}
              {isUserReady && user.shop?._id ? (
                <div className="flex items-center cursor-pointer hover:text-red-500 transition-colors">
                  <BsShop onClick={() => navigate(`/shop/${user.shop?._id}`)} className="text-xl mr-2" />
                  <span onClick={() => navigate(`/shop/${user.shop?._id}`)}>Ver mi tienda</span>
                </div>
              ) : (
                <div
                  className="flex items-center cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => toggleModal()}
                >
                  <RiRobot2Line className="text-xl mr-2" />
                  <span>Crear tienda</span>
                </div>
              )}
              
              <UserModeSelector className="mx-4" />
              
              <div className={`relative flex items-center cursor-pointer transition-colors ${isDropdownOpen ? 'text-red-500' : 'hover:text-red-500'}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FaRegUserCircle className="text-xl mr-2" />
                <span>Mi cuenta</span>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-60 bg-white shadow-lg rounded-md border border-gray-200 transition-transform duration-300 ease-in-out transform origin-top scale-y-100" style={{ transform: isDropdownOpen ? 'scaleY(1)' : 'scaleY(0)' }}>                    <ul className="py-2" onClick={(e) => e.stopPropagation()}>
                      
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/user-dashboard')}>
                        Mi Dashboard
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/data-dashboard')}>
                        Mi Perfil
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black flex items-center" onClick={() => navigate('/cart-list')}>
                        Mi carrito
                        {cartCount > 0 && (
                          <span className="ml-2 bg-[#ff4f41] text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                            {cartCount}
                          </span>
                        )}
                      </li>
                      {isUserReady && user.shop ? (
                        <>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/campaigns/create')}>
                            Crear Campaña
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/campaigns')}>
                            Mis Campañas
                          </li>
                        </>
                      ) : isUserReady && user.isInfluencer ? (
                        <>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/my-applications')}>
                            Mis Aplicaciones
                          </li>
                          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/influencer-profile')}>
                            Perfil de Influencer
                          </li>
                        </>
                      ) : isUserReady ? (
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/become-influencer')}>
                          Convertirme en Influencer
                        </li>
                      ) : null}
                      {/* Solo mostrar la opción de Crear Tienda si el usuario no tiene una tienda */}
                      {(!isUserReady || !user.shop) && (
                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={toggleModal}>
                          Crear mi Tienda
                        </li>
                      )}
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={handleLogout}>
                        Cerrar Sesión
                      </li>
                    </ul>
                    
                  </div>
                )}
              </div>
            </>
     ) : (
      <div className="flex items-center space-x-6">
        <div 
          className="flex items-center cursor-pointer hover:text-red-500 transition-colors relative"
          onMouseEnter={() => setIsCartPreviewVisible(true)}
          onMouseLeave={() => setIsCartPreviewVisible(false)}
        >
          <div onClick={() => navigate('/cart-list')} className="flex items-center">
            <span className="relative mr-2">
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold"
                  style={{ minWidth: 18, minHeight: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  {cartCount}
                </span>
              )}
              <FaShoppingCart className="text-xl" />
            </span>

          </div>
          <CartPreview 
            isVisible={isCartPreviewVisible} 
            onMouseEnter={() => setIsCartPreviewVisible(true)}
            onMouseLeave={() => setIsCartPreviewVisible(false)}
          />
        </div>
        <div 
          className="flex items-center cursor-pointer hover:text-red-500 transition-colors"
          onClick={handleLoginClick}
        >
          <FaRegUserCircle className="text-xl mr-2" />
          <span>Ingresa</span>
        </div>
      </div>
    )}
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8 w-[90%] max-w-4xl">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">Crear mi tienda</h1>
                <p className="text-xl text-[#666666] max-w-2xl mx-auto">
                  Podés configurarla paso a paso o hacerlo con ayuda de IA.
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
                {/* Manual Card */}
                <div 
                  className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('/shop-create');
                  }}
                >
                  <div className="text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-[#f8f8f8] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ff4f41]/10 transition-colors">
                      <svg className="w-8 h-8 text-[#666666] group-hover:text-[#ff4f41] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Crear manualmente</h2>
                    
                    {/* Description */}
                    <p className="text-[#666666] text-lg mb-8 leading-relaxed">
                      Completá datos básicos, diseño, menú y categorías paso a paso con control total sobre cada detalle.
                    </p>
                    
                    {/* Button */}
                    <button className="w-full h-12 bg-[#f8f8f8] text-[#1c1c1e] font-semibold rounded-lg hover:bg-[#ff4f41] hover:text-white transition-all duration-300 group-hover:bg-[#ff4f41] group-hover:text-white">
                      Empezar wizard manual
                    </button>
                  </div>
                </div>

                {/* AI Card (Featured) */}
                <div 
                  className="bg-white rounded-2xl shadow-lg border-2 border-[#ff4f41] p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                  onClick={() => {
                    setIsModalOpen(false);
                    navigate('/layout-select');
                  }}
                >
                  {/* Featured Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="inline-flex items-center px-3 py-1 bg-[#ff4f41] rounded-full">
                      <FaStar className="text-white mr-1 text-xs" />
                      <span className="text-white text-xs font-medium">Recomendado</span>
                    </div>
                  </div>

                  <div className="text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-[#ff4f41]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ff4f41]/20 transition-colors">
                      <RiRobot2Line className="text-[#ff4f41] text-3xl" />
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Crear con IA</h2>
                    
                    {/* Description */}
                    <p className="text-[#666666] text-lg mb-8 leading-relaxed">
                      Conversá con la IA y generá una propuesta personalizada en minutos. Rápido y eficiente.
                    </p>
                    
                    {/* Button */}
                    <button className="w-full h-12 bg-[#ff4f41] text-white font-semibold rounded-lg hover:bg-[#ff4f41]/90 transition-all duration-300">
                      Empezar asistente IA
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Help Note */}
              <div className="text-center">
                <p className="text-[#666666] text-sm">
                  <FaRegCircleQuestion className="inline mr-2" />
                  Podés cambiar de método antes de confirmar tu tienda.
                </p>
              </div>
              
              <div className="text-center mt-6">
                <button
                  className="text-[#666666] hover:text-[#ff4f41] font-medium transition-colors"
                  onClick={toggleModal}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
      

      
      {/* Espaciador para compensar el menú fijo */}
      <div className="hidden md:block w-full h-[110px]" /> 
      {/* Mobile Navbar */}
      <nav className="navbar-mobile fixed top-0 left-0 w-full z-50">
        <div className="flex items-center justify-between w-full px-4 py-2">
          <button id="hamburger-btn" className="w-8 h-8 flex items-center justify-center" onClick={() => setIsSidebarOpen(true)}>
            <FaBars className="text-[#1c1c1e] text-xl" />
          </button>
          <div className="navbar-mobile-logo flex-1 flex items-center justify-center" onClick={() => navigate('/dashboard')}>
            <Logo width={165} height={40} color="skyblue" />
          </div>
          <div className="navbar-mobile-actions flex items-center -space-x-1">
            <button id="search-btn" className="w-7 h-7 flex items-center justify-center" onClick={(e) => {
              e.stopPropagation();
              setIsSearchDropdownVisible(!isSearchDropdownVisible);
              setIsUserDropdownVisible(false);
              setIsCartDropdownVisible(false);
            }}>
              <FaSearch className="text-[#1c1c1e] text-base" />
            </button>
            <div className="relative">
              <button id="cart-btn" className="w-7 h-7 flex items-center justify-center" onClick={(e) => {
                e.stopPropagation();
                setIsCartDropdownVisible(!isCartDropdownVisible);
                setIsSearchDropdownVisible(false);
                setIsUserDropdownVisible(false);
              }}>
                <FaShoppingCart className="text-[#1c1c1e] text-base" />
              </button>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ff4f41] rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">{cartCount}</span>
                </div>
              )}
            </div>
            <div className="relative">
              <button id="user-btn" className="w-7 h-7 flex items-center justify-center" onClick={(e) => {
                e.stopPropagation();
                setIsUserDropdownVisible(!isUserDropdownVisible);
                setIsSearchDropdownVisible(false);
                setIsCartDropdownVisible(false);
              }}>
                <FaRegUserCircle className="text-[#1c1c1e] text-base" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Dropdowns */}
        {isSearchDropdownVisible && (
          <div className="navbar-mobile-dropdown search-dropdown fixed top-[48px] left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 animate-slideDown">
            <div className="p-4">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <InputDefault
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(v) => setSearchTerm(v)}
                    icon={<FaSearch className="text-[#666666]" />}
                    className="w-full h-11 pl-4 pr-12 bg-[#f8f8f8] rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                  />

                </div>
              </form>
              {suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-[#666666] font-medium mb-2">Sugerencias:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 5).map((suggestion, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1.5 bg-[#f8f8f8] text-[#666666] rounded-full text-sm cursor-pointer hover:bg-[#e5e5e7]"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isCartDropdownVisible && (
          <div className="navbar-mobile-dropdown cart-dropdown fixed top-[48px] left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 animate-slideDown">
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">Tu Carrito</h3>
              {cartItems.length > 0 ? (
                <div>
                  {cartItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b">
                      <div className="flex items-center">
                        <img src={item.product.imageUrls[0]} alt={item.product.name} className="w-12 h-12 object-cover mr-2" />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-600">${item.product.price}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm">x{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 2 && (
                    <p className="text-sm text-center mt-2">Y {cartItems.length - 2} productos más...</p>
                  )}
                  <div className="mt-3 flex justify-between items-center">
                    <p className="font-bold">Total: ${cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</p>
                    <button 
                      className="bg-[#ff4f41] text-white px-4 py-1 rounded-md"
                      onClick={() => {
                        setIsCartDropdownVisible(false);
                        navigate('/cart-list');
                      }}
                    >
                      Ver Carrito
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-center py-4">Tu carrito está vacío</p>
              )}
            </div>
          </div>
        )}

        {isUserDropdownVisible && (
          <div className="navbar-mobile-dropdown user-dropdown fixed top-[48px] left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 animate-slideDown">
            <div className="p-4">
              {isAuthenticated ? (
                <div>
                  <div className="flex items-center mb-3">
                    <FaRegUserCircle className="text-2xl mr-2" />
                    <div>
                      <p className="font-bold">{user?.name || 'Usuario'}</p>
                      <p className="text-sm text-gray-600">{user?.email || 'usuario@ejemplo.com'}</p>
                    </div>
                  </div>
                  
                  {/* Selector de modo de usuario móvil */}
                  <div className="mb-3 pb-3 border-b border-gray-200">
                    <UserModeSelector className="w-full" />
                  </div>
                  
                  <div className="space-y-2">
                    <button 
                      className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md flex items-center"
                      onClick={() => {
                        setIsUserDropdownVisible(false);
                        navigate('/user-dashboard');
                      }}
                    >
                      <FaUser className="mr-2" /> Mi Cuenta
                    </button>
                    {isUserReady && user.shop?._id ? (
                      <button 
                        className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md flex items-center"
                        onClick={() => {
                          setIsUserDropdownVisible(false);
                          navigate(`/shop/${user.shop?._id}`);
                        }}
                      >
                        <FaShop className="mr-2" /> Mi Tienda
                      </button>
                    ) : (
                      <button 
                        className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md flex items-center"
                        onClick={() => {
                          setIsUserDropdownVisible(false);
                          toggleModal();
                        }}
                      >
                        <FaShop className="mr-2" /> Crear Tienda
                      </button>
                    )}
                    <button 
                      className="w-full text-left py-2 px-3 hover:bg-gray-100 rounded-md flex items-center"
                      onClick={() => {
                        setIsUserDropdownVisible(false);
                        handleLogout();
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg> Cerrar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button 
                    className="w-full bg-[#ff4f41] text-white py-2 rounded-md h-10 flex items-center justify-center"
                    onClick={() => {
                      setIsUserDropdownVisible(false);
                      navigate('/login');
                    }}
                  >
                    Iniciar Sesión
                  </button>
                  <button 
                    className="w-full border border-[#ff4f41] text-[#ff4f41] py-2 rounded-md h-10 flex items-center justify-center"
                    onClick={() => {
                      setIsUserDropdownVisible(false);
                      navigate('/register');
                    }}
                  >
                    Crear Cuenta
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Mobile Sidebar Menu Overlay */}
      {isSidebarOpen && (
        <div id="sidebar-overlay" className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar Menu */}
      <div id="sidebar" className={`fixed left-0 top-0 w-4/5 max-w-sm h-full bg-white transition-transform duration-300 ease-in-out z-50 flex flex-col ${isSidebarOpen ? 'transform-none' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-[#e5e5e7] flex items-center justify-between">
          <div className="text-lg font-bold font-space text-[#ff4f41]">Menú</div>
          <button id="close-sidebar" className="w-8 h-8 flex items-center justify-center" onClick={() => setIsSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav id="sidebar-nav" className="flex-grow">
          <div className="py-2">
            <button className="w-full px-4 py-3 border-b border-[#e5e5e7] text-left" onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}>
              <span className="text-[#1c1c1e] font-medium flex justify-between items-center">
                Categorías <FaChevronDown className={`text-xs transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {isCategoryMenuOpen && (
              <div className="bg-[#f8f8f8] py-2 px-4 space-y-2 animate-expandDropdown">
                <div className="flex items-center py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    handleCategorySearch('Electrónica');
                    setIsSidebarOpen(false);
                  }}>
                  <FaLaptop className="mr-3 text-[#ff4f41] flex-shrink-0" />
                  Electrónica
                </div>
                <div className="flex items-center py-2 text-[#666666] hover:text-[#00a699] transition-colors cursor-pointer"
                  onClick={() => {
                    handleCategorySearch('Moda');
                    setIsSidebarOpen(false);
                  }}>
                  <FaTshirt className="mr-3 text-[#00a699] flex-shrink-0" />
                  Moda
                </div>
                <div className="flex items-center py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    handleCategorySearch('Hogar');
                    setIsSidebarOpen(false);
                  }}>
                  <FaHome className="mr-3 text-[#ff4f41] flex-shrink-0" />
                  Hogar
                </div>
                <div className="flex items-center py-2 text-[#666666] hover:text-[#00a699] transition-colors cursor-pointer"
                  onClick={() => {
                    handleCategorySearch('Deportes');
                    setIsSidebarOpen(false);
                  }}>
                  <FaDumbbell className="mr-3 text-[#00a699] flex-shrink-0" />
                  Deportes
                </div>
                <div className="flex items-center py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    handleCategorySearch('Gaming');
                    setIsSidebarOpen(false);
                  }}>
                  <FaGamepad className="mr-3 text-[#ff4f41] flex-shrink-0" />
                  Gaming
                </div>
                <div className="border-t border-[#e5e5e7] mt-2 pt-2">
                  <div className="flex items-center py-2 text-[#ff4f41] hover:bg-[#f8f8f8] transition-colors font-medium cursor-pointer"
                    onClick={() => {
                      navigate('/categories');
                      setIsSidebarOpen(false);
                    }}>
                    Ver todas las categorías
                  </div>
                </div>
              </div>
            )}
            <button className="w-full px-4 py-3 border-b border-[#e5e5e7] text-left" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <span className="text-[#1c1c1e] font-medium flex justify-between items-center">
                En Vivo <FaChevronDown className={`text-xs transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {isDropdownOpen && (
              <div className="bg-[#f8f8f8] py-2 px-4 space-y-2 animate-expandDropdown">
                <div className="block py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/live-streams');
                    setIsSidebarOpen(false);
                  }}>
                  <span className="text-red-500 mr-3">🔴</span>En vivo ahora
                </div>
                <div className="block py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/upcoming-streams');
                    setIsSidebarOpen(false);
                  }}>
                  <span className="mr-3">📅</span>Próximas transmisiones
                </div>
                <div className="block py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/tutorials');
                    setIsSidebarOpen(false);
                  }}>
                  <span className="mr-3">🧑‍💻</span>Tutoriales en vivo
                </div>
              </div>
            )}
            <button className="w-full px-4 py-3 border-b border-[#e5e5e7] text-left" onClick={() => setIsModalOpen(!isModalOpen)}>
              <span className="text-[#1c1c1e] font-medium flex justify-between items-center">
                ¿Cómo Funciona? <FaChevronDown className={`text-xs transition-transform ${isModalOpen ? 'rotate-180' : ''}`} />
              </span>
            </button>
            {isModalOpen && (
              <div className="bg-[#f8f8f8] py-2 px-4 space-y-2 animate-expandDropdown">
                <div className="flex items-center py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/how-it-works/buyers');
                    setIsSidebarOpen(false);
                  }}>
                  <FaShoppingCart className="mr-3 text-[#ff4f41] flex-shrink-0" />
                  Para compradores
                </div>
                <div className="flex items-center py-2 text-[#666666] hover:text-[#00a699] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/how-it-works/sellers');
                    setIsSidebarOpen(false);
                  }}>
                  <BsShop className="mr-3 text-[#00a699] flex-shrink-0" />
                  Para tiendas
                </div>
                <div className="flex items-center py-2 text-[#666666] hover:text-[#ff4f41] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/how-it-works/influencers');
                    setIsSidebarOpen(false);
                  }}>
                  <FaStar className="mr-3 text-[#ff4f41] flex-shrink-0" />
                  Para influencers
                </div>
              </div>
            )}
            <button className="w-full px-4 py-3 text-[#1c1c1e] font-medium border-b border-[#e5e5e7] text-left" onClick={() => { navigate('/contacto'); setIsSidebarOpen(false); }}>
              Contacto
            </button>
            
            {/* Opciones de usuario */}
            {isAuthenticated ? (
              <>
                <button className="w-full px-4 py-3 text-[#1c1c1e] font-medium border-b border-[#e5e5e7] text-left" onClick={() => { navigate('/cart-list'); setIsSidebarOpen(false); }}>
                  Mi Carrito
                  {cartCount > 0 && (
                    <span className="ml-2 bg-[#ff4f41] text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button className="w-full px-4 py-3 text-[#1c1c1e] font-medium border-b border-[#e5e5e7] text-left" onClick={() => { navigate('/user-dashboard'); setIsSidebarOpen(false); }}>
                  Mi Cuenta
                </button>
                {isUserReady && user.shop?._id ? (
                  <button className="w-full px-4 py-3 text-[#1c1c1e] font-medium border-b border-[#e5e5e7] text-left" onClick={() => { navigate(`/shop/${user.shop?._id}`); setIsSidebarOpen(false); }}>
                    Ver mi tienda
                  </button>
                ) : (
                  <button className="w-full px-4 py-3 text-[#1c1c1e] font-medium border-b border-[#e5e5e7] text-left" onClick={() => { toggleModal(); setIsSidebarOpen(false); }}>
                    Crear tienda
                  </button>
                )}
                <button className="w-full px-4 py-3 text-[#1c1c1e] font-medium border-b border-[#e5e5e7] text-left" onClick={() => { handleLogout(); setIsSidebarOpen(false); }}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button className="w-full block px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] text-left border-b border-[#e5e5e7]" onClick={() => { navigate('/login'); setIsSidebarOpen(false); }}>
                  <FaRegUserCircle className="mr-3 text-[#ff4f41] inline-block" /> Ingresar
                </button>
                <button className="w-full block px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] text-left border-b border-[#e5e5e7]" onClick={() => { navigate('/shop-create'); setIsSidebarOpen(false); }}>
                  <BsShop className="mr-3 text-[#00a699] inline-block" /> Abrir tienda
                </button>
                <button className="w-full block px-4 py-3 text-[#1c1c1e] hover:bg-[#f8f8f8] text-left border-b border-[#e5e5e7]" onClick={() => { navigate('/influencer-register'); setIsSidebarOpen(false); }}>
                  <FaStar className="mr-3 text-[#ff4f41] inline-block" /> Ser influencer
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
      
      {/* Search Dropdown */}
      <div id="search-dropdown" className="hidden fixed top-16 left-4 right-4 bg-white rounded-lg shadow-lg border border-[#e5e5e7] z-50">
        <div className="p-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscá por marca, modelo..." 
              className="w-full h-12 pl-12 pr-4 bg-[#f8f8f8] rounded-lg border border-[#e5e5e7] text-base focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666666] text-lg" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="text-xs text-[#666666] font-medium">Búsquedas populares:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 3).map((suggestion, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-[#f8f8f8] text-[#666666] rounded-full text-sm cursor-pointer hover:bg-[#e5e5e7]"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        duration={3000}
      />
    </>
  );
};