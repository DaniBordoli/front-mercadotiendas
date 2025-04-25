import React from 'react';
import { colors } from '../../../design/colors';
import { CustomizableMenuProps } from './types';

const CustomizableMenu: React.FC<CustomizableMenuProps> = ({ isOpen, onClose, editableVariables }) => {
    const [selectedSection, setSelectedSection] = React.useState<string>('Navbar');
    const [navbarLinks, setNavbarLinks] = React.useState(editableVariables.navbarLinks);
    const [title, setTitle] = React.useState(editableVariables.title);
    const [fontType, setFontType] = React.useState(editableVariables.fontType || 'Arial');
    const [placeholderHeroImage, setPlaceholderHeroImage] = React.useState(editableVariables.placeholderHeroImage || 'https://placehold.co/600x400');
    const [placeholderCardImage, setPlaceholderCardImage] = React.useState(editableVariables.placeholderCardImage || 'https://placehold.co/600x400');
    const [textColor, setTextColor] = React.useState(editableVariables.textColor || colors.baseTextColor);
    const [navbarBackgroundColor, setNavbarBackgroundColor] = React.useState(editableVariables.navbarBackgroundColor || colors.baseBackgroundColor);
    const [mainBackgroundColor, setMainBackgroundColor] = React.useState(editableVariables.mainBackgroundColor || colors.baseBackgroundColor);
    const [footerBackgroundColor, setFooterBackgroundColor] = React.useState(editableVariables.footerBackgroundColor || '#F8F8F8');
    const [footerTextColor, setFooterTextColor] = React.useState(editableVariables.footerTextColor || colors.mediumGray);
    const [footerSections, setFooterSections] = React.useState<{ title: string; links: { text: string; url: string }[] }[]>(editableVariables.footerSections || [
        {
            title: "Empresa",
            links: [
                { text: "Sobre Nosotros", url: "#" },
                { text: "Careers", url: "#" },
                { text: "Blog", url: "#" },
            ],
        },
        {
            title: "Legal",
            links: [
                { text: "Términos y Condiciones", url: "#" },
                { text: "Privacidad", url: "#" },
                { text: "Cookies", url: "#" },
            ],
        },
    ]);
    const [footerDescription, setFooterDescription] = React.useState<string>(editableVariables.footerDescription || "La plataforma de e-commerce social para emprendedores y creadores de contenido.");
    const [searchTitle, setSearchTitle] = React.useState(editableVariables.searchTitle || 'Encuentra lo que necesitas');

    const handleSave = () => {
        if (editableVariables.onUpdate) {
            editableVariables.onUpdate({
                ...editableVariables,
                searchTitle,
                navbarLinks,
                title,
                fontType,
                placeholderHeroImage,
                placeholderCardImage,
                textColor,
                navbarBackgroundColor,
                mainBackgroundColor,
                footerBackgroundColor,
                footerTextColor,
                footerSections,
                footerDescription,
                filterOptions: editableVariables.filterOptions,
            });
        }
        onClose();
    };

    const renderSection = () => {
        switch (selectedSection) {
            case 'Navbar':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Navbar Links:</label>
                        {navbarLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    value={link.label}
                                    onChange={(e) =>
                                        setNavbarLinks((prev) =>
                                            prev.map((l, i) => (i === index ? { ...l, label: e.target.value } : l))
                                        )
                                    }
                                    className="w-full border rounded px-2 py-1"
                                />
                            </div>
                        ))}
                        <label className="block text-sm font-medium mb-1 mt-4">Navbar Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                );
            case 'Title':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Search Title:</label>
                        <input
                            type="text"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                );
            case 'Font':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Font Type:</label>
                        <select
                            value={fontType}
                            onChange={(e) => setFontType(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        >
                            <option value="Arial">Arial</option>
                            <option value="Verdana">Verdana</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                        </select>
                    </div>
                );
            case 'Hero':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Hero Image URL:</label>
                        <input
                            type="text"
                            value={placeholderHeroImage}
                            onChange={(e) => setPlaceholderHeroImage(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                );
            case 'Cards':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Card Image URL:</label>
                        <input
                            type="text"
                            value={placeholderCardImage}
                            onChange={(e) => setPlaceholderCardImage(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        />
                    </div>
                );
            case 'Colors':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Background Color:</label>
                        <div className="flex gap-2">
                            {['#FFFFFF', '#F8F9FA', '#E9ECEF'].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded-full cursor-pointer border"
                                    style={{
                                        backgroundColor: color,
                                        border: mainBackgroundColor === color ? '2px solid #000' : '1px solid #ccc',
                                    }}
                                    onClick={() => setMainBackgroundColor(color)}
                                ></div>
                            ))}
                        </div>

                        <label className="block text-sm font-medium mb-1 mt-4">Text Color:</label>
                        <div className="flex gap-2">
                            {['#000000', '#555555', '#888888'].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded-full cursor-pointer border"
                                    style={{
                                        backgroundColor: color,
                                        border: textColor === color ? '2px solid #000' : '1px solid #ccc',
                                    }}
                                    onClick={() => setTextColor(color)}
                                ></div>
                            ))}
                        </div>

                        <label className="block text-sm font-medium mb-1 mt-4">Accent Color:</label>
                        <div className="flex gap-2">
                            {['#007BFF', '#28A745', '#FFC107'].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded-full cursor-pointer border"
                                    style={{
                                        backgroundColor: color,
                                        border: navbarBackgroundColor === color ? '2px solid #000' : '1px solid #ccc',
                                    }}
                                    onClick={() => setNavbarBackgroundColor(color)}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 'Footer':
                return (
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Footer Background Color:</label>
                        <div className="flex gap-2">
                            {['#F8F8F8', '#E9ECEF', '#D6D8DB', '#FFFFFF'].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded-full cursor-pointer border"
                                    style={{
                                        backgroundColor: color,
                                        border: footerBackgroundColor === color ? '2px solid #000' : '1px solid #ccc',
                                    }}
                                    onClick={() => setFooterBackgroundColor(color)}
                                ></div>
                            ))}
                        </div>

                        <label className="block text-sm font-medium mb-1 mt-4">Footer Text Color:</label>
                        <div className="flex gap-2">
                            {['#000000', '#555555', '#888888', '#FFFFFF'].map((color) => (
                                <div
                                    key={color}
                                    className="w-6 h-6 rounded-full cursor-pointer border"
                                    style={{
                                        backgroundColor: color,
                                        border: footerTextColor === color ? '2px solid #000' : '1px solid #ccc',
                                    }}
                                    onClick={() => setFooterTextColor(color)}
                                ></div>
                            ))}
                        </div>

                        <label className="block text-sm font-medium mb-1 mt-4">Footer Description:</label>
                        <textarea
                            value={footerDescription}
                            onChange={(e) => setFooterDescription(e.target.value)}
                            className="w-full border rounded px-2 py-1"
                        />
                        <label className="block text-sm font-medium mb-1 mt-4">Footer Sections:</label>
                        {footerSections.map((section, index) => (
                            <div key={index} className="mb-2">
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={(e) =>
                                        setFooterSections((prev) =>
                                            prev.map((s, i) => (i === index ? { ...s, title: e.target.value } : s))
                                        )
                                    }
                                    className="w-full border rounded px-2 py-1 mb-1"
                                    placeholder="Section Title"
                                />
                                {section.links.map((link, linkIndex) => (
                                    <div key={linkIndex} className="flex items-center gap-2 mb-1">
                                        <input
                                            type="text"
                                            value={link.text}
                                            onChange={(e) =>
                                                setFooterSections((prev) =>
                                                    prev.map((s, i) =>
                                                        i === index
                                                            ? {
                                                                  ...s,
                                                                  links: s.links.map((l, li) =>
                                                                      li === linkIndex ? { ...l, text: e.target.value } : l
                                                                  ),
                                                              }
                                                            : s
                                                    )
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                            placeholder="Link Text"
                                        />
                                        <input
                                            type="text"
                                            value={link.url}
                                            onChange={(e) =>
                                                setFooterSections((prev) =>
                                                    prev.map((s, i) =>
                                                        i === index
                                                            ? {
                                                                  ...s,
                                                                  links: s.links.map((l, li) =>
                                                                      li === linkIndex ? { ...l, url: e.target.value } : l
                                                                  ),
                                                              }
                                                            : s
                                                    )
                                                )
                                            }
                                            className="w-full border rounded px-2 py-1"
                                            placeholder="Link URL"
                                        />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 h-full bg-white shadow-lg transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 z-50`}
            style={{ width: '300px' }}
        >
            <div className="p-4 border-b flex justify-between items-center">
                <span className="font-bold text-lg">Edit Template</span>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                    X
                </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                <label className="block text-sm font-medium mb-1">Select Section:</label>
                <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full border rounded px-2 py-1"
                >
                    <option value="Navbar">Navbar</option>
                    <option value="Title">Title</option>
                    <option value="Font">Font</option>
                    <option value="Hero">Hero Section</option>
                    <option value="Cards">Cards</option>
                    <option value="Colors">Colors</option>
                    <option value="Footer">Footer</option>
                </select>
                {renderSection()}
                <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                    Save
                </button>
            </div>
        </div>
    );
};

export default CustomizableMenu;
