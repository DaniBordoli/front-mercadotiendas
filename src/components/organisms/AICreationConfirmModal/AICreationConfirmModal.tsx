import React from 'react';
import { Modal } from '../../molecules/Modal/Modal';
import { InputField } from '../../atoms/InputField';
import { DesignButton } from '../../atoms/DesignButton';
import { EditableVariables } from '../CustomizableMenu/types'; // Adjust path if needed

interface AICreationConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData: EditableVariables;
    subdomain: string;
    onSubdomainChange: (value: string) => void;
    onConfirm: (subdomain: string) => Promise<void>; // Make async if needed
    isLoading: boolean;
    error: string | null;
}

export const AICreationConfirmModal: React.FC<AICreationConfirmModalProps> = ({
    isOpen,
    onClose,
    initialData,
    subdomain,
    onSubdomainChange,
    onConfirm,
    isLoading,
    error
}) => {

    const handleConfirmClick = () => {
        onConfirm(subdomain);
    }

    // Function to render a summary item safely
    const renderSummaryItem = (label: string, value: string | undefined | null, isColor = false) => {
        const displayValue = value || 'No definido';
        return (
            <p>
                <strong>{label}:</strong> 
                {isColor && value ? (
                    <>
                        <span style={{ display: 'inline-block', width: '16px', height: '16px', backgroundColor: value, border: '1px solid #ccc', verticalAlign: 'middle', marginRight: '5px', marginLeft: '5px' }}></span>
                        {displayValue}
                    </>
                ) : (
                    ` ${displayValue}`
                )}
            </p>
        );
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Confirma la Creación de tu Tienda" maxWidth="600px">
            <div className="space-y-4 p-4">
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">Resumen de Configuración</h3>

                {/* Display Summary Fields */} 
                {renderSummaryItem('Nombre Tienda', initialData.storeName || initialData.title)}
                {renderSummaryItem('Descripción', initialData.storeDescription)}
                {renderSummaryItem('Lema', initialData.storeSlogan)}
                {/* Add more fields as needed */} 
                {renderSummaryItem('Fuente', initialData.fontType)}
                {renderSummaryItem('Color Primario', initialData.primaryColor, true)}
                {renderSummaryItem('Color Navbar', initialData.navbarBackgroundColor, true)}
                {renderSummaryItem('Color Principal', initialData.mainBackgroundColor, true)}

                <h3 className="text-lg font-semibold border-b pb-2 mb-3 mt-4">Elige tu URL</h3>
                <InputField
                    label="Subdominio"
                    name="subdomain"
                    value={subdomain}
                    onChange={onSubdomainChange}
                    placeholder="tu-tienda"
                    suffix=".mercadotiendas.com"
                    required
                    // Show only subdomain specific errors here
                    error={error?.toLowerCase().includes("subdominio") ? error : undefined}
                    pattern="^[a-z0-9-]{3,30}$" // Added min length 3
                    patternMessage="Solo 3-30 letras minúsculas, números y guiones."
                    maxLength={30}
                />
                 {/* Show general errors here */}
                 {error && !error.toLowerCase().includes("subdominio") && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                 )}

                <div className="flex justify-end space-x-3 pt-4">
                    <DesignButton variant="neutral" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </DesignButton>
                    <DesignButton
                        variant="primary"
                        onClick={handleConfirmClick}
                        loading={isLoading}
                        disabled={isLoading || !subdomain}
                    >
                        {isLoading ? 'Creando...' : 'Confirmar y Crear Tienda'}
                    </DesignButton>
                </div>
            </div>
        </Modal>
    );
};

export default AICreationConfirmModal; 