export interface MenuItem {
    label: string;
    onClick: () => void;
}

export interface EditableVariables {
    navbarLinks: { label: string; href: string }[];
    title: string;
    fontType: string;
    placeholderHeroImage: string; 
    placeholderCardImage: string; 
    textColor: string;
    navbarBackgroundColor: string; 
    mainBackgroundColor: string; 
    filterOptions: {
        categories: { value: string; label: string }[];
        prices: { value: string; label: string }[];
        sorting: { value: string; label: string }[];
    };
    onUpdate?: (updatedVariables: EditableVariables) => void;
    footerBackgroundColor?: string; 
    footerTextColor?: string; 
    footerSections?: { title: string; links: { text: string; url: string }[] }[];
    footerDescription?: string;
    searchTitle?: string; 
}

export interface CustomizableMenuProps {
    items: MenuItem[];
    isOpen: boolean;
    onClose: () => void;
    editableVariables: EditableVariables;
}
