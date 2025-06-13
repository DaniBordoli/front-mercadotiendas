import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { DesignButton } from '../../atoms/DesignButton';
import { StatusTags } from '../../atoms/StatusTags';

export const DomainSubdomainSection: React.FC = () => {
    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            <div className="flex flex-col gap-4">
                <div className="mb-4">
                    <label className="text-sm font-space mb-2 block">Subdominio actual</label>
                    <div className="flex items-center">
                        <InputDefault
                            placeholder="mitienda"
                            value="mitienda"
                            className="w-full"
                        />
                        <span className="ml-2 text-gray-600 whitespace-nowrap">.mercadotiendas.com</span>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="text-sm font-space mb-2 block">Dominio personalizado</label>
                    <InputDefault
                        placeholder="www.mitienda.com"
                        value="www.mitienda.com"
                        className="w-full"
                    />
                </div>
                <div className="flex items-center mb-6">
                    <StatusTags status="Active" className="mr-2" />
                    <span className="text-gray-700 font-space">Dominio conectado correctamente</span>
                </div>
                <div className="flex flex-col gap-2">
                    <DesignButton variant="neutral">Restaurar</DesignButton>
                    <DesignButton variant="primary">Guardar cambios</DesignButton>
                </div>
            </div>
        </div>
    );
};
