import * as React from 'react';
import { InputDefault } from '../../atoms/InputDefault';
import { DesignButton } from '../../atoms/DesignButton';

export const OperationPoliciesSection: React.FC = () => {
    return (
        <div className="border border-gray-300 border-t-0 rounded-b-md p-4">
            <label className="text-sm font-space mb-2 block">Políticas de Envío</label>
            <div className="mb-6 border border-gray-200 rounded-md p-4">
                <textarea
                    placeholder="Describe las políticas de envío..."
                    className="w-full border border-gray-300 mt-12 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
            </div>
            <label className="text-sm font-space mb-2 block">Políticas de Devoluciones</label>
            <div className="mb-6 border border-gray-200 rounded-md p-4">
                <textarea
                    placeholder="Describe las políticas de devoluciones..."
                    className="w-full border border-gray-300 mt-12 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
            </div>
            <label className="text-sm font-space mb-2 block">Términos y Condiciones</label>
            <div className="mb-6 border border-gray-200 rounded-md p-4">
                <textarea
                    placeholder="Describe los términos y condiciones..."
                    className="w-full border border-gray-300 mt-12 rounded-md p-3 text-sm font-space"
                    rows={4}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                    <label className="text-sm font-space mb-2 block">CUIT/RUT</label>
                    <InputDefault placeholder="Ingrese CUIT/RUT" className="w-full" />
                </div>
                <div>
                    <label className="text-sm font-space mb-2 block">Razón Social</label>
                    <InputDefault placeholder="Ingrese razón social" className="w-full" />
                </div>
            </div>
            <div className="mb-6">
                <label className="text-sm font-space mb-2 block">Domicilio Fiscal</label>
                <InputDefault placeholder="Ingrese domicilio fiscal" className="w-full" />
            </div>
            <div className="flex flex-col gap-2">
             
                <DesignButton variant="primary">Guardar cambios</DesignButton>
            </div>
        </div>
    );
};
