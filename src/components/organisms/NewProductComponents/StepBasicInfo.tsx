import React from 'react';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { SelectDefault } from '../../atoms/SelectDefault/SelectDefault';

const categoriaOptions = [
  { value: '', label: 'Seleccionar categoría' },
  { value: 'accesorios', label: 'Accesorios' },
  { value: 'calzado', label: 'Calzado' },
];
const subcategoriaOptions = [
  { value: '', label: 'Seleccionar subcategoría' },
  { value: 'relojes', label: 'Relojes' },
  { value: 'zapatillas', label: 'Zapatillas' },
];
const estadoOptions = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
];

interface StepBasicInfoProps {
  onNext: () => void;
  values: {
    nombre: string;
    descripcion: string;
    sku: string;
    estado: string;
    precio: string;
    categoria: string;
    subcategoria: string;
  };
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => void;
}

const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ onNext, values, onChange }) => (
  <div className="w-full py-8 px-8">
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <span className="font-space font-semibold text-lg mb-4 block">Información Básica</span>
      <div className="mb-4">
        <label className="block text-xs font-space text-gray-500 mb-1">Nombre del producto *</label>
        <input
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
          placeholder="Ej: Reloj de Cuero Clásico"
          name="nombre"
          value={values.nombre}
          onChange={onChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-xs font-space text-gray-500 mb-1">Descripción *</label>
        <div className="border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center gap-2 px-2 py-1 border-b border-gray-100">
            <button className="font-bold text-gray-500 px-1">B</button>
            <button className="italic text-gray-500 px-1">I</button>
            <button className="underline text-gray-500 px-1">U</button>
            <button className="text-gray-500 px-1">•</button>
            <button className="text-gray-500 px-1">1.</button>
          </div>
          <textarea
            className="w-full border-0 px-4 py-2 text-sm bg-white focus:outline-none min-h-[80px] resize-none"
            placeholder="Describe tu producto detalladamente..."
            name="descripcion"
            value={values.descripcion}
            onChange={onChange}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <label className="block text-xs font-space text-gray-500 mb-1">SKU *</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
            placeholder="Ej: RL-001"
            name="sku"
            value={values.sku}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-xs font-space text-gray-500 mb-1">Estado</label>
          <SelectDefault
            options={estadoOptions}
            value={values.estado}
            onChange={val => onChange({ name: 'estado', value: val })}
          />
        </div>
        <div>
          <label className="block text-xs font-space text-gray-500 mb-1">Precio *</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
            placeholder="$ 0.00"
            name="precio"
            value={values.precio}
            onChange={onChange}
          />
        </div>
        <div>
          <label className="block text-xs font-space text-gray-500 mb-1">Precio de descuento</label>
          <input
            className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none"
            placeholder="$ 0.00"
            // No se envía este campo
          />
        </div>
        <div>
          <label className="block text-xs font-space text-gray-500 mb-1">Categoría *</label>
          <SelectDefault
            options={categoriaOptions}
            value={values.categoria}
            onChange={val => onChange({ name: 'categoria', value: val })}
          />
        </div>
        <div>
          <label className="block text-xs font-space text-gray-500 mb-1">Subcategoría</label>
          <SelectDefault
            options={subcategoriaOptions}
            value={values.subcategoria}
            onChange={val => onChange({ name: 'subcategoria', value: val })}
          />
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

export default StepBasicInfo;
