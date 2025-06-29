import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { DesignButton } from '../../atoms/DesignButton';

export const SeoMetadataSection: React.FC = () => {
    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Título SEO</label>
                <InputDefault
                    placeholder="Título SEO (máx. 60 caracteres)"
                    className="w-full"
                />
            </div>
            <div className="mb-4">
                <label className="text-sm font-space mb-2 block">Meta descripción</label>
                <textarea
                    placeholder="Meta descripción (máx. 160 caracteres)"
                    className="w-full border border-gray-300 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
            </div>
            <div className="flex flex-col gap-2">
              
                <DesignButton variant="primary">Guardar cambios</DesignButton>
            </div>
        </div>
    );
};
