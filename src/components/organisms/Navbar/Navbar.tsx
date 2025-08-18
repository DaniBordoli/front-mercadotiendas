import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../../atoms/Logo';
import { FaShop, FaUser } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";
import { useAuthStore, useSearchStore } from '../../../stores/index';
import { SearchSuggestions } from '../../molecules/SearchSuggestions';
import { DesignButton } from '../../atoms/DesignButton';
import { FaRegUserCircle } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import { FaRegCircleQuestion } from "react-icons/fa6";
import { BsShop } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { InputDefault } from '../../atoms/InputDefault/InputDefault';
import { useCartStore } from '../../../stores/cartStore';
import Toast from '../../atoms/Toast';
import { useShopStore } from '../../../stores/slices/shopStore';
import { fetchMainCategories } from '../../../stores/slices/authSlice';
import './NavbarMobile.css';
import { FaChevronDown, FaLaptop, FaTshirt, FaHome, FaDumbbell, FaGamepad, FaStar } from "react-icons/fa";
import CartPreview from '../../molecules/CartPreview';

export const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartPreviewVisible, setIsCartPreviewVisible] = useState(false);
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
      <nav className="navbar-desktop w-full bg-white px-4 py-2 flex items-start justify-center z-50 fixed top-0 left-0 border-b border-gray-200">
        <div className="container flex w-full max-w-3xl mx-auto">
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-4 mb-1 w-full">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
                <Logo size={28} color="skyblue" />
                <h1 className="text-xl ml-2 font-space">MercadoTiendas</h1>
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
        <div className="flex items-center space-x-6 mt-1 pr-4">
          <div className="flex items-center space-x-6">
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
                <span>Mi carrito</span>
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
              <div className={`relative flex items-center cursor-pointer transition-colors ${isDropdownOpen ? 'text-red-500' : 'hover:text-red-500'}`} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <FaRegUserCircle className="text-xl mr-2" />
                <span>Mi cuenta</span>
                {isDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 transition-transform duration-300 ease-in-out transform origin-top scale-y-100" style={{ transform: isDropdownOpen ? 'scaleY(1)' : 'scaleY(0)' }}>                    <ul className="py-2">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/user-dashboard')}>
                        Mi Dashboard
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/data-dashboard')}>
                        Mi Perfil
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/cart-list')}>
                        Mi carrito
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
          <span>Ver mi carrito</span>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] md:w-[50%] lg:w-[30%] shadow-lg">
              <h3 className="text-lg font-bold mb-4 font-space text-center">
                ¿Quieres ir por la creación manual o vía IA?
              </h3>
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <button
                    className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-md w-full text-left"
                    onClick={() => navigate('/user-dashboard')}
                  >
                    <FaRegUserCircle className="text-gray-600" />
                    Mi dashboard
                  </button>
                  <button
                    className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-md w-full text-left"
                    onClick={() => navigate('/data-dashboard')}
                  >
                    <FaRegUserCircle className="text-gray-600" />
                    Mi perfil
                  </button>
                  {user?.shop ? (
                    <button
                      className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-md w-full text-left"
                      onClick={() => handleShopAccess('/shop-profile')}
                    >
                      <BsShop className="text-gray-600" />
                      Mi tienda
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-md w-full text-left"
                      onClick={() => navigate('/my-applications')}
                    >
                      <BsShop className="text-gray-600" />
                      Mis aplicaciones
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 hover:bg-gray-100 px-4 py-2 rounded-md w-full text-left"
                    onClick={handleLogout}
                  >
                    <FaRegCircleQuestion className="text-gray-600" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <DesignButton
                    variant="secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate('/shop-create');
                    }}
                  >
                    Creación Manual
                  </DesignButton>
                  <DesignButton
                    variant="secondary"
                    onClick={() => {
                      setIsModalOpen(false);
                      navigate('/layout-select');
                    }}
                  >
                    Creación vía IA
                  </DesignButton>
                </div>
              )}
              <button
                className="mt-4 text-sm text-gray-900 font-space w-full text-center"
                onClick={toggleModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </nav>
      

      
      {/* Espaciador para compensar el menú fijo */}
      <div className="hidden md:block w-full h-[110px]" /> 
      {/* Mobile Navbar */}
      <nav className="navbar-mobile fixed top-0 left-0 w-full z-50">
        <div className="navbar-mobile-logo" onClick={() => navigate('/dashboard')}>
          <Logo size={28} color="skyblue" />
          <span className="text-lg font-space font-semibold">Mercado Tiendas</span>
        </div>
        <div className="navbar-mobile-actions">
          <FaSearch className="text-xl text-gray-700 cursor-pointer" />
          <FaShoppingCart className="text-xl text-gray-700 cursor-pointer" onClick={() => navigate('/cart')} />
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Perfil"
            className="navbar-mobile-profile"
            onClick={() => navigate(isAuthenticated ? '/user-dashboard' : '/login')}
          />
        </div>
      </nav>
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