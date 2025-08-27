import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaStore, FaStar, FaChevronDown } from 'react-icons/fa';
import { useAuthStore } from '../../../stores';
import Toast from '../../atoms/Toast';
import ModeChangeModal from '../ModeChangeModal';

interface UserModeSelectorProps {
  className?: string;
}

const UserModeSelector: React.FC<UserModeSelectorProps> = ({ className = '' }) => {
  const { user, isAuthenticated, getCurrentUserMode, setCurrentUserMode } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<{top:number,left:number}>({top:0,left:0});
  const [showModal, setShowModal] = useState(false);
  const [pendingMode, setPendingMode] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  const currentMode = getCurrentUserMode();
  // Usar únicamente los modos que el usuario eligió al registrarse
  const availableModes = (user?.userType && user.userType.length > 0)
    ? user.userType.map((t: string) => {
        // normalizar posibles valores en inglés ↔ español
        if (t === 'buyer') return 'comprador';
        if (t === 'seller') return 'vendedor';
        return t; // influencer / comprador / vendedor
      })
    : [];
  
  console.log('[UserModeSelector] Usuario actual:', user);
  console.log('[UserModeSelector] Modo actual:', currentMode);
  console.log('[UserModeSelector] Modos disponibles:', availableModes);
  console.log('[UserModeSelector] Cantidad de modos:', availableModes.length);

  // Mapeo de tipos de usuario a configuración de display
  const modeConfig = {
    'comprador': {
      label: 'Comprador',
      icon: <FaUser className="text-sm" />,
      color: 'text-blue-600'
    },
    'buyer': {
      label: 'Comprador', 
      icon: <FaUser className="text-sm" />,
      color: 'text-blue-600'
    },
    'vendedor': {
      label: 'Vendedor',
      icon: <FaStore className="text-sm" />,
      color: 'text-green-600'
    },
    'seller': {
      label: 'Vendedor',
      icon: <FaStore className="text-sm" />,
      color: 'text-green-600'
    },
    'influencer': {
      label: 'Influencer',
      icon: <FaStar className="text-sm" />,
      color: 'text-purple-600'
    }
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        portalRef.current && !portalRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getModeLabel = (mode: string) => {
    return modeConfig[mode as keyof typeof modeConfig]?.label || mode;
  };

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + window.scrollY, left: rect.right + window.scrollX - 240 }); // 240 = w-60
    }
    setIsOpen(!isOpen);
  };

  const handleModeChange = (mode: string) => {
    if (mode !== currentMode) {
      setPendingMode(mode);
      setShowModal(true);
    }
    setIsOpen(false);
  };

  const confirmModeChange = () => {
    if (pendingMode) {
      console.log('[UserModeSelector] Cambiando modo a:', pendingMode);
      console.log('[UserModeSelector] Modo actual antes del cambio:', currentMode);
      
      setCurrentUserMode(pendingMode);
      
      console.log('[UserModeSelector] setCurrentUserMode ejecutado');
      
      setToast({
        show: true,
        message: `Modo cambiado a ${getModeLabel(pendingMode)}`,
        type: 'success'
      });
      
      // Redireccionar según el modo seleccionado
      if (pendingMode === 'comprador') {
        console.log('[UserModeSelector] Redirigiendo a /homebuyer');
        navigate('/homebuyer');
      } else if (pendingMode === 'vendedor' || pendingMode === 'influencer') {
        console.log('[UserModeSelector] Redirigiendo a /dashboard');
        navigate('/dashboard');
      }
    }
    setShowModal(false);
    setPendingMode(null);
  };

  const cancelModeChange = () => {
    setShowModal(false);
    setPendingMode(null);
  };

  // Mostrar el selector únicamente cuando el usuario esté autenticado, activado y con roles válidos
  if (!isAuthenticated || !user || !user.userType || user.userType.length === 0) {
    console.log('[UserModeSelector] No se muestra el selector - condiciones no cumplidas');
    return null;
  }
  
  console.log('[UserModeSelector] Mostrando selector de modo');

  const currentModeConfig = modeConfig[currentMode as keyof typeof modeConfig];

  return (
    <>
      <div className={`relative ${className}`} ref={dropdownRef}>
        <div 
          className="flex items-center cursor-pointer hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
          onClick={toggleDropdown}
        >
          <div className="flex items-center space-x-2">

            <div className={`flex items-center space-x-1 ${currentModeConfig?.color || 'text-gray-700'}`}>
              {currentModeConfig?.icon}
              <span className="font-medium text-sm whitespace-nowrap">
                {currentModeConfig?.label || currentMode}
              </span>
            </div>
            <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && createPortal(
          <div ref={portalRef} className="fixed w-60 bg-white shadow-lg rounded-md border border-gray-200 z-[200]" style={{ top: dropdownPos.top, left: dropdownPos.left }} onClick={(e) => e.stopPropagation()}>
            <div className="py-1">
              <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
                Cambiar modo
              </div>
              {availableModes.map((mode) => {
                const config = modeConfig[mode as keyof typeof modeConfig];
                const isActive = mode === currentMode;
                
                return (
                  <button
                    key={mode}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2 transition-colors ${
                      isActive ? 'bg-red-50 text-red-600' : 'text-gray-700'
                    }`}
                    onClick={() => handleModeChange(mode)}
                    disabled={isActive}
                  >
                    <span className={config?.color || 'text-gray-600'}>
                      {config?.icon}
                    </span>
                    <span className="text-sm">
                      {config?.label || mode}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-xs text-red-500">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
      </div>

      {/* Modal de confirmación */}
      <ModeChangeModal
        isOpen={showModal}
        onClose={cancelModeChange}
        selectedMode={pendingMode || ''}
        onConfirm={confirmModeChange}
      />
      
      {/* Toast notification */}
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        duration={3000}
      />
    </>
  );
};

export default UserModeSelector;