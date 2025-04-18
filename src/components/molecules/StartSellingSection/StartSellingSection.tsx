import React from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';
import { FaArrowRightLong } from "react-icons/fa6";

export const StartSellingSection: React.FC = () => {
  return (
    <div className="w-full h-[400px] bg-[#F8F8F8] rounded-lg overflow-hidden mt-10">
      <div className="flex flex-col justify-center items-center h-full p-8">
        <h2 
          className="text-2xl font-base font-space my-10 text-black"
        >
          Comienza a Vender Hoy
        </h2>
        <p 
          className="text-center mb-10 w-[25%]"
          style={{ color: colors.mediumGray }}
        >
         Crea tu tienda online en minutos y alcanza a miles de compradores potenciales con nuestra plataforma de e-commerce social.
        </p>
        <DesignButton
          variant="primary"
          icon={FaArrowRightLong}
          iconPosition="right">
          Crear mi tienda
        </DesignButton>
      </div>
      
    </div>
  );
};
