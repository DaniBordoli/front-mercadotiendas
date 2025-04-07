import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface CardProps {
  imageSrc?: string;
}

export const Card: React.FC<CardProps> = ({ imageSrc }) => {
  return (
    <div className="card ml-6 w-64 h-80 bg-white p-4 rounded-lg shadow-md">
      <figure>
        <img
          className="w-full"
          src={imageSrc || ""}
          alt="Generic placeholder"
        />
      </figure>
      <div className="card-body">
        <h5 className="card-title mb-2.5 font-bold">Apple Smart Watch</h5>
        <p className="mb-4 text-lg font-semibold text-gray-800">$ 71.000</p>
      </div>
    </div>
  );
};

const cardData = [
  { imageSrc: "https://placehold.co/600x400?text=Card+1" },
  { imageSrc: "https://placehold.co/600x400?text=Card+2" },
  { imageSrc: "https://placehold.co/600x400?text=Card+3" },
  { imageSrc: "https://placehold.co/600x400?text=Card+4" },
  { imageSrc: "https://placehold.co/600x400?text=Card+5" },
  { imageSrc: "https://placehold.co/600x400?text=Card+6" },
  { imageSrc: "https://placehold.co/600x400?text=Card+7" },
  { imageSrc: "https://placehold.co/600x400?text=Card+8" },
  { imageSrc: "https://placehold.co/600x400?text=Card+9" },
  { imageSrc: "https://placehold.co/600x400?text=Card+10" },
];

export const CardList: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const cardsPerPage = 4;

  const triggerFade = (callback: () => void) => {
    setIsFading(true);
    setTimeout(() => {
      callback();
      setIsFading(false);
    }, 300); 
  };

  const visibleCards = cardData.slice(currentIndex, currentIndex + cardsPerPage);

  const totalPages = Math.ceil(cardData.length / cardsPerPage);

  return (
    <div className="text-center mt-8">
      <div className="relative flex justify-center items-center space-x-6">
        <FaChevronLeft
          className="text-gray-700 cursor-pointer"
          onClick={() => triggerFade(() => setCurrentIndex(Math.max(0, currentIndex - cardsPerPage)))}
        />
        <div
          className={`flex justify-center flex-wrap transition-opacity duration-300 ${
            isFading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {visibleCards.map((card, index) => (
            <Card key={index} imageSrc={card.imageSrc} />
          ))}
        </div>
        <FaChevronRight
          className="text-gray-700 cursor-pointer"
          onClick={() => triggerFade(() => setCurrentIndex(Math.min(cardData.length - cardsPerPage, currentIndex + cardsPerPage)))}
        />
      </div>
    </div>
  );
};
