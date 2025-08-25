import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { MdMailOutline, MdPersonOutline } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { DesignButton } from '../components/atoms/DesignButton';
import { useAuthStore } from '../stores'; 
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { Navbar } from '../components/organisms/Navbar';
import FullScreenLoader from '../components/molecules/FullScreenLoader';
import FooterHome from '../components/organisms/FooterHome/FooterHome';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, clearError } = useAuthStore();
  const [values, setValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (values: any): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email?.trim()) {
      errors.email = 'Email es requerido';
    } else if (!emailRegex.test(values.email)) {
      errors.email = 'Por favor ingresa un email válido';
    }
    
    if (!values.password) {
      errors.password = 'Contraseña es requerida';
    } else if (values.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Por favor confirma tu contraseña';
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!values.acceptTerms) {
      errors.acceptTerms = 'Debes aceptar los términos y condiciones';
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
      // Solo enviamos email y password al backend
      const registrationData = {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      };
      await register(registrationData);
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
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {isLoading && <FullScreenLoader />}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-0" style={{paddingTop: '10px', paddingBottom: '20px'}}>
      <div className="rounded-[2.0rem] border border-gray-200 shadow bg-white px-4 py-6 md:px-8 md:py-10 flex flex-col items-center w-full max-w-lg">
        <div className="flex items-center justify-center w-full">
          <img src="/logonuevoalto.png" alt="MercadoTiendas Logo" className="w-32 md:w-48 h-auto" />
        </div>
        <div className="mt-4 md:mt-6 flex items-center space-x-6 md:space-x-10">
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/login')}>
            <span className="text-sm md:text-lg font-space">Iniciar sesión</span>
            <div
              className="w-[120px] md:w-[200px] h-0.5 mt-1"
              style={{ backgroundColor: colors.lightGray }}
            ></div>
          </div>
          <div className="flex flex-col items-center">
            <span style={{color: colors.primaryRed}} className="text-sm md:text-lg font-space">Crear cuenta</span>
            <div
              className="w-[120px] md:w-[200px] h-0.5 mt-1"
              style={{ backgroundColor: colors.primaryRed }}
            ></div>
          </div>
        </div>
        
        <form className="mt-6 md:mt-10 w-full max-w-md px-2 md:px-4" onSubmit={handleSubmit}>
          <div className="mb-3 md:mb-4">
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
        
        <div className="mb-3 md:mb-4">
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
        
        <div className="mb-3 md:mb-4">
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
            checked={values.acceptTerms}
            onChange={(e) => {
              clearError();
              setValidationErrors((prev) => ({ ...prev, acceptTerms: '' }));
              setValues((prev) => ({ ...prev, acceptTerms: e.target.checked }));
            }}
          />
          <label style={{color: colors.darkGray}} htmlFor="termsConditions" className="font-space text-sm">
            Acepto los <span style={{ color: colors.primaryRed }} className="cursor-pointer">términos y condiciones</span>
          </label>
        </div>
        {validationErrors.acceptTerms && (
          <span className="text-red-500 text-sm mt-1 block">{validationErrors.acceptTerms}</span>
        )}
        
        <div className="mt-4 md:mt-8">
          <DesignButton
           className='w-full'
            variant="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </DesignButton>
        </div>
        
        <div className="flex justify-center mt-4 md:mt-6 font-space text-xs md:text-sm">
          <span style={{color: colors.mediumGray}}>¿Ya tienes cuenta?</span>
          <span 
            className="ml-1 cursor-pointer"
            style={{ color: colors.primaryRed }}
            onClick={() => navigate('/login')}
          >
            Inicia sesión
          </span>
        </div>
      </form>
      </div>
      </div>
      <FooterHome />
    </div>
  );
}

export default Register;