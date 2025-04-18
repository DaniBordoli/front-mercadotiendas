import React from 'react';
import { colors } from '../../../design/colors';
import { MdOutlinePhoneIphone } from "react-icons/md";
import { FaShirt, FaDumbbell } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { WideCard } from '../../molecules/WideCard';

const categories = [
  {
    title: "TEXTILES",
    mainImage: "https://placehold.co/300x200",
  },
  {
    title: "DEPORTES",
    mainImage: "https://placehold.co/300x200",
  },
  {
    title: "CELULARES",
    mainImage: "https://placehold.co/300x200",
  },
];

export const CategoryCards: React.FC = () => {
  const categoryIcons = [
    { icon: <MdOutlinePhoneIphone size={24} />, bgColor: colors.primaryRed },
    { icon: <FaShirt size={24} />, bgColor: colors.accentTeal },
    { icon: <IoMdHome size={24} />, bgColor: colors.primaryRed },
    { icon: <FaDumbbell size={24} />, bgColor: colors.accentTeal },
  ];

  return (
    <div className="w-full h-[250px] bg-[#F8F8F8] rounded-lg overflow-hidden">
      <h2 
        className="text-xl mt-8 font-space ml-8 text-left pl-32 mb-4"
        style={{ color: colors.darkGray }}
      >
        Categorías Populares
      </h2>
      
      <div className="flex justify-center items-center gap-6 mt-4">
        {categoryIcons.map((item, index) => (
          <div 
            key={index}
            className="w-96 h-36 bg-white rounded-lg shadow-sm flex items-center justify-center"
          >
           
            <div className="relative flex items-center justify-center">
              <div 
                className="absolute w-16 h-16 rounded-full"
                style={{ 
                  backgroundColor: item.bgColor,
                  opacity: 0.1
                }}
              ></div>
            
              <div 
                className="relative z-10 flex items-center justify-center w-16 h-16"
                style={{ color: item.bgColor }}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
