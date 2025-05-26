import React from 'react';
import { FaCloudUploadAlt, FaTrash, FaGripVertical } from 'react-icons/fa';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';

interface ImageStepProps {
  onNext: () => void;
}

const ImageStep: React.FC<ImageStepProps> = ({ onNext }) => {
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
            <DesignButton variant="primary" className="mt-2">+ Seleccionar Archivos</DesignButton>
          </div>
        </div>
       
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-space text-gray-500">Imágenes Cargadas (5)</span>
            <span className="text-xs text-gray-400 font-space">Arrastra para reordenar</span>
          </div>
          <div className="flex gap-4">
           
            <div className="relative border-2 border-[#FF4F41] rounded-xl w-32 h-32 flex flex-col items-center justify-center bg-gray-100">
              <span className="text-gray-400 font-space text-lg">600 × 600</span>
              <span className="absolute bottom-0 left-0 right-0 text-xs font-space bg-[#FF4F41] text-white rounded-b-xl py-1 text-center">Principal</span>
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50">
                  <FaGripVertical className="text-gray-400 text-xs" />
                </button>
                <button className="bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50">
                  <FaTrash className="text-gray-400 text-xs" />
                </button>
              </div>
            </div>
           
            <div className="relative border-2 border-transparent rounded-xl w-32 h-32 flex flex-col items-center justify-center bg-gray-100">
              <span className="text-gray-400 font-space text-lg">600 × 600</span>
              <div className="absolute top-2 right-2 flex gap-1">
                <button className="bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50">
                  <FaGripVertical className="text-gray-400 text-xs" />
                </button>
                <button className="bg-white rounded-full p-1 border border-gray-200 shadow hover:bg-gray-50">
                  <FaTrash className="text-gray-400 text-xs" />
                </button>
              </div>
            </div>
       
            <div className="relative border-2 border-transparent rounded-xl w-32 h-32 flex flex-col items-center justify-center bg-gray-100">
             
            </div>
          </div>
        </div>
      
        <div className="flex justify-end mt-8">
          <DesignButton variant="primary" onClick={onNext}>
            Siguiente paso
          </DesignButton>
        </div>
      </div>
    </div>
  );
};

export default ImageStep;
