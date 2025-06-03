import React, { useState, useEffect } from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import HeroSection from '../../components/FirstLayoutComponents/HeroSection';
import CategorySection from '../../components/FirstLayoutComponents/CategorySection';
import FeaturedProducts from '../../components/FirstLayoutComponents/FeaturedProducts';
import PurpleSection from '../../components/FirstLayoutComponents/PurpleSection';
import NewsletterSection from '../../components/FirstLayoutComponents/NewsletterSection';
import Footer from '../../components/FirstLayoutComponents/Footer';
import { FirstLayoutEditableVariables } from '../../components/organisms/CustomizableMenu/types';
import { AIChat } from '../../components/organisms/AIChat/AIChat';
import { useAuthStore } from '../../stores';

const LOCAL_STORAGE_KEY = 'firstLayoutEditableVariables';

const defaultEditableVariables: FirstLayoutEditableVariables = {
  navbarLinks: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop-layout' },
    { label: 'Contact', href: '/contact-layout' },
  ],
  title: 'ShopSmart',
  fontType: 'Arial',
  placeholderHeroImage: 'https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=2141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  placeholderCardImage: 'https://placehold.co/300x400',
  textColor: '#000000',
  navbarBackgroundColor: '#FFFFFF',
  mainBackgroundColor: '#F8F9FA',
  filterOptions: {
    categories: [],
    prices: [],
    sorting: [],
  },
  footerBackgroundColor: '#0B1120',
  footerTextColor: '#FFFFFF',
  footerSections: [],
  footerDescription: 'Your one-stop destination for fashion and accessories.',
  searchTitle: 'Discover Your Style',
  buttonBackgroundColor: '#007BFF',
  buttonTextColor: '#FFFFFF',
  buttonBorderColor: '#0056b3',
  buttonText: 'Shop Now',
  button2Text: 'Learn More',
  button2BackgroundColor: '#FFFFFF',
  button2TextColor: '#1F2937',
  heroBackgroundColor: '#F9FAFB',
  featuredProductsTitle: 'Featured Products',
  categorySectionTitle: 'Shop by Category',
  primaryColor: '#007BFF',
  secondaryColor: '#93C5FD',
  footerElements: [],
  heroDescription: 'Shop the latest trends in fashion, accessories, and lifestyle products.',
  featuredProductsCardButtonText: 'Add to Cart',
  featuredProductsCardButtonColor: '#3B82F6',
  featuredProductsCardButtonTextColor: '#FFFFFF',
};

const FirstLayout: React.FC = () => {

  const [editableVariables, setEditableVariables] = useState<FirstLayoutEditableVariables>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultEditableVariables;
  });

  const fetchProducts = useAuthStore(state => state.fetchProducts);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(editableVariables));
  }, [editableVariables]);

  const handleTemplateChanges = (changes: Partial<FirstLayoutEditableVariables>) => {
    setEditableVariables(prev => ({
      ...prev,
      ...changes,
      filterOptions: changes.filterOptions
        ? { ...prev.filterOptions, ...changes.filterOptions }
        : prev.filterOptions,
    }));
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
      <AIChat
        onApplyTemplateChanges={handleTemplateChanges}
        initialVariables={editableVariables}
        onChatComplete={() => {}}
      />
    </div>
  );
};

export default FirstLayout;
