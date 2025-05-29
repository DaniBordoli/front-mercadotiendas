import React from 'react';
import { FaCheck } from 'react-icons/fa';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { useNavigate } from 'react-router-dom';

interface ProductSuccessModalProps {
  onClose: () => void;
  product: {
    nombre: string;
    sku: string;
    precio: string;
    estado: string;
    productImages?: string[];
  };
}

const ProductSuccessModal: React.FC<ProductSuccessModalProps> = ({ onClose, product }) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    navigate('/data-products');
    onClose();
  };

  const handleAddMore = () => {
    navigate('/new-product');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="font-space text-lg font-semibold mb-2">Producto cargado con éxito</h2>
        <div className="flex flex-col items-center my-4">
          <div className="w-14 h-14 rounded-full bg-[#E6FCF3] flex items-center justify-center mb-4">
            <FaCheck className="text-3xl" style={{ color: '#3DD598' }} />
          </div>
          <div className="font-space text-base font-semibold mb-1 text-center">
            ¡Tu producto ha sido creado correctamente!
          </div>
          <div className="text-gray-400 text-sm text-center mb-4">
            El producto ya está disponible en tu tienda y listo para ser vendido.
          </div>
        </div>
        <div className="flex items-center gap-3 bg-[#FAFBFC] border border-gray-100 rounded-xl px-4 py-3 mb-6">
          {product.productImages && product.productImages.length > 0 ? (
            <img
              src={product.productImages[0]}
              alt={product.nombre}
              className="w-12 h-12 object-cover rounded-md bg-gray-200"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-400 font-space">60 × 60</div>
          )}
          <div className="flex flex-col flex-1">
            <span className="font-space font-medium text-gray-800">{product.nombre}</span>
            <span className="text-xs text-gray-400 font-space">SKU: {product.sku}</span>
          </div>
          <span className="font-space text-sm text-gray-500">{product.precio}</span>
          <span className="ml-2 px-3 py-1 rounded-full bg-[#E6FCF3] text-xs font-space text-[#3DD598] font-semibold">{product.estado}</span>
        </div>
        <div className="flex gap-3 justify-between">
          <DesignButton variant="neutral" fullWidth onClick={handleViewProduct}>Ver producto</DesignButton>
          <DesignButton variant="primary" fullWidth onClick={handleAddMore}>Cargar más productos</DesignButton>
        </div>
      </div>
    </div>
  );
};

export default ProductSuccessModal;
