import React, { useState, useEffect } from 'react';
import { colors } from '../../design/colors';
import { DesignButton } from '../atoms/DesignButton';
import LogoUploader from './LogoUploader';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { FirstLayoutEditableVariables } from '../organisms/CustomizableMenu/types';

interface ColorBrandFormProps {
    onNext: (data: { primaryColor: string; secondaryColor: string; logoUrl?: string }) => void;
}

const ColorBrandForm: React.FC<ColorBrandFormProps> = ({ onNext }) => {
    const { editableVariables, updateEditableVariables } = useFirstLayoutStore();
    
    // Estados locales para los colores seleccionados
    const [primaryColor, setPrimaryColor] = useState(editableVariables.primaryColor || colors.primaryRed);
    const [secondaryColor, setSecondaryColor] = useState(editableVariables.secondaryColor || colors.accentTeal);
    const [logoUrl, setLogoUrl] = useState(editableVariables.logoUrl || '');

    // Opciones de colores predefinidos
    const primaryColorOptions = [
        colors.primaryRed,    // #FF4F41
        '#FF6B6B',           // Rojo coral
        '#4ECDC4',           // Teal
        '#45B7D1',           // Azul cielo  
        '#96CEB4',           // Verde menta
        '#FFEAA7',           // Amarillo suave
        '#DDA0DD',           // Lila
        '#FFB6C1',           // Rosa claro
        '#87CEEB',           // Azul cielo claro
        '#98FB98'            // Verde claro
    ];

    const secondaryColorOptions = [
        colors.accentTeal,    // #4ECDC4
        '#FF6B6B',           // Rojo coral
        '#45B7D1',           // Azul cielo
        '#96CEB4',           // Verde menta
        '#FFEAA7',           // Amarillo suave
        '#DDA0DD',           // Lila
        colors.primaryRed,    // Rojo principal
        '#FFB6C1',           // Rosa claro
        '#87CEEB',           // Azul cielo claro
        '#98FB98'            // Verde claro
    ];

    // Aplicar cambios al store cuando cambian los colores
    useEffect(() => {
        const updatedVariables: Partial<FirstLayoutEditableVariables> = {
            primaryColor,
            secondaryColor,
            logoUrl,
            // Navbar siempre usa el color principal
            navbarBackgroundColor: primaryColor,
            navbarTitleColor: '#FFFFFF',
            // Hero section usa el color principal como background
            heroBackgroundColor: primaryColor,
            // Los botones en hero section usan el color secundario para contrastar
            buttonBackgroundColor: secondaryColor,
            buttonTextColor: '#FFFFFF',
            button2BackgroundColor: '#FFFFFF',
            button2TextColor: primaryColor,
            // Productos destacados usan el color secundario
            featuredProductsCardButtonColor: secondaryColor,
            featuredProductsCardButtonTextColor: '#FFFFFF',
        };

        updateEditableVariables(updatedVariables);
    }, [primaryColor, secondaryColor, logoUrl, updateEditableVariables]);

    const handleContinue = () => {
        onNext({ 
            primaryColor, 
            secondaryColor, 
            logoUrl 
        });
    };

    const ColorPicker: React.FC<{
        label: string;
        selectedColor: string;
        colorOptions: string[];
        onColorSelect: (color: string) => void;
    }> = ({ label, selectedColor, colorOptions, onColorSelect }) => (
        <div className="w-full">
            <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                {label}
            </label>
            {/* Color seleccionado actual */}
            <div className="mb-4">
                <div
                    className="h-10 w-full rounded-md border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                    title={`Color seleccionado: ${selectedColor}`}
                />
            </div>
            {/* Grid de opciones de colores con espaciado mejorado */}
            <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                    <div
                        key={color}
                        className="w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
                        style={{
                            backgroundColor: color,
                            borderColor: selectedColor === color ? '#000000' : '#E5E5E7',
                            borderWidth: selectedColor === color ? '2px' : '1px',
                        }}
                        onClick={() => onColorSelect(color)}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Contenedor principal con diseño similar a DataShopConfig */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                <h2 className="text-lg font-space font-medium text-gray-800 mb-6">Colores y Marca</h2>
                
                {/* Layout dividido en dos columnas como DataShopConfig */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    
                    {/* Columna izquierda - Selección de colores */}
                    <div className="flex-1">
                        <h3 className="text-base font-space font-medium text-gray-800 mb-4">Selección de Colores</h3>
                        
                        <div className="space-y-6">
                            <ColorPicker
                                label="Color Principal"
                                selectedColor={primaryColor}
                                colorOptions={primaryColorOptions}
                                onColorSelect={setPrimaryColor}
                            />
                            
                            <ColorPicker
                                label="Color Secundario"
                                selectedColor={secondaryColor}
                                colorOptions={secondaryColorOptions}
                                onColorSelect={setSecondaryColor}
                            />
                        </div>
                    </div>

                    {/* Columna derecha - Logo y vista previa */}
                    <div className="flex-1">
                        <h3 className="text-base font-space font-medium text-gray-800 mb-4">Marca y Vista Previa</h3>
                        
                        {/* Logo uploader */}
                        <div className="mb-6">
                            <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                                Logo de Tienda
                            </label>
                            <LogoUploader 
                                currentLogoUrl={logoUrl || '/logo.png'}
                                onLogoUpdate={setLogoUrl}
                            />
                        </div>

                        {/* Vista previa con contraste mejorado */}
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-space font-medium text-gray-600 mb-3">Vista Previa</h4>
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <div 
                                        className="h-10 rounded-md mb-2"
                                        style={{ backgroundColor: primaryColor }}
                                    />
                                    <span className="text-xs text-gray-500">Principal (Fondos)</span>
                                </div>
                                <div className="flex-1">
                                    <div 
                                        className="h-10 rounded-md mb-2"
                                        style={{ backgroundColor: secondaryColor }}
                                    />
                                    <span className="text-xs text-gray-500">Secundario (Botones)</span>
                                </div>
                            </div>
                            {/* Simulación del hero section con contraste */}
                            <div className="w-full rounded-md overflow-hidden mb-3" style={{ backgroundColor: primaryColor }}>
                                <div className="p-4">
                                    <div className="flex gap-2">
                                        <div className="h-8 px-4 rounded flex items-center justify-center text-white text-xs font-medium"
                                             style={{ backgroundColor: secondaryColor }}>
                                            Botón Principal
                                        </div>
                                        <div className="h-8 px-4 rounded flex items-center justify-center text-xs font-medium"
                                             style={{ backgroundColor: '#FFFFFF', color: primaryColor }}>
                                            Botón Secundario
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">Ejemplo: Hero Section con botones contrastantes</span>
                        </div>
                    </div>
                </div>

                {/* Botón de continuar */}
                <div className="flex justify-end mt-8">
                    <DesignButton 
                        variant="primary" 
                        onClick={handleContinue}
                        customBackgroundColor={primaryColor}
                        size="large"
                    >
                        Siguiente
                    </DesignButton>
                </div>
            </div>
        </div>
    );
};

export default ColorBrandForm;
