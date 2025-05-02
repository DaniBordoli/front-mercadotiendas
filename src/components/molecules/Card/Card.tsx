import React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';
import '../../../styles/responsive.css';

interface CardProps {
  imageSrc?: string;
  title?: string;
  price?: number;
  category?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  imageSrc, 
  title = "Título no disponible",
  price,
  category = "General",
  onClick 
}) => {
  const handleCardClick = () => {
    if (onClick) onClick();
    else console.log('Card clicked');
  };

  const formattedPrice = price !== undefined 
    ? `$${price.toLocaleString()}`
    : "Precio no disponible";

  return (
    <div 
      className="card ml-6 w-84 h-96 bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow flex flex-col"
      onClick={handleCardClick}
    >
      <figure className="m-0 w-full h-60 flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={imageSrc || "https://placehold.co/600x400?text=No+Image"}
          alt={title}
        />
      </figure>
      <div className="card-body p-4 flex flex-col items-start flex-grow">
        <p 
          style={{ color: colors.mediumGray }}
          className="text-xs font-light mb-1">{category}</p>
        <h5 
          className="card-title mb-1 font-semibold text-left text-base line-clamp-2">
          {title}
        </h5>
        <p className="text-lg font-bold mb-2">{formattedPrice}</p>
        
        <div className="flex justify-center w-full mt-auto">
          <DesignButton 
          variant="primary">
            Comprar
          </DesignButton>
        </div>
      </div>
    </div>
  );
};

const cardData = [
  { imageSrc: "https://placehold.co/600x400?text=Card+1" },
  { imageSrc: "https://placehold.co/600x400?text=Card+2" },
  { imageSrc: "https://placehold.co/600x400?text=Card+3" },
  { imageSrc: "https://placehold.co/600x400?text=Card+4" },
];

export const CardList: React.FC = () => {
  const handleCardClick = (index: number) => {
    console.log(`Card ${index + 1} clicked`);
   
  };

  return (
    <div className="text-center mt-8 px-4">
      <div className="flex justify-center flex-wrap gap-4">
        {cardData.map((card, index) => (
          <Card 
            key={index} 
            imageSrc={card.imageSrc} 
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};
