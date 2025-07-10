import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePaymentStore } from '../stores/paymentStore';
import { useAuthStore } from '../stores/slices/authSlice';
import { FaCheckCircle, FaTimesCircle, FaClock, FaSpinner } from 'react-icons/fa';

interface PaymentStatus {
  status: string;
  type: string;
  transactionId: string;
  message: string;
  success: boolean;
}

const PaymentReturn: React.FC = () => {
  console.log('[PaymentReturn] Componente montado');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkPaymentStatus, isLoading } = usePaymentStore();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const loadProfile = useAuthStore(state => state.loadProfile);

  // Fix automático para HTTPS -> HTTP en localhost
  // useEffect(() => {
  //   const currentUrl = window.location.href;
  //   if (currentUrl.startsWith('https://localhost:')) {
  //     console.log('=== PAYMENT RETURN: Detectado HTTPS en localhost, redirigiendo a HTTP ===');
  //     const correctedUrl = currentUrl.replace('https://localhost:', 'http://localhost:');
  //     console.log('URL original:', currentUrl);
  //     console.log('URL corregida:', correctedUrl);
  //     window.location.replace(correctedUrl);
  //     return;
  //   }
  // }, []);

  useEffect(() => {
    // Rehidratación de sesión: si hay token en localStorage, forzar validación
    const localToken = localStorage.getItem('mercadotiendas_token');
    console.log('[PaymentReturn] Intentando rehidratar sesión. Token en localStorage:', localToken);
    if (localToken) {
      loadProfile().then((user) => {
        if (user) {
          console.log('[PaymentReturn] Sesión rehidratada tras volver de Mobbex.');
        } else {
          console.warn('[PaymentReturn] No se pudo rehidratar la sesión tras volver de Mobbex.');
        }
      });
    }
  }, [loadProfile]);

  useEffect(() => {
    const processPaymentReturn = async () => {
      console.log('=== PAYMENT RETURN: Procesando retorno de pago ===');
      
      // Obtener parámetros de la URL
      const status = searchParams.get('status');
      const type = searchParams.get('type');
      const transactionId = searchParams.get('transactionId');

      // Si estamos en un popup, enviar los datos a la ventana principal y cerrar
      if (window.opener && status && transactionId) {
        window.opener.postMessage({
          source: 'mobbex-payment',
          status,
          type,
          transactionId
        }, '*'); // Cambiar '*' por el origen esperado en producción
        window.close();
        return;
      }

      console.log('Parámetros recibidos de Mobbex:');
      console.log('- Status:', status);
      console.log('- Type:', type);
      console.log('- TransactionId:', transactionId);

      if (!status || !transactionId) {
        console.error('Parámetros faltantes en el retorno de pago');
        setPaymentStatus({
          status: 'error',
          type: type || 'unknown',
          transactionId: transactionId || 'unknown',
          message: 'Parámetros de pago inválidos',
          success: false
        });
        setIsProcessing(false);
        return;
      }

      try {
        // Interpretar el status de Mobbex
        let paymentResult: PaymentStatus;
        
        switch (status) {
          case '2': // Pago aprobado
          case '200': // Pago aprobado
            paymentResult = {
              status: 'approved',
              type: type || 'unknown',
              transactionId,
              message: 'Tu pago ha sido procesado exitosamente',
              success: true
            };
            break;
          case '0': // Pago pendiente
          case '1': // Pago pendiente
            paymentResult = {
              status: 'pending',
              type: type || 'unknown',
              transactionId,
              message: 'Tu pago está siendo procesado',
              success: false
            };
            break;
          case '3': // Pago rechazado
          case '4': // Pago cancelado
          case '400': // Error
            paymentResult = {
              status: 'rejected',
              type: type || 'unknown',
              transactionId,
              message: 'Tu pago ha sido rechazado o cancelado',
              success: false
            };
            break;
          default:
            paymentResult = {
              status: 'unknown',
              type: type || 'unknown',
              transactionId,
              message: 'Estado de pago desconocido',
              success: false
            };
        }

        console.log('Estado de pago interpretado:', paymentResult);
        setPaymentStatus(paymentResult);

        // Opcional: Verificar el estado del pago en el backend
        if (transactionId) {
          try {
            console.log('Verificando estado del pago en el backend...');
            const backendStatus = await checkPaymentStatus(transactionId);
            console.log('Estado del backend:', backendStatus);
          } catch (error) {
            console.error('Error al verificar estado en backend:', error);
            // No afectar el resultado si el backend falla
          }
        }

      } catch (error) {
        console.error('Error procesando retorno de pago:', error);
        setPaymentStatus({
          status: 'error',
          type: type || 'unknown',
          transactionId: transactionId || 'unknown',
          message: 'Error al procesar el resultado del pago',
          success: false
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentReturn();
  }, [searchParams, checkPaymentStatus]);

  const getStatusIcon = () => {
    if (isProcessing) return <FaSpinner className="animate-spin text-4xl text-blue-500" />;
    
    switch (paymentStatus?.status) {
      case 'approved':
        return <FaCheckCircle className="text-4xl text-green-500" />;
      case 'pending':
        return <FaClock className="text-4xl text-yellow-500" />;
      case 'rejected':
      case 'error':
        return <FaTimesCircle className="text-4xl text-red-500" />;
      default:
        return <FaTimesCircle className="text-4xl text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (paymentStatus?.status) {
      case 'approved':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'rejected':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBackgroundColor = () => {
    switch (paymentStatus?.status) {
      case 'approved':
        return 'bg-green-50 border-green-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
      case 'rejected':
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleContinue = () => {
    if (paymentStatus?.success) {
      // Redirigir a página de éxito o dashboard
      navigate('/dashboard');
    } else {
      // Redirigir al carrito o página de productos
      navigate('/cart-list');
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Procesando resultado del pago...
          </h2>
          <p className="text-gray-600">
            Por favor espera mientras verificamos tu pago
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className={`bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full mx-4 border-2 ${getBackgroundColor()}`}>
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {paymentStatus?.success ? '¡Pago Exitoso!' : 'Resultado del Pago'}
        </h1>
        
        <p className="text-gray-700 mb-6">
          {paymentStatus?.message}
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-2">Detalles de la transacción:</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">ID de transacción:</span> {paymentStatus?.transactionId}</p>
            <p><span className="font-medium">Tipo de pago:</span> {paymentStatus?.type}</p>
            <p><span className="font-medium">Estado:</span> {paymentStatus?.status}</p>
          </div>
        </div>
        
        <button
          onClick={handleContinue}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
            paymentStatus?.success 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {paymentStatus?.success ? 'Continuar' : 'Volver al carrito'}
        </button>
        
        {!paymentStatus?.success && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mt-3 py-2 px-6 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Ir al inicio
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;
