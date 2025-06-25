import React, { useImperativeHandle, forwardRef } from 'react';
import { DesignButton } from '../../atoms/DesignButton/DesignButton';
import { motion } from 'framer-motion';

interface Variant {
  tipo: string;
  valores: string[];
}

interface VariantsStepProps {}

interface VariantsStepRef {
  getVariants: () => Variant[];
}

const VariantsStep = forwardRef<VariantsStepRef, VariantsStepProps>((props, ref) => {
  const [hasVariants, setHasVariants] = React.useState(true);
  const [variants, setVariants] = React.useState<Variant[]>([]);
  const [newVariantType, setNewVariantType] = React.useState('');
  const [newVariantValues, setNewVariantValues] = React.useState<Record<number, string>>({});

  const handleAddVariant = () => {
    if (!newVariantType.trim()) return;
    const newVariant: Variant = {
      tipo: newVariantType.trim(),
      valores: []
    };
    setVariants(prev => [...prev, newVariant]);
    setNewVariantType('');
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index));
    setNewVariantValues(prev => {
      const newValues = { ...prev };
      delete newValues[index];
      return newValues;
    });
  };

  const handleAddValue = (variantIndex: number) => {
    const value = newVariantValues[variantIndex];
    if (!value?.trim()) return;
    
    setVariants(prev => prev.map((variant, index) => {
      if (index === variantIndex) {
        // Evitar duplicados
        if (variant.valores.includes(value.trim())) return variant;
        return {
          ...variant,
          valores: [...variant.valores, value.trim()]
        };
      }
      return variant;
    }));

    setNewVariantValues(prev => ({ ...prev, [variantIndex]: '' }));
  };

  const handleRemoveValue = (variantIndex: number, valueIndex: number) => {
    setVariants(prev => prev.map((variant, index) => {
      if (index === variantIndex) {
        return {
          ...variant,
          valores: variant.valores.filter((_, i) => i !== valueIndex)
        };
      }
      return variant;
    }));
  };

  useImperativeHandle(ref, () => ({
    getVariants: () => hasVariants ? variants.filter(v => v.tipo && v.valores.length > 0) : [],
  }));

  return (
    <div className="w-full py-8 px-8">
      <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <span className="font-space font-semibold text-lg mb-1 block">Variantes del Producto</span>
        <span className="block text-sm text-gray-400 mb-4">
          Define las variantes de tu producto como color, talla, material, etc.
        </span>
        
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
              Activa esta opción para gestionar variantes como color, talle, material, etc.
            </div>
          </div>
        </div>

        {hasVariants && (
          <>
            {/* Agregar nueva variante */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <span className="font-space text-sm font-semibold block mb-2">Agregar nueva variante</span>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-space text-gray-500 mb-1">Tipo de variante</label>
                  <input
                    className="w-full px-3 py-2 border rounded-lg text-sm font-space focus:outline-sky-400"
                    type="text"
                    placeholder="Ej: Color, Talla, Material, Madera..."
                    value={newVariantType}
                    onChange={(e) => setNewVariantType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddVariant();
                    }}
                  />
                </div>
                <DesignButton
                  variant="primary"
                  onClick={handleAddVariant}
                  disabled={!newVariantType.trim()}
                  className="px-4 py-2 text-sm"
                >
                  Agregar
                </DesignButton>
              </div>
            </div>

            {/* Lista de variantes */}
            {variants.map((variant, variantIndex) => (
              <div key={variantIndex} className="mb-6 p-4 bg-white border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-space font-medium text-sm text-gray-700 capitalize">
                    {variant.tipo}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(variantIndex)}
                    className="text-red-500 hover:text-red-700 text-sm font-space"
                  >
                    Eliminar variante
                  </button>
                </div>

                {/* Valores de la variante */}
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {variant.valores.map((valor, valueIndex) => (
                      <span
                        key={valueIndex}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-space"
                      >
                        {valor}
                        <button
                          type="button"
                          onClick={() => handleRemoveValue(variantIndex, valueIndex)}
                          className="text-sky-500 hover:text-sky-700 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Agregar nuevo valor */}
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-2 py-1 border rounded text-xs font-space focus:outline-sky-400"
                    type="text"
                    placeholder={`Agregar ${variant.tipo.toLowerCase()}...`}
                    value={newVariantValues[variantIndex] || ''}
                    onChange={(e) => setNewVariantValues(prev => ({ ...prev, [variantIndex]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddValue(variantIndex);
                    }}
                  />
                  <button
                    className="text-sky-600 text-xs font-space hover:underline px-2"
                    type="button"
                    onClick={() => handleAddValue(variantIndex)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}

            {variants.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <span className="text-sm font-space">
                  No hay variantes definidas. Agrega una nueva variante arriba.
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

VariantsStep.displayName = 'VariantsStep';

export default VariantsStep;
