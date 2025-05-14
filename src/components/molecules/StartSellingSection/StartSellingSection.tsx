import React, { useState } from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';
import { FaArrowRightLong } from "react-icons/fa6";
import '../../../styles/responsive.css';
import { useNavigate } from 'react-router-dom';

export const StartSellingSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <div className="selling-section w-full h-[400px] bg-[#F8F8F8] rounded-lg overflow-hidden mt-10">
      <div className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8">
        <h2 
          className="text-lg md:text-xl lg:text-2xl font-base font-space my-6 md:my-8 lg:my-10 text-black"
        >
          Comienza a Vender Hoy
        </h2>
        <p 
          className="text-center mb-6 md:mb-8 lg:mb-10 w-[60%] md:w-[40%] lg:w-[25%]"
          style={{ color: colors.mediumGray }}
        >
          Crea tu tienda online en minutos y alcanza a miles de compradores potenciales con nuestra plataforma de e-commerce social.
        </p>
        <DesignButton
          variant="primary"
          icon={FaArrowRightLong}
          iconPosition="right"
          onClick={toggleModal} 
        >
          Crear mi tienda
        </DesignButton>
      </div>

      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[50%] lg:w-[30%] shadow-lg">
            <h3 className="text-lg font-bold mb-4 font-space text-center">¿Quieres ir por la creación manual o vía IA?</h3>
            <div className="flex flex-col gap-4">
              <DesignButton
                variant="secondary"
                onClick={() => navigate('/shop-create')}
              >
                Creación Manual
              </DesignButton>
              <DesignButton
                variant="secondary"
                onClick={() => navigate('/layout-select')} 
              >
                Creación vía IA
              </DesignButton>
            </div>
            <button
              className="mt-4 text-sm text-gray-900 font-space w-full text-center"
              onClick={toggleModal} 
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};