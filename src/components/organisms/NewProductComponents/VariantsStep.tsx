import React, { useImperativeHandle, forwardRef } from 'react';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { SelectDefault } from '../../atoms/SelectDefault/SelectDefault';
import { motion } from 'framer-motion';

const colorOptions = [
  'Negro', 'Marrón', 'Plata', 'Rojo', 'Azul', 'Verde'
];

const variant1Options = [
  { value: '', label: 'Seleccionar... (talle, etc)' },
  { value: 'color', label: 'Color' },
  { value: 'talle', label: 'Talle' },
];
const variant2Options = [
  { value: '', label: 'Seleccionar... (talle, etc)' },
  { value: 'talle', label: 'Talle' },
  { value: 'color', label: 'Color' },
];

const colorMap: Record<string, string> = {
  Negro: 'bg-black',
  Marrón: '', // custom color below
  Plata: 'bg-gray-300',
};

const customColorStyle: Record<string, React.CSSProperties> = {
  Marrón: { background: '#8B5C2A' },
};

const talleOptions = [
  'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'
];

const VariantsStep = forwardRef((props, ref) => {
  const [hasVariants, setHasVariants] = React.useState(true);
  const [variant1, setVariant1] = React.useState('');
  const [variant2, setVariant2] = React.useState('');
  const [variantValues, setVariantValues] = React.useState<Record<string, string[]>>({});
  const [newValue1, setNewValue1] = React.useState('');
  const [newValue2, setNewValue2] = React.useState('');

  const handleAddValue = (variant: string, value: string) => {
    if (!value.trim()) return;
    setVariantValues((prev) => ({
      ...prev,
      [variant]: prev[variant] ? [...prev[variant], value.trim()] : [value.trim()],
    }));
    if (variant === variant1) setNewValue1('');
    if (variant === variant2) setNewValue2('');
  };

  const handleRemoveValue = (variant: string, value: string) => {
    setVariantValues((prev) => ({
      ...prev,
      [variant]: prev[variant].filter((v) => v !== value),
    }));
  };

  const handleVariantChange = (variant: 'variant1' | 'variant2', value: any) => {
    const val = typeof value === 'object' && value !== null
      ? value.value
      : value;
    if (variant === 'variant1') {
      setVariant1(val);
      if (val && !variantValues[val]) {
        setVariantValues((prev) => ({ ...prev, [val]: [] }));
      }
      setNewValue1('');
    } else {
      setVariant2(val);
      if (val && !variantValues[val]) {
        setVariantValues((prev) => ({ ...prev, [val]: [] }));
      }
      setNewValue2('');
    }
  };

  useImperativeHandle(ref, () => ({
    getVariants: () => ({
      color: Array.isArray(variantValues['color']) ? variantValues['color'] : [],
      talle: Array.isArray(variantValues['talle']) ? variantValues['talle'] : [],
    }),
  }));

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
  
        {hasVariants && (
          <>
            <div className="mb-6">
              <span className="font-space text-sm font-semibold block mb-2">Tipos de variantes</span>
              <span className="block text-xs text-gray-400 mb-4">
                Selecciona o crea los tipos de variantes para este producto
              </span>
              <div className="flex flex-col gap-4 mb-4">
                <div>
                  <label className="block text-xs font-space text-gray-500 mb-1">Variante 1</label>
                  <SelectDefault
                    options={variant1Options}
                    value={variant1}
                    onChange={(e: any) => handleVariantChange('variant1', e?.target?.value ?? e?.value ?? e)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-space text-gray-500 mb-1">Variante 2 (opcional)</label>
                  <SelectDefault
                    options={variant2Options}
                    value={variant2}
                    onChange={(e: any) => handleVariantChange('variant2', e?.target?.value ?? e?.value ?? e)}
                  />
                </div>
              </div>
            </div>

            {variant1 && variant1 !== '' && (
              <div className="mb-2">
                <span className="block text-xs font-space text-gray-500 mb-2">Valores para {variant1.charAt(0).toUpperCase() + variant1.slice(1)}</span>
                <div className="flex gap-2 flex-wrap mb-2">
                  {variantValues[variant1]?.map((value) => (
                    <span key={value} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-space">
                      {value}
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600 text-xs"
                        onClick={() => handleRemoveValue(variant1, value)}
                        type="button"
                        aria-label={`Eliminar ${value}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 items-center mt-2">
                  {variant1 === 'talle' ? (
                    <>
                      <select
                        className="px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                        value={newValue1}
                        onChange={(e) => setNewValue1(e.target.value)}
                      >
                        <option value="">Seleccionar talle...</option>
                        {talleOptions.map((talle) => (
                          <option key={talle} value={talle}>{talle}</option>
                        ))}
                      </select>
                      <button
                        className="text-sky-600 text-xs font-space hover:underline"
                        type="button"
                        onClick={() => {
                          if (newValue1) handleAddValue(variant1, newValue1);
                        }}
                      >
                        + Agregar talle
                      </button>
                    </>
                  ) : variant1 === 'color' ? (
                    <>
                      <select
                        className="px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                        value={newValue1}
                        onChange={(e) => setNewValue1(e.target.value)}
                      >
                        <option value="">Seleccionar color...</option>
                        {colorOptions.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                      <button
                        className="text-sky-600 text-xs font-space hover:underline"
                        type="button"
                        onClick={() => {
                          if (newValue1) handleAddValue(variant1, newValue1);
                        }}
                      >
                        + Agregar color
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        className="px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                        type="text"
                        placeholder={`Agregar valor...`}
                        value={newValue1}
                        onChange={(e) => setNewValue1(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddValue(variant1, newValue1);
                        }}
                      />
                      <button
                        className="text-sky-600 text-xs font-space hover:underline"
                        type="button"
                        onClick={() => handleAddValue(variant1, newValue1)}
                      >
                        + Agregar valor
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {variant2 && variant2 !== '' && (
              <div className="mb-2">
                <span className="block text-xs font-space text-gray-500 mb-2">Valores para {variant2.charAt(0).toUpperCase() + variant2.slice(1)}</span>
                <div className="flex gap-2 flex-wrap mb-2">
                  {variantValues[variant2]?.map((value) => (
                    <span key={value} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-space">
                      {value}
                      <button
                        className="ml-1 text-gray-400 hover:text-gray-600 text-xs"
                        onClick={() => handleRemoveValue(variant2, value)}
                        type="button"
                        aria-label={`Eliminar ${value}`}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 items-center mt-2">
                  {variant2 === 'talle' ? (
                    <>
                      <select
                        className="px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                        value={newValue2}
                        onChange={(e) => setNewValue2(e.target.value)}
                      >
                        <option value="">Seleccionar talle...</option>
                        {talleOptions.map((talle) => (
                          <option key={talle} value={talle}>{talle}</option>
                        ))}
                      </select>
                      <button
                        className="text-sky-600 text-xs font-space hover:underline"
                        type="button"
                        onClick={() => {
                          if (newValue2) handleAddValue(variant2, newValue2);
                        }}
                      >
                        + Agregar talle
                      </button>
                    </>
                  ) : variant2 === 'color' ? (
                    <>
                      <select
                        className="px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                        value={newValue2}
                        onChange={(e) => setNewValue2(e.target.value)}
                      >
                        <option value="">Seleccionar color...</option>
                        {colorOptions.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                      <button
                        className="text-sky-600 text-xs font-space hover:underline"
                        type="button"
                        onClick={() => {
                          if (newValue2) handleAddValue(variant2, newValue2);
                        }}
                      >
                        + Agregar color
                      </button>
                    </>
                  ) : (
                    <>
                      <input
                        className="px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                        type="text"
                        placeholder={`Agregar valor...`}
                        value={newValue2}
                        onChange={(e) => setNewValue2(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddValue(variant2, newValue2);
                        }}
                      />
                      <button
                        className="text-sky-600 text-xs font-space hover:underline"
                        type="button"
                        onClick={() => handleAddValue(variant2, newValue2)}
                      >
                        + Agregar valor
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default VariantsStep;
