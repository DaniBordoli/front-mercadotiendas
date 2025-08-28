import React, { useEffect, useState } from 'react';
import './index.css'; 
import { AppRouter } from './navigation';
import { useAuthStore } from './stores';

function App() {
  // Estado local para controlar si la inicialización ha terminado
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Obtener funciones y estado del store de autenticación
  const validateToken = useAuthStore(state => state.validateToken);
  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);
  const isValidating = useAuthStore(state => state.isValidating);
  const startPeriodicValidation = useAuthStore(state => state.startPeriodicValidation);

  // Efecto único de inicialización
  useEffect(() => {
    const initApp = async () => {
      try {
        // Rehidratar desde localStorage
        const localToken = localStorage.getItem('mercadotiendas_token');
        const localUser = localStorage.getItem('mercadotiendas_user');
        
        if (localToken) {
          setToken(localToken);
          console.log('[App] Token rehidratado desde localStorage.');
        }
        
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
            console.log('[App] Usuario rehidratado desde localStorage.');
          } catch (e) {
            setUser(null);
            console.warn('[App] Error al parsear usuario de localStorage.');
          }
        }
        
        // Validar token si existe
        if (localToken) {
          try {
            console.log('[App] Validando token:', localToken.substring(0, 10) + '...');
            const isValid = await validateToken();
            if (isValid) {
              console.log('[App] Token válido, usuario autenticado.');
              // Iniciar validación periódica para mantener la sesión activa
              startPeriodicValidation();
            } else {
              console.warn('[App] Token inválido, usuario no autenticado.');
            }
          } catch (error) {
            console.error('[App] Error al validar token:', error);
          }
        }
      } catch (error) {
        console.error('[App] Error durante la inicialización:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initApp();
  }, [validateToken, setToken, setUser, startPeriodicValidation]); // Solo se ejecuta una vez al montar

  // Mostrar un indicador de carga mientras se inicializa la aplicación o se valida el token
  if (!isInitialized || isValidating) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isValidating ? 'Validando autenticación...' : 'Cargando...'}
          </p>
        </div>
      </div>
    );
  }

  // Una vez inicializado, renderizar el AppRouter
  return <AppRouter />;
}

export default App;