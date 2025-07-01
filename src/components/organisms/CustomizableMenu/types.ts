export interface MenuItem {
    label: string;
    onClick: () => void;
}

// Variables generales para cualquier layout
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
    buttonText?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonBorderColor?: string;
    // Additional fields for AI chat integration
    storeName?: string;
    storeDescription?: string;
    storeSlogan?: string;
    primaryColor?: string;
    secondaryColor?: string;
    footerElements?: { title: string; content: string }[];
    logoUrl?: string;
}

// Variables específicas para FirstLayout
export interface FirstLayoutEditableVariables extends EditableVariables {
    navbarTitle?: string;
    navbarTitleColor?: string;
    navbarLinksColor?: string;
    navbarIconsColor?: string;
    heroTitle?: string;
    heroTitleColor?: string;
    categoryTitle?: string;
    categoryTitleColor?: string;
    featuredProductsTitle?: string;
    featuredProductsTitleColor?: string;
    purpleSectionTitle?: string;
    purpleSectionTitleColor?: string;
    newsletterTitle?: string;
    newsletterTitleColor?: string;
    footerTitle?: string;
    footerTitleColor?: string;
    button2Text?: string;
    button2BackgroundColor?: string;
    button2TextColor?: string;
    heroBackgroundColor?: string;
    categorySectionTitle?: string;
    heroDescription?: string;
    featuredProductsCardButtonText?: string;
    featuredProductsCardButtonColor?: string;
    featuredProductsCardButtonTextColor?: string;
    accentColor?: string;
}

export interface CustomizableMenuProps {
    items: MenuItem[];
    isOpen: boolean;
    onClose: () => void;
    editableVariables: EditableVariables;
}
