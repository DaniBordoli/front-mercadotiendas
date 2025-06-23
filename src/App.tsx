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
  

  useEffect(() => {

    const initApp = async () => {
      

      if (token) {
        try {

          const loadedUser = await loadProfile();
          

          if (!loadedUser) {

          }
        } catch (error) {

        }
      }
      

      setIsInitialized(true);
    };
    
    initApp();
  }, [loadProfile, token]); // Solo dependemos de loadProfile y token

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