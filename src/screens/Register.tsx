import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoTienda from '../public/assets/logoTienda.png';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { MdMailOutline, MdPersonOutline } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { DesignButton } from '../components/atoms/DesignButton';
import { useAuthStore } from '../stores'; 
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { fetchProvincesForArgentina } from '../stores/slices/authSlice';
import { fetchCountries } from '../stores/slices/authSlice'

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, clearError } = useAuthStore();
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    province: '',
    country: ''
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [provinces, setProvinces] = useState<string[]>([]);
  const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);

  useEffect(() => {
    if (values.country === 'Argentina') {
      fetchProvincesForArgentina()
        .then((data) => setProvinces(data))
        .catch((error) => console.error('Error fetching provinces:', error));
    } else {
      setProvinces([]);
    }
  }, [values.country]);

  useEffect(() => {
    fetchCountries()
      .then((data) => setCountries(data))
      .catch((error) => console.error('Error fetching countries:', error));
  }, []);

  const validateForm = (values: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!values.fullName?.trim()) {
      errors.fullName = 'Nombre completo es requerido';
    } else if (values.fullName.length < 3) {
      errors.fullName = 'El nombre completo debe tener al menos 3 caracteres';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email?.trim()) {
      errors.email = 'Email es requerido';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }
    if (!values.password) {
      errors.password = 'Contraseña es requerido';
    } else {
      const lengthValid = values.password.length >= 8;
      const uppercaseValid = /[A-Z]/.test(values.password);
      const lowercaseValid = /[a-z]/.test(values.password);
      const specialCharValid = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(values.password);
      
      if (!lengthValid || !uppercaseValid || !lowercaseValid || !specialCharValid) {
        errors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, y un carácter especial';
      }
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});
    const errors = validateForm(values);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    try {
      await register(values);
      navigate(`/activate-account?email=${encodeURIComponent(values.email)}`);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setValidationErrors((prev) => ({ ...prev, email: 'Este email ya está registrado' }));
      } else {
        console.error('Error durante el registro:', err);
      }
    }
  };

  return (
    <div className="bg-white h-screen flex flex-col items-center">
      <div className="mt-28 mr-20 flex items-center space-x-6">
        <img src={logoTienda} alt="Logo Tienda" className="w-32 h-32" />
        <div className="flex flex-col">
          <span className="font-bold text-4xl">Mercado Tiendas</span>
          <span
            className="font-space font-bold text-4xl tracking-[5px] mt-2"
            style={{ color: colors.primaryRed }}
          >
            Live shopping
          </span>
        </div>
      </div>
      <div className="mt-10 flex items-center space-x-10">
        <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/login')}>
          <span className="text-lg font-space">Iniciar sesión</span>
          <div
            className="w-[200px] h-0.5 mt-1"
            style={{ backgroundColor: colors.lightGray }}
          ></div>
        </div>
        <div className="flex flex-col items-center">
          <span style={{color: colors.primaryRed}} className="text-lg font-space">Crear cuenta</span>
          <div
            className="w-[200px] h-0.5 mt-1"
            style={{ backgroundColor: colors.primaryRed }}
          ></div>
        </div>
      </div>
      
      <form className="mt-10 w-full max-w-md px-4" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Nombre completo
          </label>
          <InputDefault
            type="text"
            placeholder="Ingresa tu nombre completo*"
            className="w-full"
            icon={<MdPersonOutline style={{ color: colors.mediumGray }} />}
            value={values.fullName}
            onChange={(value: string) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, fullName: '' }));
              setValues((prev) => ({ ...prev, fullName: value }));
            }}
          />
          {validationErrors.fullName && (
            <span className="text-red-500 text-sm">{validationErrors.fullName}</span>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Correo electrónico
          </label>
          <InputDefault
            type="email"
            placeholder="Ingresa tu Email*"
            className="w-full"
            icon={<MdMailOutline style={{ color: colors.mediumGray }} />}
            value={values.email}
            onChange={(value: string) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, email: '' }));
              setValues((prev) => ({ ...prev, email: value }));
            }}
          />
          {validationErrors.email && (
            <span className="text-red-500 text-sm">{validationErrors.email}</span>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            placeholder="Selecciona tu fecha de nacimiento"
            className="w-full border border-gray-300 rounded-md p-2"
            value={values.birthDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, birthDate: '' }));
              setValues((prev) => ({ ...prev, birthDate: e.target.value }));
            }}
          />
          {validationErrors.birthDate && (
            <span className="text-red-500 text-sm">{validationErrors.birthDate}</span>
          )}
        </div>
        
            <div className="mb-4">
              <label className="block mb-2 font-space text-darkGray">País</label>
              <select
                className="w-full border border-gray-300 rounded-md p-2"
                value={values.country}
                onChange={(e) => {
                  clearError();
                  setValidationErrors((prev) => ({ ...prev, country: '' }));
                  setValues((prev) => ({ ...prev, country: e.target.value }));
                }}
              >
                <option value="">Selecciona tu país</option>
                {countries.map((country, index) => (
                  <option key={index} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {validationErrors.country && (
                <span className="text-red-500 text-sm">{validationErrors.country}</span>
              )}
            </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Provincia
          </label>
          <select
            className="w-full border border-gray-300 rounded-md p-2"
            value={values.province}
            onChange={(e) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, province: '' }));
              setValues((prev) => ({ ...prev, province: e.target.value }));
            }}
            disabled={!values.country || provinces.length === 0}
          >
            <option value="">Selecciona tu provincia</option>
            {provinces.map((province, index) => (
              <option key={index} value={province}>
                {province}
              </option>
            ))}
          </select>
          {validationErrors.province && (
            <span className="text-red-500 text-sm">{validationErrors.province}</span>
          )}
        </div>
            
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Ciudad
          </label>
          <InputDefault
            type="text"
            placeholder="Ingresa tu ciudad"
            className="w-full"
            value={values.city}
            onChange={(value: string) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, city: '' }));
              setValues((prev) => ({ ...prev, city: value }));
            }}
          />
          {validationErrors.city && (
            <span className="text-red-500 text-sm">{validationErrors.city}</span>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Contraseña
          </label>
          <InputDefault
            type="password"
            placeholder="Crea una contraseña*"
            className="w-full"
            icon={<AiOutlineQuestionCircle style={{ color: colors.mediumGray }} />}
            value={values.password}
            onChange={(value: string) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, password: '' }));
              setValues((prev) => ({ ...prev, password: value }));
            }}
          />
          {validationErrors.password && (
            <span className="text-red-500 text-sm">{validationErrors.password}</span>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Confirmar contraseña
          </label>
          <InputDefault
            type="password"
            placeholder="Confirma tu contraseña*"
            className="w-full"
            icon={<AiOutlineQuestionCircle style={{ color: colors.mediumGray }} />}
            value={values.confirmPassword}
            onChange={(value: string) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
              setValues((prev) => ({ ...prev, confirmPassword: value }));
            }}
          />
          {validationErrors.confirmPassword && (
            <span className="text-red-500 text-sm">{validationErrors.confirmPassword}</span>
          )}
        </div>
        
        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            id="termsConditions"
            className="mr-2"
          />
          <label style={{color: colors.darkGray}} htmlFor="termsConditions" className="font-space text-sm">
            Acepto los <span style={{ color: colors.primaryRed }} className="cursor-pointer">términos y condiciones</span>
          </label>
        </div>
        
        <div className="mt-8">
          <DesignButton
            fullWidth={true}
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </DesignButton>
        </div>     
        
        <div className="flex justify-center my-8 font-space text-sm">
          <span style={{color: colors.mediumGray}}>¿Ya tenés cuenta?</span>
          <span 
            className="ml-1 cursor-pointer"
            style={{ color: colors.primaryRed }}
            onClick={() => navigate('/login')}
          >
            Iniciar sesión
          </span>
        </div>
      </form>
    </div>
  );
}

export default Register;