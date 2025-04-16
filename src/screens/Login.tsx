import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import logoTienda from '../public/assets/logoTienda.png';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { MdMailOutline } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { PrimaryButton } from '../components/atoms/PrimaryButton/PrimaryButton';
import { NeutralButton } from '../components/atoms/NeutralButton/NeutralButton';
import { FaGoogle } from "react-icons/fa";
import { BsFacebook } from 'react-icons/bs';
import { Loading } from '../components/molecules/Loading';

function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useAuthRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({
      email,
      password
    });
  };

  const handleGoogleLogin = () => {
    clearError();
    loginWithGoogle();
  };

  const handleEmailChange = (value: string) => {
    clearError();
    setEmail(value);
  };

  const handlePasswordChange = (value: string) => {
    clearError();
    setPassword(value);
  };

  if (initialLoading) {
    return <Loading />;
  }

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
        <div className="flex flex-col items-center">
          <span style={{color: colors.primaryRed}} className="text-lg font-space">Iniciar sesión</span>
          <div
            className="w-[200px] h-0.5 mt-1"
            style={{ backgroundColor: colors.primaryRed }}
          ></div>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/register')}>
          <span className="text-lg font-space">Crear cuenta</span>
          <div
            className="w-[200px] h-0.5 mt-1"
            style={{ backgroundColor: colors.lightGray }}
          ></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md px-4">
        <div className="mb-4">
          <label className="block mb-2 font-space text-darkGray">
            Correo electrónico
          </label>
          <InputDefault
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="nombre@ejemplo.com"
            className='w-full'
            icon={<MdMailOutline style={{ color: colors.mediumGray }} />}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <div>
          <label className="block mb-2 font-space text-darkGray">
            Contraseña
          </label>
          <InputDefault
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="•••••••••"
            className='w-full'
            icon={<AiOutlineQuestionCircle style={{ color: colors.mediumGray }} />}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="keepLoggedIn"
              className="mr-2"
            />
            <label style={{color: colors.darkGray}} htmlFor="keepLoggedIn" className="font-space text-sm">
              Mantener sesión iniciada
            </label>
          </div>
          <span 
            className="font-space text-sm cursor-pointer"
            style={{ color: colors.primaryRed }}
            onClick={() => navigate('/reset-password')}
          >
            ¿Olvidaste tu contraseña?
          </span>
        </div>
        
        <div className="mt-8">
          <PrimaryButton 
            fullWidth={true}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </PrimaryButton>
        </div>
        
        <div className="flex items-center justify-center mt-8">
          <div 
            className="flex-1 h-0.5" 
            style={{ backgroundColor: colors.lightGray }}
          ></div>
          <span className="px-4 font-space text-sm" style={{ color: colors.mediumGray }}>
            O continúa con
          </span>
          <div 
            className="flex-1 h-0.5" 
            style={{ backgroundColor: colors.lightGray }}
          ></div>
        </div>
        
        <div className="flex justify-center space-x-4 mt-6">
          <div className="w-1/2">
            <NeutralButton 
              icon={FaGoogle}
              iconPosition="left"
              fullWidth={true}
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              Google
            </NeutralButton>
          </div>
          <div className="w-1/2">
            <NeutralButton 
              icon={BsFacebook}
              iconPosition="left"
              fullWidth={true}
              onClick={() => {}}
              disabled={isLoading}
            >
              Facebook
            </NeutralButton>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 font-space text-sm">
          <span style={{color: colors.mediumGray}}>¿No tenés cuenta?</span>
          <span 
            className="ml-1 cursor-pointer"
            style={{ color: colors.primaryRed }}
            onClick={() => navigate('/register')}
          >
            Registrate
          </span>
        </div>
      </form>
    </div>
  );
}

export default Login;
