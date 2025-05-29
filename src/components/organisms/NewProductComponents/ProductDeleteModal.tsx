import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { colors } from '../../../design/colors';

interface ProductDeleteModalProps {
  onClose: () => void;
  onDelete: () => void;
  product: {
    nombre: string;
    sku: string;
    precio: string;
    estado: string;
    productImages?: string[];
  };
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({ onClose, onDelete, product }) => {
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
        <div className="flex flex-col items-center my-2">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
            style={{ background: `${colors.primaryRed}1A` }}
          >
            <FaTrash className="text-3xl" style={{ color: colors.primaryRed }} />
          </div>
          <div className="font-space text-base mb-1 text-center">
            ¿Estás seguro que deseas eliminar este producto?
          </div>
          <div className="text-gray-400 text-sm text-center mb-4">
            Esta acción no se puede deshacer. El producto será eliminado permanentemente de tu tienda.
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
          <span className="ml-2 px-3 py-1 rounded-full bg-[#FFF0EE] text-xs font-space" style={{ color: colors.primaryRed, fontWeight: 600 }}>
            {product.estado}
          </span>
        </div>
        <div className="flex gap-3 justify-between">
          <DesignButton variant="neutral" fullWidth onClick={onClose}>Cancelar</DesignButton>
          <DesignButton variant="primary" fullWidth onClick={onDelete} style={{ background: colors.primaryRed }}>
            Sí, eliminar
          </DesignButton>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteModal;
