import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import HeroSection from '../../components/FirstLayoutComponents/HeroSection';
import CategorySection from '../../components/FirstLayoutComponents/CategorySection';
import FeaturedProducts from '../../components/FirstLayoutComponents/FeaturedProducts';
import PurpleSection from '../../components/FirstLayoutComponents/PurpleSection';
import NewsletterSection from '../../components/FirstLayoutComponents/NewsletterSection';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { AIChat } from '../../components/organisms/AIChat/AIChat';
import { useAuthStore } from '../../stores';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useShopStore } from '../../stores/slices/shopStore';
import { FirstLayoutEditableVariables } from '../../components/organisms/CustomizableMenu/types';
import { fetchShopTemplate } from '../../services/api';
import { useLocation } from 'react-router-dom';

const FirstLayout: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const setEditableVariables = useFirstLayoutStore(state => state.setEditableVariables);
  const updateEditableVariables = useFirstLayoutStore(state => state.updateEditableVariables);
  const shop = useShopStore(state => state.shop);
  const getShop = useShopStore(state => state.getShop);
  const location = useLocation();

  const fetchProducts = useAuthStore(state => state.fetchProducts);
  const createShop = useShopStore(state => state.createShop);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [aiChatInitialVars, setAiChatInitialVars] = useState({});

  // Detectar si está en un iframe (previsualización) o en modo visualización (view=true en la URL)
  const isPreview = typeof window !== 'undefined' && window.self !== window.top;
  const urlParams = new URLSearchParams(location.search);
  const isViewMode = urlParams.get('view') === 'true';

  // No mostrar el chat AI si estamos en preview o en modo visualización
  const shouldShowChat = !isPreview && !isViewMode;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const prods = await fetchProducts();
        setFeaturedProducts(prods);
      } catch (err) {
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const getTemplate = async () => {
      try {
        const data = await fetchShopTemplate();
        if (data && data.templateUpdate) {
          setEditableVariables(data.templateUpdate);
        }
      } catch (err) {
       
      }
    };
    getTemplate();
  }, [setEditableVariables]);

  // Cargar datos del shop y aplicar colores
  useEffect(() => {
    const loadShopData = async () => {
      try {
        if (!shop) {
          await getShop();
        }
      } catch (err) {
        console.error('Error loading shop data:', err);
      }
    };
    loadShopData();
  }, [shop, getShop]);

  // Aplicar colores del shop al template cuando estén disponibles
  useEffect(() => {
    if (shop && (shop.primaryColor || shop.secondaryColor)) {
      const colorUpdates: Partial<FirstLayoutEditableVariables> = {};
      
      if (shop.primaryColor) {
        colorUpdates.primaryColor = shop.primaryColor;
        // Navbar usa el color principal
        colorUpdates.navbarBackgroundColor = shop.primaryColor;
        colorUpdates.navbarTitleColor = '#FFFFFF';
        // Hero section usa el color principal como background
        colorUpdates.heroBackgroundColor = shop.primaryColor;
      }
      
      if (shop.secondaryColor) {
        colorUpdates.secondaryColor = shop.secondaryColor;
        // Los botones usan el color secundario para contrastar con el fondo principal
        colorUpdates.buttonBackgroundColor = shop.secondaryColor;
        colorUpdates.buttonTextColor = '#FFFFFF';
        colorUpdates.featuredProductsCardButtonColor = shop.secondaryColor;
        colorUpdates.featuredProductsCardButtonTextColor = '#FFFFFF';
      }
      
      // Si solo hay color principal, usar blanco para los botones
      if (shop.primaryColor && !shop.secondaryColor) {
        colorUpdates.buttonBackgroundColor = '#FFFFFF';
        colorUpdates.buttonTextColor = shop.primaryColor;
        colorUpdates.featuredProductsCardButtonColor = '#FFFFFF';
        colorUpdates.featuredProductsCardButtonTextColor = shop.primaryColor;
      }
      
      if (Object.keys(colorUpdates).length > 0) {
        updateEditableVariables(colorUpdates);
      }
    }
  }, [shop, updateEditableVariables]);

  const handleTemplateChanges = (changes: Partial<FirstLayoutEditableVariables>) => {
    updateEditableVariables(changes);
  };

  const handleChatComplete = async (shopData: any) => {
    try {
      await createShop(shopData);
    } catch (error) {
    }
  };

  return (
    <div style={{ backgroundColor: editableVariables.mainBackgroundColor }}>
      <NavBar
        navbarLinks={editableVariables.navbarLinks}
        navbarTitle={editableVariables.navbarTitle}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.navbarTitleColor || editableVariables.textColor}
        fontType={editableVariables.fontType}
        logoUrl={editableVariables.logoUrl}
      />
      <HeroSection
        heroTitle={editableVariables.heroTitle}
        heroTitleColor={editableVariables.heroTitleColor}
        image={editableVariables.placeholderHeroImage}
        buttonText={editableVariables.buttonText}
        textColor={editableVariables.heroTitleColor || editableVariables.textColor}
        buttonColor={editableVariables.buttonBackgroundColor}
        buttonTextColor={editableVariables.buttonTextColor}
        button2Text={editableVariables.button2Text}
        button2Color={editableVariables.button2BackgroundColor}
        button2TextColor={editableVariables.button2TextColor}
        backgroundColor={editableVariables.heroBackgroundColor}
        description={editableVariables.heroDescription}
      />
      <CategorySection
        categoryTitle={editableVariables.categoryTitle}
        categoryTitleColor={editableVariables.categoryTitleColor}
        backgroundColor={editableVariables.mainBackgroundColor}
        titleColor={editableVariables.categoryTitleColor || editableVariables.textColor}
      />
      <FeaturedProducts
        cardImage={editableVariables.placeholderCardImage}
        featuredProductsTitle={editableVariables.featuredProductsTitle}
        featuredProductsTitleColor={editableVariables.featuredProductsTitleColor}
        backgroundColor={editableVariables.heroBackgroundColor}
        cardButtonText={editableVariables.featuredProductsCardButtonText}
        cardButtonColor={editableVariables.featuredProductsCardButtonColor}
        cardButtonTextColor={editableVariables.featuredProductsCardButtonTextColor}
        titleColor={editableVariables.featuredProductsTitleColor || editableVariables.textColor}
        products={!loadingProducts && featuredProducts.length > 0 ? featuredProducts : []}
      />
      <PurpleSection
        purpleSectionTitle={editableVariables.purpleSectionTitle}
        titleColor={editableVariables.purpleSectionTitleColor || editableVariables.textColor}
        buttonColor={editableVariables.buttonBackgroundColor}
        buttonTextColor={editableVariables.buttonTextColor}
        backgroundColor={editableVariables.primaryColor}
      />
      <NewsletterSection
        newsletterTitle={editableVariables.newsletterTitle}
        titleColor={editableVariables.newsletterTitleColor || editableVariables.textColor}
        backgroundColor={editableVariables.mainBackgroundColor}
      />
      <Footer
        footerTitle={editableVariables.footerTitle}
        footerTitleColor={editableVariables.footerTitleColor}
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTitleColor || editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
      {/* Solo mostrar AIChat si no es previsualización */}
      {shouldShowChat && (
        <AIChat
          onApplyTemplateChanges={handleTemplateChanges}
          initialVariables={aiChatInitialVars}
          onChatComplete={handleChatComplete}
        />
      )}
    </div>
  );
};

export default FirstLayout;
