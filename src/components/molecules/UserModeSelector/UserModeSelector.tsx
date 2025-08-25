import React, { useState, useRef, useEffect } from 'react';
import { FaUser, FaStore, FaStar, FaChevronDown } from 'react-icons/fa';
import { useAuthStore } from '../../../stores';
import Toast from '../../atoms/Toast';
import ModeChangeModal from '../ModeChangeModal';

interface UserModeSelectorProps {
  className?: string;
}

const UserModeSelector: React.FC<UserModeSelectorProps> = ({ className = '' }) => {
  const { user, getCurrentUserMode, setCurrentUserMode } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingMode, setPendingMode] = useState<string | null>(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentMode = getCurrentUserMode();
  const availableModes = user?.userType || [];

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleModeChange = (mode: string) => {
    if (mode !== currentMode) {
      setPendingMode(mode);
      setShowModal(true);
    }
    setIsOpen(false);
  };

  const confirmModeChange = () => {
    if (pendingMode) {
      setCurrentUserMode(pendingMode);
      setToast({
        show: true,
        message: `Modo cambiado a ${getModeLabel(pendingMode)}`,
        type: 'success'
      });
    }
    setShowModal(false);
    setPendingMode(null);
  };

  const cancelModeChange = () => {
    setShowModal(false);
    setPendingMode(null);
  };

  // No mostrar el selector si el usuario no tiene tipos de usuario o solo tiene uno
  if (!availableModes.length || availableModes.length === 1) {
    return null;
  }

  const currentModeConfig = modeConfig[currentMode as keyof typeof modeConfig];

  return (
    <>
      <div className={`relative ${className}`} ref={dropdownRef}>
        <div 
          className="flex items-center cursor-pointer hover:text-red-500 transition-colors px-2 py-1 rounded-md hover:bg-gray-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">Modo actual:</span>
            <div className={`flex items-center space-x-1 ${currentModeConfig?.color || 'text-gray-700'}`}>
              {currentModeConfig?.icon}
              <span className="font-medium text-sm">
                {currentModeConfig?.label || currentMode}
              </span>
            </div>
            <FaChevronDown className={`text-xs transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200 z-50">
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
          </div>
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