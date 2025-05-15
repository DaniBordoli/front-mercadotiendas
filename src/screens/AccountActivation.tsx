import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../services/api';
import { useAuthStore } from '../stores';
import { Loading } from '../components/molecules/Loading';
import { colors } from '../design/colors';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import { DesignButton } from '../components/atoms/DesignButton';
import { FaKey } from 'react-icons/fa';

function AccountActivation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, user, isAuthenticated } = useAuthStore();
  const [activationCode, setActivationCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const emailParam = searchParams.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (location.state?.email) {
      setEmail(location.state.email);
    } else if (user?.email) {
      setEmail(user.email);
    }
    
    const timer = setTimeout(() => setInitialLoading(false), 900);
    return () => clearTimeout(timer);
  }, [location, user]);

  useEffect(() => {
    if (isAuthenticated && user?.isActivated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const handleActivation = async () => {
    if (!activationCode.trim()) {
      setError('Por favor ingresa el código de activación');
      return;
    }

    if (!email) {
      setError('No se pudo determinar el email para la activación');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/activate-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          activationCode 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al activar la cuenta');
      }

      if (data.data?.token && data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user));
        setToken(data.data.token);
        navigate('/dashboard');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al activar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('No se pudo determinar el email para reenviar el código');
      return;
    }

    setResendLoading(true);
    setResendSuccess(false);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/auth/resend-activation-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al reenviar el código');
      }

      setResendSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al reenviar el código');
    } finally {
      setResendLoading(false);
    }
  };

  const handleActivationCodeChange = (value: string) => {
    setError(null);
    setActivationCode(value);
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
            Activación de Cuenta
          </h2>
          
          <p className="mb-6 font-space text-sm" style={{ color: colors.mediumGray }}>
            Hemos enviado un código de activación a <strong>{email || 'tu correo'}</strong>. 
            Por favor, ingresa el código para activar tu cuenta.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm w-full">
              {error}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm w-full">
              ¡Código reenviado con éxito!
            </div>
          )}

          <div className="mb-4">
            <label className="block mb-2 font-space text-darkGray">
              Código de activación
            </label>
            <InputDefault
              type="text"
              value={activationCode}
              onChange={handleActivationCodeChange}
              placeholder="Ingresa el código de 6 dígitos"
              className='w-full'
              icon={<FaKey style={{ color: colors.mediumGray }} />}
            />
          </div>

          <div className="mt-8">
            <DesignButton
              className='w-full'
              variant='primary'
              onClick={handleActivation}
              disabled={isLoading}
            >
              {isLoading ? "Activando..." : "Activar Cuenta"}
            </DesignButton>

            <div className="flex justify-center mt-4">
              <button
                onClick={handleResendCode}
                disabled={resendLoading}
                className="font-space text-sm"
                style={{ color: colors.primaryRed }}
              >
                {resendLoading ? "Reenviando..." : "Reenviar código"}
              </button>
            </div>
          </div>
          
          <div className="flex justify-center mt-8 font-space text-sm">
            <span style={{color: colors.mediumGray}}>¿Ya tienes una cuenta activada?</span>
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
}

export default AccountActivation;
