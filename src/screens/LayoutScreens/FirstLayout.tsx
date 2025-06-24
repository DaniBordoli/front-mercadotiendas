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

const FirstLayout: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const setEditableVariables = useFirstLayoutStore(state => state.setEditableVariables);
  const updateEditableVariables = useFirstLayoutStore(state => state.updateEditableVariables);
  const shop = useShopStore(state => state.shop);

  const fetchProducts = useAuthStore(state => state.fetchProducts);
  const createShop = useShopStore(state => state.createShop);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [aiChatInitialVars, setAiChatInitialVars] = useState({});

  // Detectar si está en un iframe (previsualización)
  const isPreview = typeof window !== 'undefined' && window.self !== window.top;

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
        title={editableVariables.title}
        backgroundColor={editableVariables.navbarBackgroundColor}
        textColor={editableVariables.textColor}
        fontType={editableVariables.fontType}
      />
      <HeroSection
        title={editableVariables.searchTitle}
        image={editableVariables.placeholderHeroImage}
        buttonText={editableVariables.buttonText}
        textColor={editableVariables.textColor}
        buttonColor={editableVariables.buttonBackgroundColor}
        buttonTextColor={editableVariables.buttonTextColor}
        button2Text={editableVariables.button2Text}
        button2Color={editableVariables.button2BackgroundColor}
        button2TextColor={editableVariables.button2TextColor}
        backgroundColor={editableVariables.heroBackgroundColor}
        description={editableVariables.heroDescription}
      />
      <CategorySection
        title={editableVariables.categorySectionTitle}
        backgroundColor={editableVariables.mainBackgroundColor}
        titleColor={editableVariables.textColor}
      />
      <FeaturedProducts
        cardImage={editableVariables.placeholderCardImage}
        title={editableVariables.featuredProductsTitle}
        backgroundColor={editableVariables.heroBackgroundColor}
        cardButtonText={editableVariables.featuredProductsCardButtonText}
        cardButtonColor={editableVariables.featuredProductsCardButtonColor}
        cardButtonTextColor={editableVariables.featuredProductsCardButtonTextColor}
        titleColor={editableVariables.textColor}
        products={!loadingProducts && featuredProducts.length > 0 ? featuredProducts : []}
      />
      <PurpleSection
        titleColor={editableVariables.textColor}
        buttonColor={editableVariables.buttonBackgroundColor}
        buttonTextColor={editableVariables.buttonTextColor}
        backgroundColor={editableVariables.primaryColor}
      />
      <NewsletterSection
        backgroundColor={editableVariables.mainBackgroundColor}
        titleColor={editableVariables.textColor}
      />
      <Footer
        backgroundColor={editableVariables.footerBackgroundColor}
        textColor={editableVariables.footerTextColor}
        footerDescription={editableVariables.footerDescription}
      />
      {/* Solo mostrar AIChat si no es previsualización */}
      {!isPreview && (
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
