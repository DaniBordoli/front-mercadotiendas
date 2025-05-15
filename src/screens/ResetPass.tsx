import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { MdMailOutline } from "react-icons/md";
import { Loading } from '../components/molecules/Loading';
import { DesignButton } from '../components/atoms/DesignButton';
import { forgotPassword } from '../stores/slices/authSlice';

const ResetPass = () => {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(''); 
      setIsLoading(true);
      await forgotPassword(email);
      setSuccess(true); 
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (value: string) => {
    setError('');
    setEmail(value);
  };

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-white h-screen flex flex-col items-center">
      <div className="rounded-[2.5rem] border border-gray-200 shadow-lg bg-white px-8 py-10 mt-4 flex flex-col items-center w-full max-w-lg">
        <div className="flex items-center justify-center w-full">
          <img src="/logoLogin/logoLogin.png" alt="Logo MercadoTiendas" className="w-60 h-auto" />
        </div>
        <div className="mt-6 w-full max-w-md px-4">
          <h2 className="text-2xl font-space font-bold mb-4" style={{ color: colors.darkGray }}>
            Recuperar contraseña
          </h2>
          
          {success ? (
            <div className="mt-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                ¡Correo enviado! Si el correo está en la base de datos, recibirás un correo con instrucciones para restablecer tu contraseña.
              </div>
              <DesignButton
                fullWidth={true}
                variant='primary'
                onClick={() => navigate('/login')}
              >
                Volver al inicio de sesión
              </DesignButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="mb-6 font-space text-sm" style={{ color: colors.mediumGray }}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
              
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
              
              <div className="mt-8">
                <DesignButton
                  fullWidth={true}
                  type="submit"
                  disabled={isLoading}
                  variant='primary'
                >
                  {isLoading ? "Enviando..." : "Enviar instrucciones"}
                </DesignButton>
              </div>
            </form>
          )}
          
          <div className="flex justify-center mt-8 font-space text-sm">
            <span style={{color: colors.mediumGray}}>¿Recordaste tu contraseña?</span>
            <span 
              className="ml-1 cursor-pointer"
              style={{ color: colors.primaryRed }}
              onClick={() => navigate('/login')}
            >
              Iniciar sesión
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;