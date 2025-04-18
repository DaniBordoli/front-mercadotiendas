import React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';

interface CardProps {
  imageSrc?: string;
}

export const Card: React.FC<CardProps> = ({ imageSrc }) => {
  return (
    <div className="card ml-6 w-84 h-96 bg-white rounded-lg shadow-sm overflow-hidden">
      <figure className="m-0 w-full h-60">
        <img
          className="w-full h-full object-cover"
          src={imageSrc || ""}
          alt="Generic placeholder"
        />
      </figure>
      <div className="card-body p-4 flex flex-col items-center">
        <h5 
          style={{ color: colors.mediumGray }}
          className="card-title mb-2.5 mt-5 font-light text-left font-space self-start w-full">Tecnología</h5>
        <div className="flex justify-center flex-grow items-center mt-5">
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
  return (
    <div className="text-center mt-8">
      
      <div className="flex justify-center flex-wrap ">
        {cardData.map((card, index) => (
          <Card key={index} imageSrc={card.imageSrc} />
        ))}
      </div>
    </div>
  );
};
