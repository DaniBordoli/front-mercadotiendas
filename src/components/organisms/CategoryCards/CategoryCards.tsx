import React from 'react';
import { colors } from '../../../design/colors';
import { MdOutlinePhoneIphone } from "react-icons/md";
import { FaShirt, FaDumbbell } from "react-icons/fa6";
import { IoMdHome } from "react-icons/io";
import { WideCard } from '../../molecules/WideCard';
import '../../../styles/responsive.css';

const categories = [
  {
    title: "TEXTILES",
    mainImage: "https://placehold.co/300x200",
    icon: <FaShirt size={24} />,
    bgColor: colors.accentTeal
  },
  {
    title: "DEPORTES",
    mainImage: "https://placehold.co/300x200",
    icon: <FaDumbbell size={24} />,
    bgColor: colors.accentTeal
  },
  {
    title: "CELULARES",
    mainImage: "https://placehold.co/300x200",
    icon: <MdOutlinePhoneIphone size={24} />,
    bgColor: colors.primaryRed
  },
  {
    title: "HOGAR",
    mainImage: "https://placehold.co/300x200",
    icon: <IoMdHome size={24} />,
    bgColor: colors.primaryRed
  },
];

export const CategoryCards: React.FC = () => {
  const handleCategoryClick = (title: string) => {
    console.log(`Category clicked: ${title}`);
    
  };

  return (
    <div className="category-container w-full h-[250px] bg-[#F8F8F8] rounded-lg overflow-hidden">
      <h2 
        className="text-xl mt-8 font-space ml-8 text-left pl-8 md:pl-16 lg:pl-32 mb-4"
        style={{ color: colors.darkGray }}
      >
        Categorías Populares
      </h2>
      
      <div className="flex justify-center items-center gap-2 md:gap-4 lg:gap-6 mt-4 px-4">
        {categories.map((category, index) => (
          <div 
            key={index}
            className="category-card w-96 h-36 bg-white rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCategoryClick(category.title)}
          >
            <div className="relative flex items-center justify-center">
              <div 
                className="category-icon-container absolute w-16 h-16 rounded-full"
                style={{ 
                  backgroundColor: category.bgColor,
                  opacity: 0.1
                }}
              ></div>
            
              <div 
                className="relative z-10 flex items-center justify-center w-16 h-16"
                style={{ color: category.bgColor }}
              >
                {category.icon}
              </div>
            </div>
            <p className="mt-2 font-medium text-sm">{category.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
