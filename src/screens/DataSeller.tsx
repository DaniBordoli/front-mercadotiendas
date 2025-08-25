import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import Select from 'react-select';
import { useAuthStore } from '../stores';
import { getCountryOptions, getCountryByCode, getCountryOptionLabel, type CountryOption } from '../utils/countriesLibrary';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

import { useShopStore } from '../stores/slices/shopStore';

function DataSeller() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { createShop } = useShopStore();
  const savedDraftStr = getStorageItem('sellerFormData');
  const savedDraft = savedDraftStr ? JSON.parse(savedDraftStr) : null;

  const [formData, setFormData] = useState({
    storeName: savedDraft?.storeName || '',
    phone: savedDraft?.phone || '',
    country: savedDraft?.country || '',
    province: savedDraft?.province || '',
    city: savedDraft?.city || '',
    cuit: savedDraft?.cuit || '',
    logo: null as File | null
  });
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    savedDraft?.country ? getCountryByCode(savedDraft.country) ?? null : null
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      setStorageItem('sellerFormData', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    setSelectedCountry(selectedOption);
    if (selectedOption) {
      handleInputChange('country', selectedOption.value);
    } else {
      handleInputChange('country', '');
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      setLogoError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setLogoError('La imagen debe ser menor a 10MB');
      return;
    }

    // Restablecer errores previos
    setLogoError(null);

    // Guardar archivo en el estado
    setFormData(prev => ({ ...prev, logo: file }));

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos requeridos
    if (!formData.storeName || !formData.phone || !selectedCountry) {
      setLogoError('Por favor completa todos los campos requeridos.');
      return;
    }

    setIsSubmitting(true);
    setLogoError(null);

    try {
      // Prepare shop data according to the Shop model
      const shopData: any = {
        shopName: formData.storeName, // Backend expects shopName
        shopPhone: formData.phone,
        country: selectedCountry?.value || '',
        province: formData.province,
        city: formData.city,
        address: `${formData.city}, ${formData.province}, ${selectedCountry?.label || ''}`, // Backend expects address
        subdomain: formData.storeName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30), // Generate subdomain from store name
        layoutDesign: 'default', // Required field
        contactEmail: user?.email || '', // Email del usuario autenticado
        category: 'other', // Default category
        description: '', // Default description
        active: true
      };

      // If there's a logo, include it in the shop data
      if (formData.logo) {
        shopData.image = formData.logo; // Pass the file directly to createShop
      }

      // Create shop (this will handle logo upload internally)
      await createShop(shopData);

      // Limpiar borrador guardado
      removeStorageItem('sellerFormData');
      console.log('Shop created successfully');
      
      // Small delay before navigation to ensure state is stable
      setTimeout(() => {
        navigate('/success');
      }, 500);
      
    } catch (error) {
      console.error('Error saving seller data:', error);
      setLogoError('Error al crear la tienda. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="bg-[#f8f8f8] min-h-screen font-sans flex flex-col" style={{paddingTop: '2px'}}>
        <Navbar />
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center" style={{paddingTop: '0px', paddingBottom: '50px'}}>
          <div className="max-w-4xl mx-auto px-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div className="w-16 h-1 bg-[#00a699] mx-2"></div>
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div className="w-16 h-1 bg-[#ff4f41] mx-2"></div>
                  <div className="w-10 h-10 bg-[#ff4f41] rounded-full flex items-center justify-center text-white font-semibold">3</div>
                </div>
              </div>
              <p className="text-center text-[#666666]">Paso 3 de 3</p>
            </div>

            {/* Step 3: Conditional Fields */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Configurá tu perfil de vendedor</h1>
                <p className="text-[#666666] text-lg">Completá estos datos para comenzar a vender en MercadoTiendas</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Store Name */}
                <div>
                  <label htmlFor="store-name" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Nombre de la tienda *
                  </label>
                  <input 
                    type="text" 
                    id="store-name" 
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    placeholder="Ej: Mi Tienda Fashion" 
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                  />
                </div>

                {/* Phone Contact */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Teléfono de contacto *
                  </label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Ej: +54 11 1234-5678" 
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                  />
                </div>

                {/* Commercial Location */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      País *
                    </label>
                    <Select
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      options={getCountryOptions()}
                      placeholder="Selecciona tu país"
                      isSearchable
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      getOptionLabel={(option: CountryOption) => getCountryOptionLabel(option)}
                      formatOptionLabel={(option: CountryOption) => (
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{option.flag}</span>
                          <span>{option.label}</span>
                        </div>
                      )}
                      styles={{
                        control: (provided, state) => ({
                          ...provided,
                          height: '48px',
                          minHeight: '48px',
                          border: '1px solid #e5e5e7',
                          borderRadius: '8px',
                          boxShadow: state.isFocused ? '0 0 0 2px rgba(255, 79, 65, 0.2)' : 'none',
                          '&:hover': {
                            borderColor: state.isFocused ? '#ff4f41' : '#e5e5e7'
                          }
                        }),
                        placeholder: (provided) => ({
                          ...provided,
                          color: '#666666'
                        }),
                        singleValue: (provided) => ({
                          ...provided,
                          display: 'flex',
                          alignItems: 'center'
                        })
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="province" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      Provincia/Estado *
                    </label>
                    <input 
                      type="text" 
                      id="province" 
                      value={formData.province}
                      onChange={(e) => handleInputChange('province', e.target.value)}
                      placeholder="Ingresa tu provincia o estado" 
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      Ciudad *
                    </label>
                    <input 
                      type="text" 
                      id="city" 
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Ej: Buenos Aires" 
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                    />
                  </div>
                </div>

                {/* Optional Fields */}
                <div className="bg-[#f8f8f8] rounded-xl p-6 border border-[#e5e5e7]">
                  <h3 className="text-lg font-semibold text-[#1c1c1e] mb-4 flex items-center">
                    <i className="fa-solid fa-info-circle text-[#666666] mr-2"></i>
                    Campos opcionales
                  </h3>
                  <p className="text-sm text-[#666666] mb-4">Podés completar estos datos ahora o al momento de crear tu tienda</p>
                  
                  <div className="space-y-4">
                    {/* CUIT/CUIL */}
                <div>
                  <label htmlFor="cuit" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    CUIT/CUIL (opcional)
                  </label>
                  <input 
                    type="text" 
                    id="cuit" 
                    value={formData.cuit}
                    onChange={(e) => handleInputChange('cuit', e.target.value)}
                    placeholder="Ej: 20-12345678-9" 
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                  />
                </div>
                    <div className="hidden">
                       <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                         Logo de la tienda (opcional) - Tamaño máximo: 10MB Recomendado: 200x200 píxeles
                       </label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-[#f8f8f8] rounded-lg border-2 border-dashed border-[#e5e5e7] flex items-center justify-center overflow-hidden">
                          {logoPreview ? (
                            <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <i className="fa-solid fa-image text-[#666666] text-xl"></i>
                          )}
                        </div>
                        <div className="flex-1">
                          <input 
                            ref={fileInputRef}
                            type="file" 
                            id="logo" 
                            accept="image/*" 
                            onChange={handleLogoChange}
                            className="hidden" 
                          />
                          <div className="flex flex-col">
                            <label 
                              htmlFor="logo" 
                              className="inline-flex items-center justify-center w-[158px] h-[42px] bg-white border border-[#e5e5e7] rounded-lg text-[#666666] hover:bg-[#f8f8f8] cursor-pointer transition-colors"
                            >
                              {isSubmitting ? (
                                <>
                                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                  Subiendo...
                                </>
                              ) : (
                                <>
                                  <i className="fa-solid fa-upload mr-2"></i>
                                  {formData.logo ? 'Cambiar imagen' : 'Subir imagen'}
                                </>
                              )}
                            </label>
                            {logoError && (
                              <p className="text-red-500 text-sm mt-1">{logoError}</p>
                            )}
                            {formData.logo && (
                              <p className="text-green-600 text-sm mt-1">
                                <i className="fa-solid fa-check mr-1"></i>
                                {formData.logo.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                     type="submit"
                     disabled={isSubmitting}
                     className="flex-1 h-12 bg-[#ff4f41] text-white rounded-lg font-medium hover:bg-[#e63e32] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20"
                   >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-check mr-2"></i>
                        Guardar y finalizar
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => navigate('/success')}
                    className="flex-1 h-12 bg-white border border-[#e5e5e7] text-[#666666] rounded-lg font-medium hover:bg-[#f8f8f8] transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20"
                  >
                    <i className="fa-solid fa-clock mr-2"></i>
                    Completar más tarde
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <FooterHome />
    </>
  );
}

export default DataSeller;