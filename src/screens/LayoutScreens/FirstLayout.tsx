import React from 'react';
import NavBar from '../../components/FirstLayoutComponents/NavBar';
import HeroSection from '../../components/FirstLayoutComponents/HeroSection';
import CategorySection from '../../components/FirstLayoutComponents/CategorySection';
import FeaturedProducts from '../../components/FirstLayoutComponents/FeaturedProducts';
import PurpleSection from '../../components/FirstLayoutComponents/PurpleSection';
import NewsletterSection from '../../components/FirstLayoutComponents/NewsletterSection';
import Footer from '../../components/FirstLayoutComponents/Footer';

const FirstLayout: React.FC = () => {
  return (
    <div>
      <NavBar />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
      <PurpleSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default FirstLayout;
