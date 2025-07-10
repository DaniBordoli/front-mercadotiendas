import React, { useEffect, useState } from 'react';
import './index.css'; 
import { AppRouter } from './navigation';
import { useAuthStore } from './stores';

function App() {
  // Estado local para controlar si la inicialización ha terminado
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Obtener funciones y estado del store de autenticación
  const loadProfile = useAuthStore(state => state.loadProfile);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const setToken = useAuthStore(state => state.setToken);
  const setUser = useAuthStore(state => state.setUser);

  // Efecto de rehidratación forzada al montar la app
  useEffect(() => {
    const localToken = localStorage.getItem('mercadotiendas_token');
    const localUser = localStorage.getItem('mercadotiendas_user');
    if (localToken) {
      setToken(localToken);
      console.log('[App] Token rehidratado desde localStorage.');
      setTimeout(() => {
        console.log('[App] Token tras setToken:', useAuthStore.getState().token);
      }, 100);
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
  }, [setToken, setUser]);

  // Cuando el token esté en el store, llama a loadProfile
  useEffect(() => {
    if (token) {
      loadProfile().then((user) => {
        if (user) {
          console.log('[App] Perfil cargado tras rehidratación (efecto dependiente de token, robusto).');
        } else {
          console.warn('[App] No se pudo cargar el perfil tras rehidratación (efecto dependiente de token, robusto).');
        }
      });
    }
  }, [token, loadProfile]);

  useEffect(() => {
    const initApp = async () => {
      // Refuerzo: leer token directamente de localStorage si el store no lo tiene
      let effectiveToken = token;
      if (!effectiveToken) {
        effectiveToken = localStorage.getItem('mercadotiendas_token');
        if (effectiveToken) {
          // Actualizar el store con el token recuperado
          // @ts-ignore
          if (typeof useAuthStore.getState().setToken === 'function') {
            useAuthStore.getState().setToken(effectiveToken);
            console.log('[App] Token recuperado de localStorage y puesto en el store.');
          }
        }
      }
      if (effectiveToken) {
        try {
          console.log('[App] Intentando cargar perfil con token:', effectiveToken.substring(0, 10) + '...');
          const loadedUser = await loadProfile();
          if (!loadedUser) {
            console.warn('[App] No se pudo cargar el perfil del usuario.');
          }
        } catch (error) {
          console.error('[App] Error al cargar perfil:', error);
        }
      }
      setIsInitialized(true);
    };
    initApp();
  }, [loadProfile, token]);

  // Mostrar un indicador de carga mientras se inicializa la aplicación
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Una vez inicializado, renderizar el AppRouter
  return <AppRouter />;
}

export default App;