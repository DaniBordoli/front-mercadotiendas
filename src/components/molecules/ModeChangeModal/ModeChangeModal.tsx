import React from 'react';
import { createPortal } from 'react-dom';
import { FaUser, FaStore, FaStar, FaCheckCircle } from 'react-icons/fa';

interface ModeChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: string;
  onConfirm: () => void;
}

const ModeChangeModal: React.FC<ModeChangeModalProps> = ({
  isOpen,
  onClose,
  selectedMode,
  onConfirm
}) => {
  if (!isOpen) return null;

  // Mapeo de tipos de usuario a configuración de display
  const modeConfig = {
    'comprador': {
      label: 'Comprador',
      icon: <FaUser className="text-4xl" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Explora y compra productos de diferentes tiendas'
    },
    'buyer': {
      label: 'Comprador', 
      icon: <FaUser className="text-4xl" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Explora y compra productos de diferentes tiendas'
    },
    'vendedor': {
      label: 'Vendedor',
      icon: <FaStore className="text-4xl" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Gestiona tu tienda y vende tus productos'
    },
    'seller': {
      label: 'Vendedor',
      icon: <FaStore className="text-4xl" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Gestiona tu tienda y vende tus productos'
    },
    'influencer': {
      label: 'Influencer',
      icon: <FaStar className="text-4xl" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Colabora con marcas y monetiza tu contenido'
    }
  };

  const config = modeConfig[selectedMode as keyof typeof modeConfig];

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Icono de éxito */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FaCheckCircle className="text-3xl text-green-600" />
          </div>
        </div>

        {/* Título */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          ¡Tu perfil está listo!
        </h2>

        {/* Descripción */}
        <p className="text-center text-gray-600 mb-6">
          Has cambiado exitosamente tu modo de usuario. Ahora puedes comenzar a usar todas las funciones disponibles.
        </p>

        {/* Modo seleccionado */}
        {config && (
          <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 mb-6`}>
            <div className="text-center">
              <div className={`${config.color} mb-3 flex justify-center`}>
                {config.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Modo: {config.label}
              </h3>
              <p className="text-sm text-gray-600">
                {config.description}
              </p>
            </div>
          </div>
        )}

        {/* Texto de roles activos */}
        <div className="text-center mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Tu rol activo</h4>
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              config?.color || 'text-gray-600'
            } ${config?.bgColor || 'bg-gray-100'}`}>
              {config?.label || selectedMode}
            </span>
          </div>
        </div>

        {/* Botones */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 bg-[#ff4f41] text-white rounded-lg hover:bg-[#ff4f41]/90 transition-colors font-medium"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModeChangeModal;