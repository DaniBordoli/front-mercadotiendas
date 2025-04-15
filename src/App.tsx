import React, { useEffect } from 'react';
import './index.css'; 
import { AppRouter } from './navigation';
import { useAuthStore } from './stores';

function App() {
  const loadProfile = useAuthStore(state => state.loadProfile);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return <AppRouter />;
}

export default App;