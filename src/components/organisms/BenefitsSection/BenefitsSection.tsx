import React from 'react';
import { colors } from '../../../design/colors';
import { FaGlobe, } from 'react-icons/fa';
import { AiFillShop } from "react-icons/ai";
import { HiMiniVideoCamera } from "react-icons/hi2";
import '../../../styles/responsive.css';

interface BenefitItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
}

const BenefitItem: React.FC<BenefitItemProps> = ({ icon, title, description, bgColor }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center mb-3">
        <div 
          className="absolute w-20 h-20 rounded-full" 
          style={{ 
            backgroundColor: bgColor,
            opacity: 0.1
          }}
        ></div>
        <div 
          className="relative z-10 flex items-center justify-center w-20 h-20 text-4xl" 
          style={{ color: bgColor }}
        >
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-space mb-2" style={{ color: colors.darkGray }}>
        {title}
      </h3>
      <p className="text-sm max-w-xs" style={{ color: colors.mediumGray }}>
        {description}
      </p>
    </div>
  );
};

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <AiFillShop/>,
      title: 'Fácil de Usar',
      description: 'Crea tu tienda en minutos con nuestras herramientas intuitivas',
      bgColor: colors.primaryRed
    },
    {
      icon: <HiMiniVideoCamera  />,
      title: 'Live Commerce',
      description: 'Vende en vivo y conecta con tu audiencia en tiempo real',
      bgColor: colors.accentTeal
    },
    {
      icon: <FaGlobe />,
      title: 'Alcance Global',
      description: 'Conecta con proveedores y clientes de todo el mundo',
      bgColor: colors.primaryRed
    }
  ];

  return (
    <div className="w-full py-8 md:py-10 lg:py-12 mt-10 bg-white benefits-container">
      <div className="container mx-auto px-4">
        <h2 
          className="text-xl md:text-2xl font-base font-space text-center mb-12 md:mb-16 lg:mb-20"
          style={{ color: colors.darkGray }}
        >
          ¿Por qué Mercado Tiendas?
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-16 lg:space-x-44">
          {benefits.map((benefit, index) => (
            <BenefitItem
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
              bgColor={benefit.bgColor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
