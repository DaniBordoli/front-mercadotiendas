import React, { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { API_URL } from '../../../services/api';
import { useAuthStore } from '../../../stores';

interface AccountActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const AccountActivationModal: React.FC<AccountActivationModalProps> = ({
  isOpen,
  onClose,
  email
}) => {
  const [activationCode, setActivationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const { setToken, user } = useAuthStore();

  const handleActivation = async () => {
    if (!activationCode.trim()) {
      setError('Por favor ingresa el código de activación');
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

      // Si la activación es exitosa, actualizamos el token
      if (data.data?.token) {
        setToken(data.data.token);
      }
      
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al activar la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Activación de Cuenta">
      <div className="text-center">
        <p className="mb-4">
          Hemos enviado un código de activación a <strong>{email}</strong>. 
          Por favor, ingresa el código para activar tu cuenta.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            ¡Código reenviado con éxito!
          </div>
        )}

        <div className="mb-4">
          <input
            type="text"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value)}
            placeholder="Código de activación"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleActivation}
            disabled={isLoading}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Activando...' : 'Activar Cuenta'}
          </button>

          <button
            onClick={handleResendCode}
            disabled={resendLoading}
            className="text-sky-500 hover:text-sky-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Reenviando...' : 'Reenviar código'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
