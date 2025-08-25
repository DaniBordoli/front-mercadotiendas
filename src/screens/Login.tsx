import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { MdMailOutline } from "react-icons/md";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";
import { BsFacebook } from 'react-icons/bs';
import { Loading } from '../components/molecules/Loading';
import { DesignButton } from '../components/atoms/DesignButton';
import FullScreenLoader from '../components/molecules/FullScreenLoader';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { Navbar } from '../components/organisms/Navbar/Navbar';
function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const [initialLoading, setInitialLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user'); // MT-30: Role selection for login
  // MT-30: TODO - Implement role-based authentication validation

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  useAuthRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // MT-30: Include selected role in login credentials
    await login({
      email,
      password,
      role: selectedRole
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
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />
      {isLoading && <FullScreenLoader />}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-0" style={{paddingTop: '10px', paddingBottom: '20px'}}>
        <div className="rounded-[2.0rem] border border-gray-200 shadow bg-white px-4 py-6 md:px-8 md:py-10 flex flex-col items-center w-full max-w-lg">
        <div className="flex items-center justify-center w-full">
          <img src="/logonuevoalto.png" alt="MercadoTiendas Logo" className="w-32 md:w-48 h-auto" />
        </div>
        <div className="mt-4 md:mt-6 flex items-center space-x-6 md:space-x-10">
          <div className="flex flex-col items-center">
            <span style={{color: colors.primaryRed}} className="text-lg font-space">Iniciar sesión</span>
            <div
              className="w-[120px] md:w-[200px] h-0.5 mt-1"
              style={{ backgroundColor: colors.primaryRed }}
            ></div>
          </div>
          <div className="flex flex-col items-center cursor-pointer" onClick={() => navigate('/register')}>
            <span className="text-sm md:text-lg font-space">Crear cuenta</span>
            <div
              className="w-[120px] md:w-[200px] h-0.5 mt-1"
              style={{ backgroundColor: colors.lightGray }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 md:mt-10 w-full max-w-md px-2 md:px-4">
          <div className="mb-3 md:mb-4">
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
          <div className="mb-3 md:mb-4">
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
          
          {/* MT-30: Role Selection Component */}
          <div className="mb-3 md:mb-4">
            <label className="block mb-2 font-space text-darkGray">
              Tipo de cuenta
            </label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={`flex-1 py-2 px-4 rounded-lg border font-space text-sm transition-colors ${
                  selectedRole === 'user'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Usuario
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex-1 py-2 px-4 rounded-lg border font-space text-sm transition-colors ${
                  selectedRole === 'admin'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Administrador
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-3 md:mt-4 space-y-2 md:space-y-0">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keepLoggedIn"
                className="mr-2"
              />
              <label style={{color: colors.darkGray}} htmlFor="keepLoggedIn" className="font-space text-xs md:text-sm">
                Mantener sesión iniciada
              </label>
            </div>
            <span 
              className="font-space text-xs md:text-sm cursor-pointer text-center md:text-left"
              style={{ color: colors.primaryRed }}
              onClick={() => navigate('/reset-password')}
            >
              ¿Olvidaste tu contraseña?
            </span>
          </div>
          
          <div className="mt-4 md:mt-8">
            <DesignButton
             className='w-full'
              type="submit"
              disabled={isLoading}
              variant='primary'
            >
              {isLoading ? "Cargando..." : "Iniciar sesión"}
            </DesignButton>
          </div>
          
          <div className="flex items-center justify-center mt-4 md:mt-8">
            <div 
              className="flex-1 h-0.5" 
              style={{ backgroundColor: colors.lightGray }}
            ></div>
            <span className="px-2 md:px-4 font-space text-xs md:text-sm" style={{ color: colors.mediumGray }}>
              O continúa con
            </span>
            <div 
              className="flex-1 h-0.5" 
              style={{ backgroundColor: colors.lightGray }}
            ></div>
          </div>
          
          <div className="flex justify-center space-x-2 md:space-x-4 mt-4 md:mt-6">
            <div className="w-1/2">
              <DesignButton 
              className='w-full'
              variant='neutral'
                icon={FaGoogle}
                iconPosition="left"
                fullWidth={true}
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                Google
              </DesignButton>
            </div>
            <div className="w-1/2">
              <DesignButton
              className='w-full'
              variant='neutral'
                icon={BsFacebook}
                iconPosition="left"
                fullWidth={true}
                onClick={() => {}}
                disabled={isLoading}
              >
                Facebook
              </DesignButton>
            </div>
          </div>
          
          <div className="flex justify-center mt-4 md:mt-8 font-space text-xs md:text-sm">
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
      </div>
      <FooterHome />
    </div>
  );
}

export default Login;
