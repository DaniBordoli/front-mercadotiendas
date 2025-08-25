import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { FaCheck, FaChevronDown, FaShoppingCart, FaStore, FaStar, FaUser, FaExchangeAlt, FaSignOutAlt, FaInfoCircle, FaCloudUploadAlt, FaInstagram, FaTiktok, FaYoutube, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { getCountryOptions, getCountryByCode, getCountryOptionLabel, type CountryOption } from '../utils/countriesLibrary';
import { fetchMainCategories } from '../stores/slices/authSlice';

type UserType = 'buyer' | 'seller' | 'influencer';

interface AccordionState {
  [key: string]: boolean;
}

function RoleConfigurationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialSelectedRoles: UserType[] = (location.state as any)?.selectedRoles || ['buyer'];
  const [selectedRoles] = useState<UserType[]>(initialSelectedRoles);
  const [activeTab, setActiveTab] = useState<UserType>(initialSelectedRoles[0]);
  const [accordionStates, setAccordionStates] = useState<AccordionState>({
    address: true,
    storeBasics: true,
    storeOptional: false,
    publicProfile: true,
    categoryNiches: false
  });

  // Estado para modal de confirmación
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  // selectedRoles se inicializa arriba desde la navegación y contiene solo los roles elegidos

  // Estado para dirección preferida
  const [preferredAddress, setPreferredAddress] = useState({
    country: '',
    province: '',
    city: '',
    postalCode: '',
    streetAndNumber: ''
  });
  const [selectedPreferredCountry, setSelectedPreferredCountry] = useState<CountryOption | null>(null);

  // Estado para datos básicos de la tienda (reutilizado de DataSeller)
  const [storeData, setStoreData] = useState({
    storeName: '',
    phone: '',
    country: '',
    province: '',
    city: ''
  });
  const [selectedStoreCountry, setSelectedStoreCountry] = useState<CountryOption | null>(null);
  const [storeLogo, setStoreLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [initialCategories, setInitialCategories] = useState<string[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([]);

  // Estado para datos de influencer (reutilizado de DataInfluencer)
  const [influencerData, setInfluencerData] = useState({
    username: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    category: '',
    niches: [] as string[]
  });

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchMainCategories();
        setCategoryOptions([
          { value: '', label: 'Seleccionar categoría' },
          ...categories.map((cat: any) => ({ value: cat.name, label: cat.name }))
        ]);
      } catch (error) {
        console.error('Error loading categories:', error);
        setCategoryOptions([{ value: '', label: 'Error al cargar categorías' }]);
      }
    };
    loadCategories();
  }, []);

  // Funciones para manejar cambios en datos de influencer
  const handleInfluencerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfluencerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInfluencerNicheChange = (niche: string) => {
    setInfluencerData(prev => {
      const niches = prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : prev.niches.length < 5
        ? [...prev.niches, niche]
        : prev.niches;
      return { ...prev, niches };
    });
  };

  const toggleAccordion = (key: string) => {
    setAccordionStates(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleTabChange = (tab: UserType) => {
    if (!selectedRoles.includes(tab)) return;
    setActiveTab(tab);
  };

  // Funciones para calcular contadores dinámicos
  const calculateBuyerProgress = () => {
    // Comprador no tiene campos requeridos, siempre está completo
    return { completed: 0, total: 0 };
  };

  const calculateSellerProgress = () => {
    let completed = 0;
    const total = 3; // storeName, phone, country/province/city
    
    if (storeData.storeName.trim()) completed++;
    if (storeData.phone.trim()) completed++;
    if (storeData.country.trim() && storeData.province.trim() && storeData.city.trim()) completed++;
    
    return { completed, total };
  };

  const calculateInfluencerProgress = () => {
    let completed = 0;
    const total = 2; // username, category
    
    if (influencerData.username.trim()) completed++;
    if (influencerData.category.trim()) completed++;
    
    return { completed, total };
  };

  // Función para obtener el progreso de un rol específico
  const getRoleProgress = (role: UserType) => {
    switch (role) {
      case 'buyer': return calculateBuyerProgress();
      case 'seller': return calculateSellerProgress();
      case 'influencer': return calculateInfluencerProgress();
      default: return { completed: 0, total: 0 };
    }
  };

  // Funciones de guardado específicas para cada rol
  const handleSaveBuyer = async () => {
    try {
      // Guardar dirección preferida si está completa
      if (preferredAddress.country || preferredAddress.province || preferredAddress.city || 
          preferredAddress.postalCode || preferredAddress.streetAndNumber) {
        const payload = {
          preferredAddress: {
            ...preferredAddress,
            role: 'buyer'
          }
        };
        
        // Aquí iría la llamada a la API para guardar los datos
        // await updateUserProfile(payload);
        console.log('Guardando dirección preferida:', payload);
      }
      
      checkMultipleRolesAndNavigate();
    } catch (error) {
      console.error('Error al guardar configuración de comprador:', error);
      checkMultipleRolesAndNavigate();
    }
  };

  const handleSaveSeller = async () => {
    try {
      // Guardar datos de la tienda si están completos
      if (storeData.storeName || storeData.phone || storeData.country || 
          storeData.province || storeData.city) {
        const storePayload = {
          storeData: {
            ...storeData,
            role: 'seller'
          }
        };
        
        // Aquí iría la llamada a la API para guardar los datos de la tienda
        // await createShop(storePayload);
        console.log('Store data saved:', storeData);
        console.log('Store logo saved:', storeLogo);
        console.log('Initial categories saved:', initialCategories);
        console.log('Guardando datos de tienda:', storePayload);
      }
      
      checkMultipleRolesAndNavigate();
    } catch (error) {
      console.error('Error al guardar configuración de vendedor:', error);
      checkMultipleRolesAndNavigate();
    }
  };

  const handleSaveInfluencer = async () => {
    try {
      // Guardar datos de influencer si están completos
      if (influencerData.username || influencerData.instagram || influencerData.tiktok || 
          influencerData.youtube || influencerData.category || influencerData.niches.length > 0) {
        const influencerPayload = {
          influencerData: {
            ...influencerData,
            role: 'influencer'
          }
        };
        
        // Aquí iría la llamada a la API para guardar los datos del influencer
        // await createInfluencerProfile(influencerPayload);
        console.log('Guardando datos de influencer:', influencerPayload);
      }
      
      checkMultipleRolesAndNavigate();
    } catch (error) {
      console.error('Error al guardar configuración de influencer:', error);
      checkMultipleRolesAndNavigate();
    }
  };

  // Función para verificar múltiples roles y mostrar modal si es necesario
  const checkMultipleRolesAndNavigate = () => {
    if (selectedRoles.length > 1) {
      setShowConfirmModal(true);
      setPendingNavigation('/success');
    } else {
      navigate('/success', { 
        state: { 
          fromRoleConfiguration: true,
          selectedRoles: selectedRoles,
          completedRoles: selectedRoles.map(role => ({
            role,
            progress: getRoleProgress(role)
          }))
        } 
      });
    }
  };

  // Función para manejar "Terminar más tarde"
  const handleFinishLater = () => {
    if (selectedRoles.length > 1) {
      setShowConfirmModal(true);
      setPendingNavigation(null); // stay on this screen
    } else {
      navigate('/success', { 
        state: { 
          fromRoleConfiguration: true,
          selectedRoles: selectedRoles,
          completedRoles: selectedRoles.map(role => ({
            role,
            progress: getRoleProgress(role)
          })),
          finishedLater: true
        } 
      });
    }
  };

  // Funciones del modal de confirmación
  const handleContinueConfiguring = () => {
    setShowConfirmModal(false);
    setPendingNavigation(null);
    // Cambiar a la siguiente pestaña que no esté configurada
    const nextRole = selectedRoles.find(role => {
      const progress = getRoleProgress(role);
      return progress.completed < progress.total;
    });
    if (nextRole && nextRole !== activeTab) {
      setActiveTab(nextRole);
    }
  };

  const handleCompleteNow = () => {
    setShowConfirmModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation, { 
        state: { 
          fromRoleConfiguration: true,
          selectedRoles: selectedRoles,
          completedRoles: selectedRoles.map(role => ({
            role,
            progress: getRoleProgress(role)
          }))
        } 
      });
    }
    setPendingNavigation(null);
  };

  // Función para obtener la función de guardado según el rol activo
  const getHandleSaveFunction = () => {
    switch (activeTab) {
      case 'buyer': return handleSaveBuyer;
      case 'seller': return handleSaveSeller;
      case 'influencer': return handleSaveInfluencer;
      default: return handleSaveBuyer;
    }
  };

  const handlePreferredCountryChange = (selectedOption: CountryOption | null) => {
    setSelectedPreferredCountry(selectedOption);
    if (selectedOption) {
      setPreferredAddress(prev => ({ ...prev, country: selectedOption.value }));
    } else {
      setPreferredAddress(prev => ({ ...prev, country: '' }));
    }
  };

  // Funciones de manejo para datos de la tienda (reutilizadas de DataSeller)
  const handleStoreInputChange = (field: string, value: string) => {
    setStoreData(prev => ({ ...prev, [field]: value }));
  };

  const handleStoreCountryChange = (selectedOption: CountryOption | null) => {
    setSelectedStoreCountry(selectedOption);
    if (selectedOption) {
      handleStoreInputChange('country', selectedOption.value);
    } else {
      handleStoreInputChange('country', '');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setLogoError('El archivo es demasiado grande. Máximo 10MB.');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setLogoError('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      setLogoError(null);
      setStoreLogo(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setStoreLogo(null);
    setLogoPreview(null);
    setLogoError(null);
  };

  const handleCategoryChange = (categoryName: string) => {
    if (categoryName && !initialCategories.includes(categoryName)) {
      if (initialCategories.length < 3) {
        setInitialCategories(prev => [...prev, categoryName]);
      }
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setInitialCategories(prev => prev.filter(cat => cat !== categoryToRemove));
  };

  const renderBuyerContent = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] mb-6">
      <div className="p-8">
        {/* Success State */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#00a699]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaCheck className="text-3xl text-[#00a699]" />
          </div>
          <p className="text-[#666666] text-lg">Listo para usar el marketplace.</p>
        </div>

        {/* Optional Address Accordion */}
        <div className="border border-[#e5e5e7] rounded-lg">
          <button 
            className="accordion-header w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f8f8f8] transition-colors rounded-lg"
            onClick={() => toggleAccordion('address')}
          >
            <span className="font-medium text-[#1c1c1e] flex items-center gap-2">
              Dirección preferida (opcional)
              <FaCheck className="text-[#00a699] text-sm saved-indicator hidden" />
            </span>
            <FaChevronDown className={`text-[#666666] accordion-icon transition-transform ${accordionStates.address ? 'rotate-180' : ''}`} />
          </button>
          {accordionStates.address && (
            <div className="accordion-content px-6 pb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">País</label>
                  <Select
                    value={selectedPreferredCountry}
                    onChange={handlePreferredCountryChange}
                    options={getCountryOptions()}
                    getOptionLabel={getCountryOptionLabel}
                    placeholder="Seleccionar país"
                    isClearable
                    className="react-select-container"
                    classNamePrefix="react-select"
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '48px',
                        minHeight: '48px',
                        border: '1px solid #e5e5e7',
                        borderRadius: '8px',
                        boxShadow: 'none',
                        '&:hover': {
                          borderColor: '#e5e5e7'
                        },
                        '&:focus-within': {
                          borderColor: '#ff4f41',
                          boxShadow: '0 0 0 2px rgba(255, 79, 65, 0.2)'
                        }
                      }),
                      valueContainer: (provided) => ({
                        ...provided,
                        height: '46px',
                        padding: '0 16px'
                      }),
                      input: (provided) => ({
                        ...provided,
                        margin: '0',
                        padding: '0'
                      }),
                      indicatorsContainer: (provided) => ({
                        ...provided,
                        height: '46px'
                      })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Provincia</label>
                  <input 
                    type="text" 
                    placeholder="Seleccionar provincia" 
                    value={preferredAddress.province}
                    onChange={(e) => setPreferredAddress(prev => ({ ...prev, province: e.target.value }))}
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Ciudad</label>
                  <input 
                    type="text" 
                    placeholder="Tu ciudad" 
                    value={preferredAddress.city}
                    onChange={(e) => setPreferredAddress(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Código Postal</label>
                  <input 
                    type="text" 
                    placeholder="CP" 
                    value={preferredAddress.postalCode}
                    onChange={(e) => setPreferredAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Calle y número</label>
                  <input 
                    type="text" 
                    placeholder="Av. Corrientes 1234" 
                    value={preferredAddress.streetAndNumber}
                    onChange={(e) => setPreferredAddress(prev => ({ ...prev, streetAndNumber: e.target.value }))}
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Secondary Info */}
        <div className="mt-6 text-center mb-8">
          <p className="text-[#666666] text-sm">Podés configurar Vendedor o Influencer cuando quieras desde tu perfil.</p>
        </div>

        {/* Action Row inside card */}
        <div className="border-t border-[#e5e5e7] pt-6 mt-6">
          <div className="flex items-center justify-between">
            {/* Left side - Status chips */}
            <div className="flex items-center gap-2">
                {selectedRoles.includes('buyer') && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-[#f8f8f8] text-[#666666] text-xs rounded-full">
                    Comprador {getRoleProgress('buyer').completed}/{getRoleProgress('buyer').total}
                  </span>
                )}
                {selectedRoles.includes('seller') && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-[#f8f8f8] text-[#666666] text-xs rounded-full">
                    Vendedor {getRoleProgress('seller').completed}/{getRoleProgress('seller').total}
                  </span>
                )}
                {selectedRoles.includes('influencer') && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-[#ff4f41]/10 text-[#ff4f41] text-xs rounded-full">
                    Influencer {getRoleProgress('influencer').completed}/{getRoleProgress('influencer').total}
                  </span>
                )}
            </div>
            
            {/* Right side - Action buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleFinishLater}
                className="px-4 py-2.5 text-[#666666] hover:text-[#1c1c1e] transition-colors font-medium text-sm"
              >
                Terminar más tarde
              </button>
              <button 
                onClick={handleSaveBuyer}
                className="min-w-[180px] h-12 px-6 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/90 transition-colors font-medium text-sm"
              >
                Guardar y finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSellerContent = () => (
    <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] mb-6">
      <div className="p-8">
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center px-3 py-1.5 bg-[#ff4f41]/10 text-[#ff4f41] text-xs rounded-full font-medium">
              Requeridos mínimos: 3
            </span>
          </div>
        </div>

        {/* Datos básicos de la tienda Accordion */}
        <div className="border border-[#e5e5e7] rounded-lg">
          <button 
            className="accordion-header w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f8f8f8] transition-colors rounded-lg"
            onClick={() => toggleAccordion('storeBasics')}
          >
            <span className="font-medium text-[#1c1c1e] flex items-center gap-2">
              Datos básicos de la tienda
              <FaCheck className="text-[#00a699] text-sm saved-indicator hidden" />
            </span>
            <FaChevronDown className={`text-[#666666] accordion-icon transition-transform ${accordionStates.storeBasics ? 'rotate-180' : ''}`} />
          </button>
          {accordionStates.storeBasics && (
            <div className="accordion-content px-6 pb-6">
              <div className="space-y-4">
                {/* Nombre de la tienda */}
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Nombre de la tienda <span className="text-[#ff4f41]">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={storeData.storeName}
                    onChange={(e) => handleStoreInputChange('storeName', e.target.value)}
                    placeholder="Ej: Fashion Hub Store" 
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                  />
                  <p className="text-xs text-[#666666] mt-1">Podés cambiarlo luego.</p>
                </div>

                {/* Teléfono de contacto */}
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Teléfono de contacto <span className="text-[#ff4f41]">*</span>
                  </label>
                  <input 
                    type="tel" 
                    value={storeData.phone}
                    onChange={(e) => handleStoreInputChange('phone', e.target.value)}
                    placeholder="Ej: +54 11 1234-5678" 
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                  />
                </div>

                {/* Ubicación comercial */}
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Ubicación comercial <span className="text-[#ff4f41]">*</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1c1c1e] mb-2">País</label>
                      <Select
                        value={selectedStoreCountry}
                        onChange={handleStoreCountryChange}
                        options={getCountryOptions()}
                        getOptionLabel={getCountryOptionLabel}
                        placeholder="Seleccionar país"
                        isClearable
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            height: '48px',
                            minHeight: '48px',
                            border: '1px solid #e5e5e7',
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': {
                              borderColor: '#e5e5e7'
                            },
                            '&:focus-within': {
                              borderColor: '#ff4f41',
                              boxShadow: '0 0 0 2px rgba(255, 79, 65, 0.2)'
                            }
                          }),
                          valueContainer: (provided) => ({
                            ...provided,
                            height: '46px',
                            padding: '0 16px'
                          }),
                          input: (provided) => ({
                            ...provided,
                            margin: '0',
                            padding: '0'
                          })
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Provincia/Estado</label>
                      <input 
                        type="text" 
                        value={storeData.province}
                        onChange={(e) => handleStoreInputChange('province', e.target.value)}
                        placeholder="Ingresa tu provincia o estado" 
                        className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Ciudad</label>
                      <input 
                        type="text" 
                        value={storeData.city}
                        onChange={(e) => handleStoreInputChange('city', e.target.value)}
                        placeholder="Ej: Buenos Aires" 
                        className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optional Group (Collapsed) */}
        <div className="border border-[#e5e5e7] rounded-lg mt-4">
          <button 
            className="accordion-header w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f8f8f8] transition-colors rounded-lg"
            onClick={() => toggleAccordion('storeOptional')}
          >
            <span className="font-medium text-[#1c1c1e] flex items-center gap-2">
              Logo y categorías iniciales (opcional)
              <FaCheck className="text-[#00a699] text-sm saved-indicator hidden" />
            </span>
            <FaChevronDown className={`text-[#666666] accordion-icon transition-transform ${accordionStates.storeOptional ? 'rotate-180' : ''}`} />
          </button>
          {accordionStates.storeOptional && (
            <div className="accordion-content px-6 pb-6">
              <div className="space-y-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Logo de la tienda (opcional) - Tamaño máximo: 10MB Recomendado: 200x200 píxeles
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-[#f8f8f8] rounded-lg border-2 border-dashed border-[#e5e5e7] flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <FaCloudUploadAlt className="text-[#666666] text-xl" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        id="store-logo" 
                        accept="image/*" 
                        onChange={handleLogoChange}
                        className="hidden" 
                      />
                      <div className="flex flex-col">
                        <label 
                          htmlFor="store-logo" 
                          className="inline-flex items-center justify-center w-[158px] h-[42px] bg-white border border-[#e5e5e7] rounded-lg text-[#666666] hover:bg-[#f8f8f8] cursor-pointer transition-colors"
                        >
                          {isUploadingLogo ? (
                            <>
                              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                              Subiendo...
                            </>
                          ) : (
                            <>
                              <FaCloudUploadAlt className="mr-2" />
                              {storeLogo ? 'Cambiar imagen' : 'Subir imagen'}
                            </>
                          )}
                        </label>
                        {logoError && (
                          <p className="text-red-500 text-sm mt-1">{logoError}</p>
                        )}
                        {storeLogo && (
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-[#666666] mr-2">{storeLogo.name}</span>
                            <button 
                              type="button"
                              onClick={removeLogo}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Categorías iniciales */}
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Categorías iniciales (máximo 3)
                  </label>
                  
                  {/* Selected categories */}
                  {initialCategories.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {initialCategories.map((category, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#ff4f41] text-white"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Category selector */}
                  {initialCategories.length < 3 && (
                    <select 
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleCategoryChange(e.target.value);
                          e.target.value = ''; // Reset select
                        }
                      }}
                    >
                      <option value="">Agregar categoría</option>
                      {categoryOptions
                        .filter(option => option.value && !initialCategories.includes(option.value))
                        .map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))
                      }
                    </select>
                  )}
                  
                  {initialCategories.length >= 3 && (
                    <p className="text-sm text-[#666666] mt-1">
                      Has alcanzado el máximo de 3 categorías
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>



        {/* Action Row inside card */}
        <div className="border-t border-[#e5e5e7] pt-6 mt-6">
          <div className="flex items-center justify-between">
            {/* Left side - Status chips */}
            <div className="flex items-center gap-2">
                {selectedRoles.includes('buyer') && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-[#f8f8f8] text-[#666666] text-xs rounded-full">
                    Comprador {getRoleProgress('buyer').completed}/{getRoleProgress('buyer').total}
                  </span>
                )}
                {selectedRoles.includes('seller') && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-[#f8f8f8] text-[#666666] text-xs rounded-full">
                    Vendedor {getRoleProgress('seller').completed}/{getRoleProgress('seller').total}
                  </span>
                )}
                {selectedRoles.includes('influencer') && (
                  <span className="inline-flex items-center px-3 py-1.5 bg-[#ff4f41]/10 text-[#ff4f41] text-xs rounded-full">
                    Influencer {getRoleProgress('influencer').completed}/{getRoleProgress('influencer').total}
                  </span>
                )}
            </div>
            
            {/* Right side - Action buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleFinishLater}
                className="px-4 py-2.5 text-[#666666] hover:text-[#1c1c1e] transition-colors font-medium text-sm"
              >
                Terminar más tarde
              </button>
              <button 
                onClick={handleSaveSeller}
                className="min-w-[180px] h-12 px-6 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/90 transition-colors font-medium text-sm"
              >
                Guardar y finalizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInfluencerContent = () => {
    const availableNiches = [
      { id: 'streetwear', label: 'Streetwear' },
      { id: 'makeup', label: 'Makeup' },
      { id: 'skincare', label: 'Skincare' },
      { id: 'accessories', label: 'Accesorios' },
      { id: 'sneakers', label: 'Sneakers' },
      { id: 'wellness', label: 'Wellness' }
    ];

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] mb-6">
        <div className="p-8">
          {/* Section Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center px-3 py-1.5 bg-[#ff4f41]/10 text-[#ff4f41] text-xs rounded-full font-medium">
                Requeridos mínimos: 2
              </span>
            </div>
          </div>

          {/* Perfil público Accordion */}
          <div className="border border-[#e5e5e7] rounded-lg">
            <button 
              className="accordion-header w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f8f8f8] transition-colors rounded-lg"
              onClick={() => toggleAccordion('publicProfile')}
            >
              <span className="font-medium text-[#1c1c1e] flex items-center gap-2">
                Perfil público
                <FaCheck className="text-[#00a699] text-sm saved-indicator hidden" />
              </span>
              <FaChevronDown className={`text-[#666666] accordion-icon transition-transform ${accordionStates.publicProfile ? 'rotate-180' : ''}`} />
            </button>
            {accordionStates.publicProfile && (
              <div className="accordion-content px-6 pb-6">
                <div className="space-y-6">
                  {/* Public Username */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      Usuario público / @handle <span className="text-[#ff4f41]">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666666] font-medium">@</span>
                      <input 
                        type="text" 
                        id="username" 
                        name="username"
                        value={influencerData.username}
                        onChange={handleInfluencerInputChange}
                        placeholder="mi_usuario" 
                        className="w-full h-12 pl-8 pr-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                        required
                      />
                    </div>
                    <p className="text-xs text-[#666666] mt-1">Este será tu identificador único en MercadoTiendas</p>
                  </div>

                  {/* Social Networks */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2">Redes sociales</h3>
                    
                    {/* Instagram */}
                    <div>
                      <label htmlFor="instagram" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                        <FaInstagram className="text-pink-500 mr-2 inline" />Instagram
                      </label>
                      <input 
                        type="url" 
                        id="instagram" 
                        name="instagram"
                        value={influencerData.instagram}
                        onChange={handleInfluencerInputChange}
                        placeholder="https://instagram.com/tu_usuario" 
                        className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                      />
                    </div>

                    {/* TikTok */}
                    <div>
                      <label htmlFor="tiktok" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                        <FaTiktok className="text-black mr-2 inline" />TikTok
                      </label>
                      <input 
                        type="url" 
                        id="tiktok" 
                        name="tiktok"
                        value={influencerData.tiktok}
                        onChange={handleInfluencerInputChange}
                        placeholder="https://tiktok.com/@tu_usuario" 
                        className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                      />
                    </div>

                    {/* YouTube */}
                    <div>
                      <label htmlFor="youtube" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                        <FaYoutube className="text-red-500 mr-2 inline" />YouTube
                      </label>
                      <input 
                        type="url" 
                        id="youtube" 
                        name="youtube"
                        value={influencerData.youtube}
                        onChange={handleInfluencerInputChange}
                        placeholder="https://youtube.com/c/tu_canal" 
                        className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      Categoría principal <span className="text-[#ff4f41]">*</span>
                    </label>
                    <select 
                      id="category" 
                      name="category"
                      value={influencerData.category}
                      onChange={handleInfluencerInputChange}
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="fashion">Moda y estilo</option>
                      <option value="beauty">Belleza y cuidado personal</option>
                      <option value="tech">Tecnología</option>
                      <option value="lifestyle">Estilo de vida</option>
                      <option value="fitness">Fitness y bienestar</option>
                      <option value="food">Gastronomía</option>
                      <option value="travel">Viajes</option>
                      <option value="gaming">Gaming</option>
                      <option value="home">Hogar y decoración</option>
                      <option value="entertainment">Entretenimiento</option>
                    </select>
                  </div>

                  {/* Niches */}
                  <div>
                    <label className="block text-sm font-medium text-[#1c1c1e] mb-2">Nichos específicos</label>
                    <p className="text-xs text-[#666666] mb-3">Seleccioná hasta 5 nichos donde te especializás</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableNiches.map((niche) => (
                        <div key={niche.id} className="inline-flex items-center">
                          <input 
                            type="checkbox" 
                            id={`niche-${niche.id}`}
                            checked={influencerData.niches.includes(niche.id)}
                            onChange={() => handleInfluencerNicheChange(niche.id)}
                            className="mr-2 rounded border-[#e5e5e7] text-[#ff4f41] focus:ring-[#ff4f41]"
                          />
                          <label htmlFor={`niche-${niche.id}`} className="text-sm text-[#1c1c1e]">{niche.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Row inside card */}
          <div className="border-t border-[#e5e5e7] pt-6 mt-6">
            <div className="flex items-center justify-between">
              {/* Left side - Status chips */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1.5 bg-[#f8f8f8] text-[#666666] text-xs rounded-full">
                Comprador {getRoleProgress('buyer').completed}/{getRoleProgress('buyer').total}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-[#f8f8f8] text-[#666666] text-xs rounded-full">
                Vendedor {getRoleProgress('seller').completed}/{getRoleProgress('seller').total}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 bg-[#ff4f41]/10 text-[#ff4f41] text-xs rounded-full">
                Influencer {getRoleProgress('influencer').completed}/{getRoleProgress('influencer').total}
              </span>
              </div>
              
              {/* Right side - Action buttons */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleFinishLater}
                  className="px-4 py-2.5 text-[#666666] hover:text-[#1c1c1e] transition-colors font-medium text-sm"
                >
                  Terminar más tarde
                </button>
                <button 
                  onClick={handleSaveInfluencer}
                  className="min-w-[180px] h-12 px-6 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/90 transition-colors font-medium text-sm"
                >
                  Guardar y finalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-[#f8f8f8] min-h-screen font-sans flex flex-col" style={{paddingTop: '2px'}}>
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1 pt-[20px] pb-32">
          <div className="max-w-4xl mx-auto px-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <FaCheck className="text-sm" />
                  </div>
                  <div className="w-16 h-1 bg-[#00a699] mx-2"></div>
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <FaCheck className="text-sm" />
                  </div>
                  <div className="w-16 h-1 bg-[#ff4f41] mx-2"></div>
                  <div className="w-10 h-10 bg-[#ff4f41] rounded-full flex items-center justify-center text-white font-semibold">3</div>
                </div>
              </div>
              <p className="text-center text-[#666666]">Paso 3 de 3</p>
            </div>

            {/* Step Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Configurar roles</h1>
              <p className="text-[#666666] text-lg">Completá lo mínimo por cada rol. Podés terminar después.</p>
            </div>

            {/* Segmented Control */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-[#f8f8f8] rounded-lg p-1">
                {selectedRoles.includes('buyer') && (
                  <button
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === 'buyer'
                        ? 'bg-white text-[#ff4f41] shadow-sm'
                        : 'text-[#adaebc] opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => handleTabChange('buyer')}
                  >
                    <FaShoppingCart className="text-sm" />
                    Comprador
                    <span
                      className={`text-white text-xs px-2 py-1 rounded-full ${
                        activeTab === 'buyer' ? 'bg-[#00a699]' : 'bg-[#adaebc]'
                      }`}
                    >
                      {getRoleProgress('buyer').completed}/{getRoleProgress('buyer').total}
                    </span>
                  </button>
                )}
                {selectedRoles.includes('seller') && (
                  <button
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === 'seller'
                        ? 'bg-white text-[#ff4f41] shadow-sm'
                        : 'text-[#adaebc] opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => handleTabChange('seller')}
                  >
                    <FaStore className="text-sm" />
                    Vendedor
                    <span
                      className={`text-white text-xs px-2 py-1 rounded-full ${
                        activeTab === 'seller' ? 'bg-[#ff4f41]' : 'bg-[#adaebc]'
                      }`}
                    >
                      {getRoleProgress('seller').completed}/{getRoleProgress('seller').total}
                    </span>
                  </button>
                )}
                {selectedRoles.includes('influencer') && (
                  <button
                    className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === 'influencer'
                        ? 'bg-white text-[#ff4f41] shadow-sm'
                        : 'text-[#adaebc] opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => handleTabChange('influencer')}
                  >
                    <FaStar className="text-sm" />
                    Influencer
                    <span
                      className={`text-white text-xs px-2 py-1 rounded-full ${
                        activeTab === 'influencer' ? 'bg-[#ff4f41]' : 'bg-[#adaebc]'
                      }`}
                    >
                      {getRoleProgress('influencer').completed}/{getRoleProgress('influencer').total}
                    </span>
                  </button>
                )}


              </div>
            </div>

            {/* Dynamic Content based on active tab */}
            {activeTab === 'buyer' && renderBuyerContent()}
            {activeTab === 'seller' && renderSellerContent()}
            {activeTab === 'influencer' && renderInfluencerContent()}
          </div>
        </main>
        
        <FooterHome />
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FaExclamationTriangle className="text-3xl text-yellow-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">¿Continuar configurando?</h2>
              <p className="text-center text-gray-600 mb-6">Aún tenés roles sin completar. ¿Querés seguir configurando o finalizar ahora?</p>
              <div className="flex space-x-3">
                <button
                  onClick={handleContinueConfiguring}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Seguir configurando
                </button>
                <button
                  onClick={handleCompleteNow}
                  className="flex-1 px-4 py-3 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/90 transition-colors font-medium"
                >
                  Finalizar ahora
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RoleConfigurationScreen;