import React, { useState, useRef } from 'react';
import { uploadShopLogo } from '../../services/api';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

interface LogoUploaderProps {
  currentLogoUrl?: string;
  onLogoUpdate?: (logoUrl: string) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  currentLogoUrl = '/logo.png', 
  onLogoUpdate 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateEditableVariables = useFirstLayoutStore(state => state.updateEditableVariables);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('La imagen debe ser menor a 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await uploadShopLogo(file);
      
      if (response.data && response.data.logoUrl) {
        const logoUrl = response.data.logoUrl;
        
        // Actualizar el store de firstLayout para que se refleje inmediatamente
        updateEditableVariables({ logoUrl });
        
        // Callback para el componente padre si existe
        if (onLogoUpdate) {
          onLogoUpdate(logoUrl);
        }
        
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: any) {
      console.error('Error al subir logo:', err);
      setError(err.message || 'Error al subir el logo');
    } finally {
      setIsUploading(false);
      // Limpiar el input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center p-6 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Logo de la Tienda</h3>
      
      {/* Preview del logo actual */}
      <div className="mb-4">
        <img 
          src={currentLogoUrl} 
          alt="Logo actual" 
          className="w-24 h-24 object-contain border rounded-lg"
          onError={(e) => {
            e.currentTarget.src = '/logo.png';
          }}
        />
      </div>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Botón para subir */}
      <button
        onClick={handleUploadClick}
        disabled={isUploading}
        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
          isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isUploading ? 'Subiendo...' : 'Cambiar Logo'}
      </button>

      {/* Mensajes de estado */}
      {error && (
        <div className="mt-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-3 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Logo actualizado exitosamente
        </div>
      )}

      {/* Instrucciones */}
      <div className="mt-4 text-sm text-gray-600 text-center">
        <p>Formatos soportados: JPG, PNG, GIF</p>
        <p>Tamaño máximo: 10MB</p>
        <p>Recomendado: 200x200 píxeles</p>
      </div>
    </div>
  );
};

export default LogoUploader;
