import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CenteredBox } from '../components/templates/CenteredBox';
import { FaStore } from 'react-icons/fa';
import { API_URL } from '../services/api';
import { useAuthStore } from '../stores';
import { Loading } from '../components/molecules/Loading';

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

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <CenteredBox height="520px">
      <div className="flex flex-col items-center mt-4">
        <div className="flex items-center mb-8">
          <span className="text-green-500 text-3xl mr-2">
            <FaStore size={28} color="skyblue" />
          </span>
          <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
        </div>

        <h2 className="text-2xl font-semibold mb-6">Activación de Cuenta</h2>
        <p className="text-center text-gray-600 text-sm mb-8">
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

        <div className="mb-4 w-full">
          <label htmlFor="activationCode" className="block text-sm font-medium text-gray-700 mb-1">
            Código de activación
          </label>
          <input
            id="activationCode"
            type="text"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            placeholder="Ingresa el código de 6 dígitos"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleActivation}
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Activando...
              </>
            ) : 'Activar Cuenta'}
          </button>

          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-sky-500 hover:text-sky-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {resendLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reenviando...
              </>
            ) : 'Reenviar código'}
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-600">
          ¿Ya tienes una cuenta activada?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-sky-500 hover:text-sky-600 font-medium"
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </CenteredBox>
  );
}

export default AccountActivation;
