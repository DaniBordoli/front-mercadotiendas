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

  // Cargar template después de que el shop esté cargado
  useEffect(() => {
    const getTemplate = async () => {
      try {
        const response = await fetchShopTemplate();
        console.log('Template response:', response); // Para debug
        if (response && response.data && response.data.templateUpdate) {
          // Solo cargar el template - los colores ya están en templateUpdate
          setEditableVariables(response.data.templateUpdate);
        }
      } catch (err) {
        console.error('Error loading template:', err);
      }
    };
    
    // Solo cargar el template si ya tenemos el shop cargado
    if (shop) {
      getTemplate();
    }
  }, [shop, setEditableVariables]);

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
        navbarTitleColor={editableVariables.navbarTitleColor}
        navbarLinksColor={editableVariables.navbarLinksColor}
        navbarIconsColor={editableVariables.navbarIconsColor}
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
