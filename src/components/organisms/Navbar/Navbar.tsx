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
// Importar el icono de lupa
import { FaSearch } from "react-icons/fa";
import { InputDefault } from '../../atoms/InputDefault/InputDefault';
import { useCartStore } from '../../../stores/cartStore';
import Toast from '../../atoms/Toast';
import { useShopStore } from '../../../stores/slices/shopStore';
import './NavbarMobile.css';

export const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    fetchSearchResults({ term: categoryTerm });
    navigate(`/search?q=${encodeURIComponent(categoryTerm)}`);
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
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={handleSearchChange ? (v) => handleSearchChange({ target: { value: v } } as any) : undefined}
                    icon={<FaSearch className="text-gray-400" />}
                    className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
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
        <div className="flex items-start space-x-6 mt-1 pr-4">
          {isAuthenticated ? (
            <>
              <div 
                className="flex items-center cursor-pointer px-2 hover:text-red-500 transition-colors relative"
                onClick={() => navigate('/cart-list')}
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
              </div>
              
              {/* Mostrar "Crear tienda" si no tiene tienda, "Ver mi tienda" si ya la tiene */}
              {isUserReady && user.shop ? (
                <div className="flex items-center cursor-pointer hover:text-red-500 transition-colors">
                  <BsShop onClick={() => handleShopAccess('/first-layout?view=true')} className="text-xl mr-2" />
                  <span onClick={() => handleShopAccess('/first-layout?view=true')}>Ver mi tienda</span>
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
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/data-dashboard')}>
                        Mi usuario
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black" onClick={() => navigate('/cart-list')}>
                        Mi carrito
                      </li>
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
      {/* Desktop Menu Below Navbar */}
      <div className="hidden md:flex w-full justify-center mt-[70px]">
        <div className="flex gap-8 text-gray-600 text-sm justify-center">
          <a href="#" className="hover:text-red-500 transition-colors">Gestión de ventas</a>
          <div 
            className="relative"
            onMouseEnter={openCategoryMenu}
            onMouseLeave={closeCategoryMenu}
          >
            <a href="#" className="hover:text-red-500 transition-colors">Categorias</a>
            {isCategoryMenuOpen && (
              <div 
                className="absolute bg-white shadow-lg rounded-md border border-gray-200 mt-2 w-48 z-10"
                onMouseEnter={openCategoryMenu}
                onMouseLeave={closeCategoryMenu}
              >
                <ul className="py-2">
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                    onClick={() => handleCategorySearch('laptop')}
                  >
                    Laptop
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 2</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 3</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black">Categoría 4</li>
                </ul>
              </div>
            )}
          </div>
          <a href="#" className="hover:text-red-500 transition-colors">Cupones</a>
          <a href="#" className="hover:text-red-500 transition-colors">Productos</a>
          <a href="#" className="hover:text-red-500 transition-colors">Ofertas</a>
        </div>
      </div>
      <div className="hidden md:block w-full mt-4" /> 
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
            onClick={() => navigate(isAuthenticated ? '/data-dashboard' : '/login')}
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