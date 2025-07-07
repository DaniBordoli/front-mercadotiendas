import { useState, useEffect } from 'react';
import { getShopSocial, ShopSocial } from '../stores/slices/authSlice';
import { useAuthStore } from '../stores';

export interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
  isActive: boolean;
}

export const useSocialMedia = (shopId?: string) => {
  const { user } = useAuthStore();
  const currentShopId = shopId || user?.shop?._id;
  const [socialData, setSocialData] = useState<ShopSocial>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentShopId) {
      setLoading(true);
      getShopSocial(currentShopId)
        .then(data => {
          if (data) setSocialData(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [currentShopId]);

  // Función para formatear usernames/URLs a enlaces completos
  const formatSocialLink = (platform: string, value: string): string => {
    if (!value) return '';
    
    // Limpiar el valor de caracteres especiales
    const cleanValue = value.replace(/[@\s]/g, '');
    
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${cleanValue}`;
      case 'facebook':
        // Si ya incluye facebook.com, usar tal como está
        if (cleanValue.includes('facebook.com')) {
          return cleanValue.startsWith('http') ? cleanValue : `https://${cleanValue}`;
        }
        return `https://facebook.com/${cleanValue}`;
      case 'whatsapp':
        // Limpiar número y crear enlace de WhatsApp
        const cleanNumber = cleanValue.replace(/[^\d]/g, '');
        return `https://wa.me/${cleanNumber}`;
      case 'tiktok':
        return `https://tiktok.com/@${cleanValue}`;
      case 'youtube':
        // Si ya incluye youtube.com, usar tal como está
        if (cleanValue.includes('youtube.com')) {
          return cleanValue.startsWith('http') ? cleanValue : `https://${cleanValue}`;
        }
        return `https://youtube.com/channel/${cleanValue}`;
      default:
        return value;
    }
  };

  // Generar array de enlaces activos
  const getSocialLinks = (): SocialMediaLink[] => {
    const links: SocialMediaLink[] = [];

    if (socialData.instagram) {
      links.push({
        platform: 'Instagram',
        url: formatSocialLink('instagram', socialData.instagram),
        icon: 'FaInstagram',
        isActive: true,
      });
    }

    if (socialData.facebook) {
      links.push({
        platform: 'Facebook',
        url: formatSocialLink('facebook', socialData.facebook),
        icon: 'FaFacebook',
        isActive: true,
      });
    }

    if (socialData.whatsapp) {
      links.push({
        platform: 'WhatsApp',
        url: formatSocialLink('whatsapp', socialData.whatsapp),
        icon: 'FaWhatsapp',
        isActive: true,
      });
    }

    if (socialData.tiktok) {
      links.push({
        platform: 'TikTok',
        url: formatSocialLink('tiktok', socialData.tiktok),
        icon: 'FaTiktok',
        isActive: true,
      });
    }

    if (socialData.youtube) {
      links.push({
        platform: 'YouTube',
        url: formatSocialLink('youtube', socialData.youtube),
        icon: 'FaYoutube',
        isActive: true,
      });
    }

    return links;
  };

  return {
    socialData,
    loading,
    getSocialLinks,
    formatSocialLink,
  };
};
