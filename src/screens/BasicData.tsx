import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { colors } from '../design/colors';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { Navbar } from '../components/organisms/Navbar';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { updateUserBasicData, validateBasicDataForm, getMaxBirthDate, getMinBirthDate, type BasicDataForm } from '../services/userService';
import { getCountryOptions, getCountryByCode, getCountryOptionLabel, type CountryOption } from '../utils/countriesLibrary';
import { useAuthStore } from '../stores';

interface FormErrors {
  fullName?: string;
  country?: string;
  province?: string;
  city?: string;
  birthDate?: string;
}

function BasicData() {
  const navigate = useNavigate();
  const { user, loadProfile } = useAuthStore();
  const [formData, setFormData] = useState<BasicDataForm>({
    fullName: '',
    country: '',
    province: '',
    city: '',
    birthDate: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user) {
          setFormData({
            fullName: user.name || '',
            country: user.country || '',
            province: user.province || '',
            city: user.city || '',
            birthDate: user.birthDate ? user.birthDate.split('T')[0] : ''
          });
          
          // Establecer país seleccionado si existe
          if (user.country) {
            const selectedCountryOption = getCountryByCode(user.country);
            setSelectedCountry(selectedCountryOption || null);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    
    loadUserData();
  }, [user]);

  const handleInputChange = (field: keyof BasicDataForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleCountryChange = (selectedOption: CountryOption | null) => {
    setSelectedCountry(selectedOption);
    
    if (selectedOption) {
      handleInputChange('country', selectedOption.value);
    } else {
      handleInputChange('country', '');
    }
  };



  const handleContinue = async () => {
    // Validar formulario
    const validationErrors = validateBasicDataForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      await updateUserBasicData(formData);
      // Actualizar el perfil del usuario en el store
      await loadProfile();
      // Redirigir al siguiente paso del registro
      navigate('/register-data');
    } catch (error) {
      console.error('Error updating basic data:', error);
      setErrors({ fullName: 'Error al guardar los datos. Inténtalo de nuevo.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteLater = () => {
    // Navegar a register-data sin guardar los datos
    navigate('/register-data');
  };

  return (
    <>
      <div className="bg-[#f8f8f8] min-h-screen font-sans flex flex-col">
        <Navbar />
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center" style={{paddingTop: '20px', paddingBottom: '50px'}}>
          <div className="max-w-4xl mx-auto px-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#ff4f41] rounded-full flex items-center justify-center text-white font-semibold">1</div>
                  <div className="w-16 h-1 bg-[#ff4f41] mx-2"></div>
                  <div className="w-10 h-10 bg-[#e5e5e7] rounded-full flex items-center justify-center text-[#666666] font-semibold">2</div>
                  <div className="w-16 h-1 bg-[#e5e5e7] mx-2"></div>
                  <div className="w-10 h-10 bg-[#e5e5e7] rounded-full flex items-center justify-center text-[#666666] font-semibold">3</div>
                </div>
              </div>
              <p className="text-center text-[#666666]">Paso 1 de 3</p>
            </div>

            {/* Step 1: Basic Data */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Datos básicos</h1>
                <p className="text-[#666666] text-lg">Completá tu información personal para personalizar tu experiencia</p>
              </div>

              <form className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1c1c1e] mb-2">Nombre completo *</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full h-12 px-4 bg-white rounded-lg border text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41] ${
                      errors.fullName ? 'border-red-500' : 'border-[#e5e5e7]'
                    }`}
                    placeholder="Tu nombre y apellido"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-semibold text-[#1c1c1e] mb-2">País *</label>
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
                        border: errors.country ? '1px solid #ef4444' : '1px solid #e5e5e7',
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
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                  )}
                </div>

                {/* State/Province */}
                <div>
                  <label className="block text-sm font-semibold text-[#1c1c1e] mb-2">Provincia/Estado *</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => handleInputChange('province', e.target.value)}
                    className={`w-full h-12 px-4 bg-white rounded-lg border text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41] ${
                      errors.province ? 'border-red-500' : 'border-[#e5e5e7]'
                    }`}
                    placeholder="Ingresa tu provincia o estado"
                  />
                  {errors.province && (
                    <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-semibold text-[#1c1c1e] mb-2">Ciudad *</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full h-12 px-4 bg-white rounded-lg border text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41] ${
                      errors.city ? 'border-red-500' : 'border-[#e5e5e7]'
                    }`}
                    placeholder="Tu ciudad"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-semibold text-[#1c1c1e] mb-2">Fecha de nacimiento *</label>
                  <input 
                    type="date" 
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    min={getMinBirthDate()}
                    max={getMaxBirthDate()}
                    className={`w-full h-12 px-4 bg-white rounded-lg border text-[#1c1c1e] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41] ${
                      errors.birthDate ? 'border-red-500' : 'border-[#e5e5e7]'
                    }`}
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.birthDate}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button 
                    type="button" 
                    onClick={handleContinue}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-[#ff4f41] text-white font-semibold rounded-lg hover:bg-[#ff4f41]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      'Continuar'
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCompleteLater}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-white border border-[#e5e5e7] text-[#666666] font-medium rounded-lg hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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

export default BasicData;