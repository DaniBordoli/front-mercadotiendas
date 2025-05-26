import React from 'react';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { SelectDefault } from '../../atoms/SelectDefault/SelectDefault';
import { motion } from 'framer-motion';

const variant1Options = [
  { value: 'color', label: 'Color' },
  { value: 'talle', label: 'Talle' },
  { value: 'tamaño', label: 'Tamaño' },
];
const variant2Options = [
  { value: '', label: 'Seleccionar... (talle, tamaños, etc)' },
  { value: 'talle', label: 'Talle' },
  { value: 'tamaño', label: 'Tamaño' },
];

const VariantsStep: React.FC = () => {
  const [hasVariants, setHasVariants] = React.useState(true);

  return (
    <div className="w-full py-8 px-8">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <span className="font-space font-semibold text-lg mb-1 block">Variantes del Producto</span>
        <span className="block text-sm text-gray-400 mb-4">
          Sube al menos una variante para tu producto.
        </span>
        <div className="flex items-center justify-between mb-4">
          <span className="font-space text-base font-medium">
            Variantes del producto: Reloj de Cuero Clásico
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-space text-green-600 font-semibold">Activo</span>
            <span className="text-xs font-space text-gray-400">SKU base: RL-001</span>
          </div>
        </div>
   
        <div className="flex items-center gap-4 mb-6">
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
          <div>
            <span className="font-space font-medium text-sm text-gray-700">Este producto tiene variantes</span>
            <div className="text-xs text-gray-400 font-space">
              Activa esta opción para gestionar variantes como color, talle, etc.
            </div>
          </div>
        </div>
  
        <div className="mb-6">
          <span className="font-space text-sm font-semibold block mb-2">Tipos de variantes</span>
          <span className="block text-xs text-gray-400 mb-4">
            Selecciona o crea los tipos de variantes para este producto
          </span>
          <div className="flex flex-col gap-4 mb-4">
            <div>
              <label className="block text-xs font-space text-gray-500 mb-1">Variante 1</label>
              <SelectDefault options={variant1Options} value={'color'} />
            </div>
            <div>
              <label className="block text-xs font-space text-gray-500 mb-1">Variante 2 (opcional)</label>
              <SelectDefault options={variant2Options} value={''} />
            </div>
          </div>
        </div>
      
        <div className="mb-2">
          <span className="block text-xs font-space text-gray-500 mb-2">Valores para Color</span>
          <div className="flex gap-2 flex-wrap">
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-space">
              <span className="w-4 h-4 rounded-full bg-black inline-block" />
              Negro
              <button className="ml-1 text-gray-400 hover:text-gray-600 text-xs">&times;</button>
            </span>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-space">
              <span className="w-4 h-4 rounded-full" style={{ background: '#8B5C2A' }} />
              Marrón
              <button className="ml-1 text-gray-400 hover:text-gray-600 text-xs">&times;</button>
            </span>
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-space">
              <span className="w-4 h-4 rounded-full bg-gray-300 inline-block" />
              Plata
              <button className="ml-1 text-gray-400 hover:text-gray-600 text-xs">&times;</button>
            </span>
            <button className="ml-2 text-sky-600 text-xs font-space hover:underline">+ Agregar valor</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariantsStep;
