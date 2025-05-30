import React from 'react';
import { FaCloudUploadAlt, FaTrash, FaGripVertical } from 'react-icons/fa';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import Toast from '../../atoms/Toast';

interface ImageStepProps {
  onNext: () => void;
  productImages: (File | string)[];
  setProductImages: React.Dispatch<React.SetStateAction<(File | string)[]>>;
}

const ImageStep: React.FC<ImageStepProps> = ({ onNext, productImages, setProductImages }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [toast, setToast] = React.useState({
    show: false,
    message: '',
    type: 'error' as 'success' | 'error' | 'info',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setToast({
        show: true,
        message: 'Solo se permiten archivos de imagen',
        type: 'error',
      });
      return;
    }
  
    if (productImages.length + validFiles.length > 3) {
      setToast({
        show: true,
        message: 'Máximo 3 imágenes',
        type: 'error',
      });
      return;
    }
    setProductImages(prev => [...prev, ...validFiles]);
  };

  const handleRemoveImage = (idx: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full py-8 px-8">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <span className="font-space font-semibold text-lg mb-1 block">Imágenes del Producto</span>
        <span className="block text-sm text-gray-400 mb-4">
          Sube al menos una imagen para tu producto. Puedes subir hasta 8 imágenes.
        </span>
       
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center mb-6 relative" style={{ minHeight: 180 }}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#FFF3F2] flex items-center justify-center mb-2">
              <FaCloudUploadAlt className="text-3xl" style={{ color: '#FF4F41' }} />
            </div>
            <span className="font-space text-gray-500 text-sm">Arrastra y suelta tus imágenes aquí</span>
            <span className="text-xs text-gray-400">Formatos aceptados: JPG, PNG, WebP. Máximo 5MB por imagen.</span>
            <DesignButton variant="primary" className="mt-2" onClick={() => fileInputRef.current?.click()}>
              + Seleccionar Archivos
            </DesignButton>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
       
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-space text-gray-500">Imágenes Cargadas ({productImages.length})</span>
            <span className="text-xs text-gray-400 font-space">Arrastra para reordenar</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {productImages.map((img, idx) => (
              <div
                key={idx}
                className={`relative border-2 ${idx === 0 ? 'border-[#FF4F41]' : 'border-transparent'} rounded-xl w-32 h-32 flex flex-col items-center justify-center bg-gray-100`}
              >
                {typeof img === 'string' ? (
                  <img src={img} alt="preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover rounded-xl" />
                )}
                {idx === 0 && (
                  <span className="absolute bottom-0 left-0 right-0 text-xs font-space bg-[#FF4F41] text-white rounded-b-xl py-1 text-center">Principal</span>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button className="bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50 cursor-move" title="Arrastrar para reordenar">
                    <FaGripVertical className="text-gray-400 text-xs" />
                  </button>
                  <button className="bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50" onClick={() => handleRemoveImage(idx)} title="Eliminar imagen">
                    <FaTrash className="text-gray-400 text-xs" />
                  </button>
                </div>
              </div>
            ))}
            {productImages.length === 0 && (
              <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 font-space">
                600 × 600
              </div>
            )}
          </div>
        </div>
      
        <div className="flex justify-end mt-8">
          <DesignButton variant="primary" onClick={onNext} disabled={productImages.length === 0}>
            Siguiente paso
          </DesignButton>
        </div>
      </div>
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        duration={3000}
      />
    </div>
  );
};

export default ImageStep;
