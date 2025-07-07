import React, { useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaTiktok, FaYoutube } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { FaPhone } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import { useShopStore } from '../../stores/slices/shopStore';
import { useAuthStore } from '../../stores';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';
import { useSocialMedia } from '../../hooks/useSocialMedia';

interface FooterProps {
  footerTitle?: string;
  footerTitleColor?: string;
  backgroundColor?: string;
  textColor?: string;
  footerDescription?: string;
}

const Footer: React.FC<FooterProps> = ({
  footerTitle = 'ShopSmart',
  footerTitleColor = '#FFFFFF',
  backgroundColor = '#0B1120',
  textColor = '#FFFFFF',
  footerDescription = 'Tu destino integral para moda y accesorios.',
}) => {
  const navigate = useNavigate();
  const { shopId } = useParams<{ shopId: string }>();
  const { shop, getShop, setShop } = useShopStore();
  const { isAuthenticated, user } = useAuthStore();
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  
  // Usar shopId correcto dependiendo del contexto
  const currentShopId = shopId && shop ? shop._id : undefined;
  const { getSocialLinks } = useSocialMedia(currentShopId);

  useEffect(() => {
    if (user?.shop && !shop) {
      setShop(user.shop);
      return; 
    }
    
    if (isAuthenticated && !shop && !user?.shop) {
      getShop().catch(() => {
        // Error silencioso, el footer puede funcionar sin datos de la tienda
      });
    }
  }, [isAuthenticated, shop, getShop, user?.shop, setShop]);

  // Obtener información dinámica de la tienda
  const shopFromStore = shop?.name;
  const shopFromUser = user?.shop?.name;
  const shopFromTemplate = editableVariables.navbarTitle || editableVariables.title;
  const displayTitle = shopFromStore || shopFromUser || shopFromTemplate || footerTitle;

  // Información de contacto de la tienda
  const shopAddress = shop?.address || "123 Calle de la Moda, Nueva York, NY 10001";
  const shopPhone = shop?.shopPhone || "+1 234 567 8900";
  const shopEmail = shop?.contactEmail || "info@shopsmart.com";
  const shopDescription = editableVariables.footerDescription || footerDescription;

  // Obtener links sociales dinámicos
  const socialLinks = getSocialLinks();

  // Usar colores dinámicos de la IA o valores por defecto
  const dynamicTextColor = editableVariables.footerTextColor || textColor;
  const dynamicTitleColor = editableVariables.footerTitleColor || footerTitleColor;

  // Función para renderizar el ícono correcto según la plataforma
  const renderSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'FaInstagram':
        return <FaInstagram className="text-xl cursor-pointer hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }} />;
      case 'FaFacebook':
        return <FaFacebook className="text-xl cursor-pointer hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }} />;
      case 'FaWhatsapp':
        return <FaWhatsapp className="text-xl cursor-pointer hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }} />;
      case 'FaTiktok':
        return <FaTiktok className="text-xl cursor-pointer hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }} />;
      case 'FaYoutube':
        return <FaYoutube className="text-xl cursor-pointer hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }} />;
      default:
        return <FaInstagram className="text-xl cursor-pointer hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }} />;
    }
  };

  return (
    <footer className="py-12" style={{ backgroundColor, color: dynamicTextColor }}>
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: dynamicTitleColor }}>{displayTitle}</h3>
          <p className="text-sm mb-4" style={{ color: dynamicTextColor }}>{shopDescription}</p>
          <div className="flex gap-4">
            {socialLinks.length > 0 ? (
              socialLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-75 transition-opacity duration-200"
                  title={`Visitar nuestro ${link.platform}`}
                >
                  {renderSocialIcon(link.icon)}
                </a>
              ))
            ) : (
              // Iconos por defecto si no hay links configurados
              <>
                <FaFacebook className="text-xl cursor-pointer hover:opacity-75 transition-opacity opacity-50" style={{ color: dynamicTextColor }} />
                <FaInstagram className="text-xl cursor-pointer hover:opacity-75 transition-opacity opacity-50" style={{ color: dynamicTextColor }} />
                <FaTwitter className="text-xl cursor-pointer hover:opacity-75 transition-opacity opacity-50" style={{ color: dynamicTextColor }} />
              </>
            )}
          </div>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: dynamicTitleColor }}>Enlaces rápidos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <span
                className="hover:opacity-75 cursor-pointer transition-opacity"
                style={{ color: dynamicTextColor }}
                onClick={() => navigate(shopId ? `/shop/${shopId}/about` : '/first-layout/aboutus-layout')}
              >
                Sobre nosotros
              </span>
            </li>
            <li>
              <span
                className="hover:opacity-75 cursor-pointer transition-opacity"
                style={{ color: dynamicTextColor }}
                onClick={() => navigate(shopId ? `/shop/${shopId}/contact` : '/first-layout/contact-layout')}
              >
                Contacto
              </span>
            </li>
            <li><a href="#blog" className="hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }}>Blog</a></li>
            <li><a href="#faqs" className="hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }}>Preguntas frecuentes</a></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: dynamicTitleColor }}>Servicio al cliente</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#shipping" className="hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }}>Política de envíos</a></li>
            <li><a href="#returns" className="hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }}>Devoluciones y cambios</a></li>
            <li><a href="#size-guide" className="hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }}>Guía de tallas</a></li>
            <li><a href="#terms" className="hover:opacity-75 transition-opacity" style={{ color: dynamicTextColor }}>Términos y condiciones</a></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: dynamicTitleColor }}>Información de contacto</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2" style={{ color: dynamicTextColor }}>
              <HiLocationMarker className="text-xl" style={{ color: dynamicTextColor }} /> {shopAddress}
            </li>
            <li className="flex items-center gap-2" style={{ color: dynamicTextColor }}>
              <FaPhone className="text-xl" style={{ color: dynamicTextColor }} /> {shopPhone}
            </li>
            <li className="flex items-center gap-2" style={{ color: dynamicTextColor }}>
              <IoMail className="text-xl" style={{ color: dynamicTextColor }} /> {shopEmail}
            </li>
          </ul>
        </div>
      </div>
      <hr className="border-t my-8 mx-auto w-10/12" style={{ borderColor: dynamicTextColor, opacity: 0.3 }} />
      <div className="mt-8 text-center text-sm" style={{ color: dynamicTextColor }}>
        © 2025 {displayTitle}. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
