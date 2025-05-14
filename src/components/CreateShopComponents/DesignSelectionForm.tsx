import React from 'react';
import { DesignButton } from '../atoms/DesignButton';

interface DesignSelectionFormProps {
    onApply: () => void;
    onApplyLayoutName?: (layoutName: string) => void; // Nuevo prop opcional
}

const layouts = [
    {
        name: 'Minimal Modern',
        description: 'Ideal para moda',
        img: 'https://placehold.co/400x200?text=Minimal+Modern',
        tag: 'Popular',
        tagColor: 'bg-red-100 text-red-500',
        previewRoute: '/first-layout',
    },
    {
        name: 'Classic Elegant',
        description: 'Ideal para joyería',
        img: 'https://placehold.co/400x200?text=Classic+Elegant',
        tag: 'Nuevo',
        tagColor: 'bg-green-100 text-green-600',
        previewRoute: undefined,
    },
    {
        name: 'Tech Modern',
        description: 'Ideal para electrónica',
        img: 'https://placehold.co/400x200?text=Tech+Modern',
        tag: null,
        tagColor: '',
        previewRoute: undefined,
    },
    {
        name: 'Artisan Boutique',
        description: 'Ideal para artesanías',
        img: 'https://placehold.co/400x200?text=Artisan+Boutique',
        tag: null,
        tagColor: '',
        previewRoute: undefined,
    },
];

const DesignSelectionForm: React.FC<DesignSelectionFormProps> = ({ onApply, onApplyLayoutName }) => {
    const [selectedLayout, setSelectedLayout] = React.useState<number | null>(null);

    const getPreviewSrc = () => {
        if (selectedLayout === null) return undefined;
        const route = layouts[selectedLayout].previewRoute;
        if (!route) return undefined;
        return `${window.location.origin}${route}`;
    };

    const handleApply = (layoutName: string) => {
        if (onApplyLayoutName) onApplyLayoutName(layoutName);
        onApply();
    };

    return (
        <div className="w-full">
            <div className="flex gap-8 border-b pb-4 mb-8">
                <span className="text-primary font-semibold border-b-2 border-primary pb-2">Layout</span>
                <span className="text-gray-500">Paleta de colores</span>
                <span className="text-gray-500">Tipografía</span>
                <span className="text-gray-500">Vista previa</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {layouts.map((layout, index) => (
                    <div key={layout.name} className="border rounded-lg p-4 bg-white flex flex-col gap-2 shadow-sm">
                        <div className="w-full h-40 bg-gray-100 rounded mb-2 flex items-center justify-center overflow-hidden">
                            <img src={layout.img} alt={layout.name} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">{layout.name}</div>
                                <div className="text-xs text-gray-500">{layout.description}</div>
                            </div>
                            {layout.tag && (
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${layout.tagColor}`}>
                                    {layout.tag}
                                </span>
                            )}
                        </div>
                        <div className="flex gap-3 mt-2">
                            <DesignButton
                                variant="neutral"
                                fullWidth
                                onClick={() => setSelectedLayout(index)}
                            >
                                Previsualizar
                            </DesignButton>
                            <DesignButton
                                variant="primary"
                                fullWidth
                                onClick={() => handleApply(layout.name)}
                            >
                                Aplicar
                            </DesignButton>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <DesignButton variant="neutral">
                    Ver más layouts
                </DesignButton>
            </div>
            <div className="w-full mt-12">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Vista Previa
                </h2>
                <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center min-h-[400px] text-gray-400">
                    {getPreviewSrc() ? (
                        <iframe
                            src={getPreviewSrc()}
                            title="Vista previa Layout"
                            className="rounded border"
                            style={{
                                minHeight: 400,
                                height: 600,
                                width: '100%',
                                border: 'none',
                                display: 'block',
                            }}
                        />
                    ) : (
                        <span>Aquí irá la vista previa del layout seleccionado.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DesignSelectionForm;
