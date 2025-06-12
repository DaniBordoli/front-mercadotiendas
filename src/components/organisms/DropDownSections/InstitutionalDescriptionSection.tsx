import * as React from 'react';
import { DesignButton } from '../../atoms/DesignButton';

export const InstitutionalDescriptionSection: React.FC = () => {
    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Descripción de la tienda</label>
                <textarea
                    placeholder="Describe tu tienda..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
                <div className="text-right text-sm text-gray-500 mt-1">0/2000 caracteres</div>
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Misión</label>
                <textarea
                    placeholder="Misión de la empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={2}
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Visión</label>
                <textarea
                    placeholder="Describe la visión de tu empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                    maxLength={2000}
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Historia</label>
                <textarea
                    placeholder="Describe la historia de tu empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Valores</label>
                <textarea
                    placeholder="Describe los valores de tu empresa..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
            </div>
            <div className="flex flex-col gap-2">
                <DesignButton variant="neutral">Restaurar</DesignButton>
                <DesignButton variant="primary">Guardar cambios</DesignButton>
            </div>
        </div>
    );
};
