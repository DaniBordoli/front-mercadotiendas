import React, { useMemo } from 'react';

interface CampaignImageProps {
  src?: string; // No usaremos esta prop por ahora
  alt: string;
  className?: string;
  campaignId?: string; // Opcional: ID de la campaña para seleccionar imagen consistentemente
}

/**
 * Componente para mostrar imágenes de campañas con imágenes por defecto
 * Por ahora, selecciona aleatoriamente entre varias imágenes por defecto
 */
export const CampaignImage: React.FC<CampaignImageProps> = ({ 
  alt, 
  className = "w-full h-full object-cover",
  campaignId
}) => {
  // Colección de imágenes por defecto para campañas (redes sociales e influencers)
  const defaultImages = [
    // Redes sociales e influencers
    'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?w=800&h=400&fit=crop&q=80', // Teléfono con Instagram
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop&q=80', // Persona tomando foto para redes
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=400&fit=crop&q=80'  // Teléfono con redes sociales
  ];
  
  // Seleccionar una imagen basada en el ID de la campaña o aleatoriamente
  const selectedImage = useMemo(() => {
    if (campaignId) {
      // Si hay un ID de campaña, usarlo para seleccionar una imagen consistente
      const index = Math.abs(campaignId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % defaultImages.length;
      return defaultImages[index];
    } else {
      // Si no hay ID, seleccionar aleatoriamente
      const randomIndex = Math.floor(Math.random() * defaultImages.length);
      return defaultImages[randomIndex];
    }
  }, [campaignId]);
  
  return (
    <img 
      src={selectedImage}
      alt={alt}
      className={className}
    />
  );
};

export default CampaignImage;
