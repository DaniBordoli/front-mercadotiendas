import React, { useState, useEffect } from 'react';
import { colors } from '../../design/colors';
import { DesignButton } from '../atoms/DesignButton';
import LogoUploader from './LogoUploader';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { FirstLayoutEditableVariables } from '../organisms/CustomizableMenu/types';

interface ColorBrandFormProps {
    onNext: (data: { primaryColor: string; secondaryColor: string; accentColor: string; logoUrl?: string; logoFile?: File }) => void;
    initialColors?: {
        primaryColor?: string;
        secondaryColor?: string;
        accentColor?: string;
    };
}

const ColorBrandForm: React.FC<ColorBrandFormProps> = ({ onNext, initialColors }) => {
    const { editableVariables, updateEditableVariables } = useFirstLayoutStore();
    // Estados locales para los colores seleccionados
    const [primaryColor, setPrimaryColor] = useState(initialColors?.primaryColor || editableVariables.primaryColor || colors.primaryRed);
    const [secondaryColor, setSecondaryColor] = useState(initialColors?.secondaryColor || editableVariables.secondaryColor || colors.accentTeal);
    const [accentColor, setAccentColor] = useState(initialColors?.accentColor || editableVariables.accentColor || '#F8F8F8');
    const [logoUrl, setLogoUrl] = useState(editableVariables.logoUrl || '');
    const [logoFile, setLogoFile] = useState<File | null>(null);

    // Opciones de colores predefinidos
    const primaryColorOptions = [
        colors.primaryRed, '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#87CEEB', '#98FB98'
    ];
    const secondaryColorOptions = [
        colors.accentTeal, '#FF6B6B', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', colors.primaryRed, '#FFB6C1', '#87CEEB', '#98FB98'
    ];
    const accentColorOptions = ['#F8F8F8', '#E5E5E7', '#F3F4F6', '#F9FAFB', '#F1F5F9', '#E0E7EF', '#F6E9FF', '#FFF8E1', '#E0F7FA', '#FFF3E0'];

    // Aplicar cambios al store cuando cambian los colores
    useEffect(() => {
        const updatedVariables: Partial<FirstLayoutEditableVariables> = {
            primaryColor,
            secondaryColor,
            accentColor,
            logoUrl,
            navbarBackgroundColor: accentColor, // Usar color acento para navbar
            navbarTitleColor: primaryColor, 
            heroBackgroundColor: primaryColor,
            buttonBackgroundColor: secondaryColor,
            buttonTextColor: '#FFFFFF',
            button2BackgroundColor: '#FFFFFF',
            button2TextColor: primaryColor,
            featuredProductsCardButtonColor: secondaryColor,
            featuredProductsCardButtonTextColor: '#FFFFFF',
        };
        updateEditableVariables(updatedVariables);
    }, [primaryColor, secondaryColor, accentColor, logoUrl, updateEditableVariables]);

    const handleContinue = () => {
        onNext({ 
            primaryColor, 
            secondaryColor, 
            accentColor,
            logoUrl,
            logoFile: logoFile || undefined
        });
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Por favor selecciona una imagen válida');
            return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('La imagen debe ser menor a 10MB');
            return;
        }
        setLogoFile(file);
        const tempUrl = URL.createObjectURL(file);
        setLogoUrl(tempUrl);
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
            <div className="mb-4">
                <div
                    className="h-10 w-full rounded-md border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                    title={`Color seleccionado: ${selectedColor}`}
                />
            </div>
            <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((color) => (
                    <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 transition-all duration-200 hover:scale-105 hover:shadow-md ${selectedColor === color ? 'border-black' : 'border-gray-200'}`}
                        style={{ backgroundColor: color }}
                        onClick={() => onColorSelect(color)}
                        title={color}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
                <h2 className="text-lg font-space font-medium text-gray-800 mb-6">Colores y Marca</h2>
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
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
                            <ColorPicker
                                label="Color Acento"
                                selectedColor={accentColor}
                                colorOptions={accentColorOptions}
                                onColorSelect={setAccentColor}
                            />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-base font-space font-medium text-gray-800 mb-4">Marca y Vista Previa</h3>
                        <div className="mb-6">
                            <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                                Logo de Tienda
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                    id="logo-upload"
                                />
                                <label htmlFor="logo-upload" className="cursor-pointer">
                                    {logoUrl ? (
                                        <div className="flex flex-col items-center">
                                            <img 
                                                src={logoUrl} 
                                                alt="Logo preview" 
                                                className="w-20 h-20 object-contain mb-2"
                                            />
                                            <span className="text-sm text-gray-600">Cambiar logo</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                                <span className="text-gray-400 text-xl">+</span>
                                            </div>
                                            <span className="text-sm text-gray-600">Subir logo</span>
                                            <span className="text-xs text-gray-400">Máximo 10MB</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
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
                                <div className="flex-1">
                                    <div 
                                        className="h-10 rounded-md mb-2"
                                        style={{ backgroundColor: accentColor }}
                                    />
                                    <span className="text-xs text-gray-500">Acento (Navbar, fondos)</span>
                                </div>
                            </div>
                            <div className="w-full rounded-md overflow-hidden mb-2 border border-gray-200" style={{ backgroundColor: accentColor }}>
                                <div className="p-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                                        <span className="text-sm font-medium" style={{ color: primaryColor }}>
                                            Mi Tienda
                                        </span>
                                    </div>
                                    <div className="flex gap-3 text-xs" style={{ color: primaryColor }}>
                                        <span>Inicio</span>
                                        <span>Tienda</span>
                                        <span>Contacto</span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 mb-3 block">NavBar con fondo acento y texto en color principal</span>
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
                            <span className="text-xs text-gray-500">Hero Section con fondo en color principal</span>
                        </div>
                    </div>
                </div>
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
