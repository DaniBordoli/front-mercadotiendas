import React from 'react';
import { DesignButton } from '../components/atoms/DesignButton/DesignButton';
import { SelectDefault } from '../components/atoms/SelectDefault/SelectDefault';
import { FaTrash, FaStore, FaPlus, FaRegEdit, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { FaEye, FaPowerOff, FaRegFolderOpen, FaRegTrashCan, FaRegImages, FaArrowLeft } from 'react-icons/fa6';
import { colors } from '../design/colors';
import { RiPencilFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const categoriaOptions = [
  { value: '', label: 'Seleccionar' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
];
const estadoOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

const variantes = [
  {
    variante: 'Azul / M',
    sku: 'RB-001-AZM',
    stock: 11,
    precio: '$2.990',
    imagen: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
  },
  {
    variante: 'Negro / S',
    sku: 'RB-001-NES',
    stock: 10,
    precio: '$2.990',
    imagen: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d',
  },
];

const EditProductScreen: React.FC = () => {
  const [hasVariants, setHasVariants] = React.useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex">
      <DataSideBar />
      <div className="flex flex-col flex-grow ml-[250px]">
        {/* Header global: título, buscador y botón */}
        <div className="w-full flex items-center justify-between px-8 h-[80px] bg-white border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="Volver"
            >
              <FaArrowLeft className="text-gray-500" />
            </button>
            <h1 className="text-2xl font-space">Editar Producto</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="border border-gray-200 rounded-lg px-4 py-2 pl-10 w-64 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primaryRed"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base" />
            </div>
            <DesignButton variant="primary"
            icon={FaPlus}>Nuevo Producto</DesignButton>
          </div>
        </div>
      
        <hr className="border-gray-300" />
    
        <div className="w-full py-8 px-8">
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
       
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold font-space mb-1">Editar producto</h1>
                <span className="text-gray-400 text-sm font-space">#RB-001</span>
              </div>
              <div className="flex gap-3">
                <DesignButton variant="green"
                icon={FaEye}>
                  Ver en tienda
                </DesignButton>
                <DesignButton variant="secondary"
                icon={FaTrash}>
                  Eliminar producto
                </DesignButton>
              </div>
            </div>
        
            <div className="flex gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegFolderOpen style={{ color: colors.primaryRed, fontSize: 20 }} />
                  <span className="text-lg font-semibold font-space">Información básica</span>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Nombre del producto *</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" defaultValue="Remera básica unisex" />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">SKU *</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" defaultValue="RB-001" />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-space text-gray-500 mb-1">Descripción</label>
                  <textarea className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none min-h-[60px]" />
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Precio *</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" defaultValue="2700" />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Descuento</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" defaultValue="10" />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Stock *</label>
                    <input className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none" defaultValue="24" />
                  </div>
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Categoría *</label>
                    <SelectDefault options={categoriaOptions} value={''} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <label className="block text-xs font-space text-gray-500 mb-1">Estado *</label>
                    <SelectDefault options={estadoOptions} value={'activo'} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-space">¿Este producto tiene variantes?</span>
                  <button
                    type="button"
                    className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${hasVariants ? 'bg-sky-500' : 'bg-gray-200'}`}
                    onClick={() => setHasVariants((v) => !v)}
                    aria-pressed={hasVariants}
                  >
                    <motion.span
                      className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow"
                      animate={{ x: hasVariants ? 20 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  </button>
                </div>
           
                {hasVariants && (
                  <div className="mt-2">
                    <table className="min-w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-space text-xs">
                          <th className="px-4 py-3 font-normal text-left">Variante</th>
                          <th className="px-4 py-3 font-normal text-left">SKU</th>
                          <th className="px-4 py-3 font-normal text-left">Stock</th>
                          <th className="px-4 py-3 font-normal text-left">Precio</th>
                          <th className="px-4 py-3 font-normal text-left">Imagen</th>
                          <th className="px-4 py-3 font-normal text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {variantes.map((v, idx) => (
                          <tr key={v.sku} className="border-t last:border-b hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-space">{v.variante}</td>
                            <td className="px-4 py-3 text-gray-400 font-space">{v.sku}</td>
                            <td className="px-4 py-3 font-space">{v.stock}</td>
                            <td className="px-4 py-3 font-space">{v.precio}</td>
                            <td className="px-4 py-3">
                              <img src={v.imagen} alt="variante" className="w-10 h-10 rounded object-cover" />
                            </td>
                            <td className="px-4 py-3 flex items-center gap-2">
                              <button className="hover:bg-gray-100 p-2 rounded">
                                <RiPencilFill  className="text-lg text-blue-500" />
                              </button>
                              <button className="hover:bg-gray-100 p-2 rounded">
                                <FaRegTrashCan className="text-lg text-red-500" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className="flex items-center gap-2 text-sky-500 mt-2 text-sm font-space hover:underline">
                      <FaPlus />
                      Agregar variante
                    </button>
                  </div>
                )}
              </div>
          
              <div className="w-56">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegImages style={{ color: '#7C3AED', fontSize: 20 }} />
                  <span className="text-lg font-semibold font-space">Imágenes</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308" alt="img1" className="w-16 h-16 rounded object-cover" />
                    <button className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow">
                      <FaTrash className="text-xs text-red-500" />
                    </button>
                  </div>
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d" alt="img2" className="w-16 h-16 rounded object-cover" />
                    <button className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full p-1 shadow">
                      <FaTrash className="text-xs text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded cursor-pointer border border-dashed border-gray-300">
                    <FaPlus className="text-gray-400 text-lg" />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-space">Arrastrá para ordenar tus imágenes</span>
              </div>
            </div>
        
            <div className="flex items-center justify-end gap-3 mt-8">
              <DesignButton variant="neutral"
                icon={() => <FaPowerOff style={{ color: '#FFD600' }} />}
              >
                Desactivar
              </DesignButton>
              <DesignButton variant="neutral">
                Cancelar
              </DesignButton>
              <DesignButton variant="primary">
                Guardar cambios
              </DesignButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductScreen;
