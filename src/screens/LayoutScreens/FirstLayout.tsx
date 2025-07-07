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
import { useLocation, useParams } from 'react-router-dom';

const FirstLayout: React.FC = () => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  const setEditableVariables = useFirstLayoutStore(state => state.setEditableVariables);
  const updateEditableVariables = useFirstLayoutStore(state => state.updateEditableVariables);
  const shop = useShopStore(state => state.shop);
  const getShop = useShopStore(state => state.getShop);
  const location = useLocation();
  const { shopId } = useParams<{ shopId: string }>();

  const fetchProducts = useAuthStore(state => state.fetchProducts);
  const fetchProductsByShop = useAuthStore(state => state.fetchProductsByShop);
  const createShop = useShopStore(state => state.createShop);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [aiChatInitialVars, setAiChatInitialVars] = useState({});

  // Detectar si está en un iframe (previsualización) o en modo visualización (view=true en la URL)
  const isPreview = typeof window !== 'undefined' && window.self !== window.top;
  const urlParams = new URLSearchParams(location.search);
  const isViewMode = urlParams.get('view') === 'true';
  const isInShopView = !!shopId; // Detectar si estamos en ShopView

  // No mostrar el chat AI si estamos en preview, en modo visualización, o en ShopView
  const shouldShowChat = !isPreview && !isViewMode && !isInShopView;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        let prods: any[] = [];
        
        // Si estamos en ShopView, usar fetchProductsByShop
        if (isInShopView && shop) {
          console.log('FirstLayout: En ShopView, obteniendo productos de la tienda:', shop._id);
          prods = await fetchProductsByShop(shop._id);
        } else {
          // Si estamos en la propia tienda, usar fetchProducts
          console.log('FirstLayout: En tienda propia, obteniendo productos');
          prods = await fetchProducts();
          // Filter out inactive products (el backend ya filtra los activos cuando usamos fetchProductsByShop)
          prods = prods.filter((product: any) => 
            !product.estado || product.estado === 'Activo'
          );
        }
        
        setFeaturedProducts(prods);
        console.log('FirstLayout: Productos cargados:', prods.length);
      } catch (err) {
        console.error('FirstLayout: Error al cargar productos:', err);
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    // Solo cargar productos si tenemos los datos necesarios
    if (isInShopView && shop) {
      loadProducts();
    } else if (!isInShopView) {
      loadProducts();
    }
  }, [fetchProducts, fetchProductsByShop, isInShopView, shop]);

  useEffect(() => {
    const loadShopData = async () => {
      try {
        // Si estamos en ShopView, no cargar datos propios
        if (isInShopView) {
          console.log('FirstLayout: En modo ShopView, usando datos de ShopView');
          return;
        }
        
        // Solo cargar datos propios si NO estamos en ShopView
        if (!shop) {
          await getShop();
        }
      } catch (err) {
        console.error('Error loading shop data:', err);
      }
    };
    loadShopData();
  }, [shop, getShop, isInShopView]);

  // Cargar template después de que el shop esté cargado
  useEffect(() => {
    const getTemplate = async () => {
      try {
        // Si estamos en ShopView, no cargar template propio
        if (isInShopView) {
          console.log('FirstLayout: En modo ShopView, no cargando template propio');
          return;
        }
        
        const response = await fetchShopTemplate();
        console.log('Template response:', response);
        if (response && response.data && response.data.templateUpdate) {
          const templateData = response.data.templateUpdate;
          
          if (shop?.imageUrl && !templateData.logoUrl) {
            templateData.logoUrl = shop.imageUrl;
          }
          
          console.log('Loading template data:', templateData);
          setEditableVariables(templateData);
          setAiChatInitialVars(templateData);
        } else {
          console.log('No template found, using defaults with shop logo');
          const initialVars = shop?.imageUrl ? { logoUrl: shop.imageUrl } : {};
          setAiChatInitialVars(initialVars);
          if (shop?.imageUrl) {
            updateEditableVariables({ logoUrl: shop.imageUrl });
          }
        }
      } catch (err) {
        console.error('Error loading template:', err);
        if (shop?.imageUrl) {
          updateEditableVariables({ logoUrl: shop.imageUrl });
          setAiChatInitialVars({ logoUrl: shop.imageUrl });
        }
      }
    };
    
    // Solo ejecutar si tenemos shop Y no estamos en ShopView
    if (shop && !isInShopView) {
      getTemplate();
    }
  }, [shop, setEditableVariables, updateEditableVariables, isInShopView]);

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
