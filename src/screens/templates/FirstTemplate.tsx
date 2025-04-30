import * as React from 'react';
import { InputDefault } from '../../components/atoms/InputDefault/InputDefault';
import { SelectDefault } from '../../components/atoms/SelectDefault/SelectDefault';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { Card } from '../../components/molecules/Card/Card';
import CustomizableMenu from '../../components/organisms/CustomizableMenu/CustomizableMenu';
import { FooterCustom } from '../../components/organisms/FooterCustom';
import { DesignButton } from '../../components/atoms/DesignButton/DesignButton';

const FirstTemplate: React.FC = () => {
    const [isMenuOpen, setMenuOpen] = React.useState(false);

    const [editableVariables, setEditableVariables] = React.useState({
        navbarLinks: [
            { label: 'Inicio', href: '#' },
            { label: 'Productos', href: '#' },
            { label: 'Sobre Nosotros', href: '#' },
            { label: 'Contacto', href: '#' },
        ],
        title: 'MercadoTiendas',
        fontType: 'Arial',
        placeholderHeroImage: 'https://placehold.co/600x400',
        placeholderCardImage: 'https://placehold.co/400x300',
        textColor: '#000000',
        navbarBackgroundColor: '#FFFFFF',
        mainBackgroundColor: '#F8F9FA',
        filterOptions: {
            categories: [
                { value: 'all', label: 'Todas' },
                { value: 'electronics', label: 'Electrónica' },
                { value: 'clothing', label: 'Ropa' },
                { value: 'home', label: 'Hogar' },
            ],
            prices: [
                { value: 'all', label: 'Todos los precios' },
                { value: 'under50', label: 'Menos de $50' },
                { value: '50to100', label: '$50 - $100' },
                { value: 'over100', label: 'Más de $100' },
            ],
            sorting: [
                { value: 'recommended', label: 'Recomendados' },
                { value: 'newest', label: 'Más recientes' },
                { value: 'priceAsc', label: 'Precio: menor a mayor' },
                { value: 'priceDesc', label: 'Precio: mayor a menor' },
            ],
        },
        footerBackgroundColor: '#F8F8F8', 
        footerTextColor: '#000000', 
        footerSections: [ 
            {
                title: 'Empresa',
                links: [
                    { text: 'Sobre Nosotros', url: '#' },
                    { text: 'Careers', url: '#' },
                    { text: 'Blog', url: '#' },
                ],
            },
            {
                title: 'Legal',
                links: [
                    { text: 'Términos y Condiciones', url: '#' },
                    { text: 'Privacidad', url: '#' },
                    { text: 'Cookies', url: '#' },
                ],
            },
        ],
        footerDescription: 'La plataforma de e-commerce social para emprendedores y creadores de contenido.', 
        searchTitle: 'Encuentra lo que necesitas', 
        buttonBackgroundColor: '#007BFF',
        buttonTextColor: '#FFFFFF',  
        buttonBorderColor: '#0056b3',
        buttonText: 'Test Button', 
    });

    const menuItems = [
        { label: 'Inicio', onClick: () => console.log('Inicio clicked') },
        { label: 'Productos', onClick: () => console.log('Productos clicked') },
        { label: 'Sobre Nosotros', onClick: () => console.log('Sobre Nosotros clicked') },
        { label: 'Contacto', onClick: () => console.log('Contacto clicked') },
    ];

    return (
        <div>
            <CustomizableMenu
                items={menuItems}
                isOpen={isMenuOpen}
                onClose={() => setMenuOpen(false)}
                editableVariables={{
                    ...editableVariables,
                    onUpdate: (updatedVariables) =>
                        setEditableVariables({
                            ...editableVariables,
                            ...updatedVariables,
                            searchTitle: updatedVariables.searchTitle || editableVariables.searchTitle, 
                        }),
                }}
            />
            {/* Navbar */}
            <div
                className="w-full h-[60px] flex items-center font-space justify-between px-5"
                style={{ backgroundColor: editableVariables.navbarBackgroundColor }}
            >
                <button
                    onClick={() => setMenuOpen(true)}
                    className="text-gray-800 hover:text-gray-600"
                >
                    ☰
                </button>
                <div className="flex items-center gap-2">
                    <div
                        className="w-[40px] h-[40px] bg-white text-gray-800 rounded-full flex items-center justify-center font-bold"
                        style={{ color: editableVariables.textColor }}
                    >
                        MT
                    </div>
                    <span
                        className="text-lg font-semibold"
                        style={{
                            fontFamily: editableVariables.fontType,
                            color: editableVariables.textColor,
                        }}
                    >
                        {editableVariables.title}
                    </span>
                </div>
                <div className="flex gap-5">
                    {editableVariables.navbarLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="hover:underline"
                            style={{ color: editableVariables.textColor }}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
                <div>
                    <FaShoppingCart size={24} style={{ color: editableVariables.textColor }} /> {/* Apply textColor */}
                </div>
            </div>

            {/* Main Background */}
            <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
                {/* Hero Section */}
                <div
                    className="w-full h-[400px] flex items-center justify-center text-4xl font-bold mb-5"
                    style={{
                        backgroundImage: `url(${editableVariables.placeholderHeroImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: editableVariables.textColor,
                    }}
                >
                  
                </div>

                {/* Filters Section */}
                <div className="px-5 max-w-[1200px] mx-auto mb-5">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex-grow min-w-[300px]">
                            <InputDefault
                                placeholder="Buscar productos..."
                                icon={<FaSearch color="#888" />}
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="w-[200px]">
                                <SelectDefault
                                    options={editableVariables.filterOptions.categories}
                                    placeholder="Categorías"
                                />
                            </div>
                            <div className="w-[150px]">
                                <SelectDefault
                                    options={editableVariables.filterOptions.prices}
                                    placeholder="Precio"
                                />
                            </div>
                            <div className="w-[180px]">
                                <SelectDefault
                                    options={editableVariables.filterOptions.sorting}
                                    placeholder="Ordenar por"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Centered Title */}
                    <h2 className="text-center text-2xl font-semibold mt-5" style={{ color: editableVariables.textColor }}>
                        {editableVariables.searchTitle}
                    </h2>
                </div>

                {/* Products Section */}
                <div className="flex flex-wrap justify-center gap-5 p-5">
                    {[1, 2, 3, 4].map((i) => (
                        <Card
                            key={i}
                            imageSrc={`${editableVariables.placeholderCardImage}?text=Producto+${i}`}
                            onClick={() => console.log(`Producto ${i} seleccionado`)}
                        />
                    ))}
                </div>
                <div className="p-5">
                    <DesignButton
                        variant="primary" 
                        customBackgroundColor={editableVariables.buttonBackgroundColor}
                        customTextColor={editableVariables.buttonTextColor}
                        customBorderColor={editableVariables.buttonBorderColor}
                        onClick={() => console.log('Test button clicked')}
                    >
                        {editableVariables.buttonText} 
                    </DesignButton>
                </div>
            </div>
            <FooterCustom
                backgroundColor={editableVariables.footerBackgroundColor}
                textColor={editableVariables.footerTextColor}
                footerSections={editableVariables.footerSections}
                footerDescription={editableVariables.footerDescription}
            />
        </div>
    );
};

export default FirstTemplate;