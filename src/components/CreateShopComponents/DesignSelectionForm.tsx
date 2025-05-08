import React from 'react';
import { DesignButton } from '../atoms/DesignButton';

interface DesignSelectionFormProps {
    onApply: () => void;
}

const DesignSelectionForm: React.FC<DesignSelectionFormProps> = ({ onApply }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="bg-white border rounded-md p-4 flex flex-col items-center">
                    <img src={`https://placehold.co/300x200`} alt={`Placeholder ${index + 1}`} className="mb-4" />
                    <div className="flex gap-2">
                        <DesignButton variant="neutral">Previsualizar</DesignButton>
                        <DesignButton variant="primary" onClick={onApply}>Aplicar</DesignButton>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DesignSelectionForm;
