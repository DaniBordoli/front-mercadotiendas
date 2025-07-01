import * as React from 'react';
import DataSideBar from '../components/organisms/DataSideBar/DataSideBar';
import { colors } from '../design/colors';
import { DesignButton } from '../components/atoms/DesignButton';
import LogoUploader from '../components/CreateShopComponents/LogoUploader';
import { useFirstLayoutStore } from '../stores/firstLayoutStore';
import { useShopStore } from '../stores/slices/shopStore';
import { updateShopTemplate, fetchShopTemplate } from '../services/api';

const DataShopConfig: React.FC = () => {
    const [selectedTab, setSelectedTab] = React.useState('Diseño');
    const editableVariables = useFirstLayoutStore(state => state.editableVariables);
    const updateEditableVariables = useFirstLayoutStore(state => state.updateEditableVariables);
    const { shop, getShop } = useShopStore();

    const tabs = ['Diseño'];

    const [primaryColor, setPrimaryColor] = React.useState(editableVariables.primaryColor || colors.primaryRed);
    const [secondaryColor, setSecondaryColor] = React.useState(editableVariables.secondaryColor || colors.accentTeal);
    const [accentColor, setAccentColor] = React.useState(editableVariables.accentColor || '#F8F8F8');
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Paletas de colores
    const primaryColorOptions = [colors.primaryRed, '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFB6C1', '#87CEEB', '#98FB98'];
    const secondaryColorOptions = [colors.accentTeal, '#FF6B6B', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', colors.primaryRed, '#FFB6C1', '#87CEEB', '#98FB98'];
    const accentColorOptions = ['#F8F8F8', '#E5E5E7', '#F3F4F6', '#F9FAFB', '#F1F5F9', '#E0E7EF', '#F6E9FF', '#FFF8E1', '#E0F7FA', '#FFF3E0'];

    // Cargar datos del shop y template al montar el componente
    React.useEffect(() => {
        const loadShopData = async () => {
            try {
                if (!shop) {
                    await getShop();
                }
                
                // Cargar el template para obtener los colores y logo actuales
                const response = await fetchShopTemplate();
                if (response?.data?.templateUpdate) {
                    const template = response.data.templateUpdate;
                    
                    // Actualizar colores locales
                    if (template.primaryColor) setPrimaryColor(template.primaryColor);
                    if (template.secondaryColor) setSecondaryColor(template.secondaryColor);
                    if (template.accentColor) setAccentColor(template.accentColor);
                    
                    // Actualizar el store
                    updateEditableVariables(template);
                }
            } catch (error) {
                console.error('Error loading shop data:', error);
            }
        };
        
        loadShopData();
    }, [shop, getShop, updateEditableVariables]);

    // Actualizar preview localmente
    React.useEffect(() => {
        useFirstLayoutStore.getState().updateEditableVariables({
            primaryColor,
            secondaryColor,
            accentColor,
        });
    }, [primaryColor, secondaryColor, accentColor]);

    // Guardar cambios en templateUpdate
    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            // Preparar los cambios de colores con toda la estructura necesaria
            const colorUpdates = {
                primaryColor,
                secondaryColor,
                accentColor,
                // Aplicar los colores a los elementos correspondientes
                navbarBackgroundColor: accentColor,
                navbarTitleColor: primaryColor,
                navbarLinksColor: primaryColor,
                navbarIconsColor: primaryColor,
                heroBackgroundColor: primaryColor,
                buttonBackgroundColor: secondaryColor,
                buttonTextColor: '#FFFFFF',
                button2BackgroundColor: '#FFFFFF',
                button2TextColor: primaryColor,
                featuredProductsCardButtonColor: secondaryColor,
                featuredProductsCardButtonTextColor: '#FFFFFF',
            };

            // Actualizar el template en el backend
            await updateShopTemplate(colorUpdates);
            
            // Actualizar el store local
            updateEditableVariables(colorUpdates);
        } catch (e: any) {
            setError(e.message || 'Error al guardar');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            <DataSideBar />
            <div className="flex flex-col flex-grow p-4 md:p-10 md:ml-[250px]">
                <h1 className="text-2xl font-space font-medium text-gray-800 mb-6">Configuración de Tienda</h1>
                
            
                <div className="p-4 md:p-6 bg-white rounded-md border" style={{ borderColor: colors.lightGray }}>
                    <div className="relative">
                        <div className="flex gap-6 relative">
                            {tabs.map((tab, index) => (
                                <div
                                    key={tab}
                                    className="flex flex-col cursor-pointer"
                                    onClick={() => setSelectedTab(tab)}
                                >
                                    <span
                                        className={`text-base font-space ${
                                            selectedTab === tab ? 'font-medium' : 'text-gray-500'
                                        }`}
                                        style={{
                                            color: selectedTab === tab ? colors.primaryRed : colors.mediumGray,
                                        }}
                                    >
                                        {tab}
                                    </span>
                                    {selectedTab === tab && (
                                        <div
                                            className="h-[3px] mt-2"
                                            style={{
                                                backgroundColor: colors.primaryRed,
                                                width: index === 0 ? '100%' : '120%',
                                                marginLeft: index === 0 ? '0' : '0',
                                            }}
                                        ></div>
                                    )}
                                </div>
                            ))}
                        </div>
                     
                        <div
                            className="absolute bottom-0 left-0 w-full h-[1px]"
                            style={{ backgroundColor: colors.lightGray }}
                        ></div>
                    </div>

                  
                    <div className="flex flex-col md:flex-row gap-6 md:gap-10 mt-6">
                        <div className="flex-1">
                            <h2 className="text-lg font-space font-medium text-gray-800 mb-4">Colores y Marca</h2>
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                {/* Colores */}
                                <div className="flex-1">
                                    <h3 className="text-base font-space font-medium text-gray-800 mb-4">Selección de Colores</h3>
                                    <div className="space-y-6">
                                        {/* Color Principal */}
                                        <div className="w-full">
                                            <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                                                Color Principal
                                            </label>
                                            <div className="mb-4">
                                                <div
                                                    className="h-10 w-full rounded-md border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:border-gray-300"
                                                    style={{ backgroundColor: primaryColor }}
                                                    title={`Color seleccionado: ${primaryColor}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-5 gap-2">
                                                {primaryColorOptions.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${primaryColor === color ? 'border-black' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setPrimaryColor(color)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Color Secundario */}
                                        <div className="w-full">
                                            <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                                                Color Secundario
                                            </label>
                                            <div className="mb-4">
                                                <div
                                                    className="h-10 w-full rounded-md border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:border-gray-300"
                                                    style={{ backgroundColor: secondaryColor }}
                                                    title={`Color seleccionado: ${secondaryColor}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-5 gap-2">
                                                {secondaryColorOptions.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${secondaryColor === color ? 'border-black' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setSecondaryColor(color)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Color Acento */}
                                        <div className="w-full">
                                            <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                                                Color Acento
                                            </label>
                                            <div className="mb-4">
                                                <div
                                                    className="h-10 w-full rounded-md border-2 border-gray-200 cursor-pointer transition-all duration-200 hover:border-gray-300"
                                                    style={{ backgroundColor: accentColor }}
                                                    title={`Color seleccionado: ${accentColor}`}
                                                />
                                            </div>
                                            <div className="grid grid-cols-5 gap-2">
                                                {accentColorOptions.map((color) => (
                                                    <div
                                                        key={color}
                                                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${accentColor === color ? 'border-black' : 'border-gray-200'}`}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setAccentColor(color)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Logo */}
                                <div className="flex-1">
                                    <h3 className="text-base font-space font-medium text-gray-800 mb-4">Marca y Vista Previa</h3>
                                    <div className="mb-6">
                                        <label className="block text-sm font-space font-medium text-gray-600 mb-3">
                                            Logo de Tienda
                                        </label>
                                        <LogoUploader 
                                            currentLogoUrl={editableVariables.logoUrl || '/logo.png'} 
                                        />
                                    </div>
                                    {/* Vista previa simple */}
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
                        </div>
                        <div className="flex justify-end mt-6">
                            <DesignButton variant="primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar Cambios'}
                            </DesignButton>
                            {error && <span className="text-red-500 ml-4 mt-2">{error}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataShopConfig;
