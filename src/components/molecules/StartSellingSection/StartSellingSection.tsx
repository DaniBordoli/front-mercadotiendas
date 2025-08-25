import React, { useState } from 'react';
import { colors } from '../../../design/colors';
import { DesignButton } from '../../atoms/DesignButton';
import { FaArrowRightLong } from "react-icons/fa6";
import '../../../styles/responsive.css';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores';

export const StartSellingSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  // Verificar si el usuario tiene una tienda
  const hasShop = isAuthenticated && user && user.shop;

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  return (
    <div className="selling-section w-full h-[400px] bg-[#F8F8F8] rounded-lg overflow-hidden mt-10">      <div className="flex flex-col justify-center items-center h-full p-4 md:p-6 lg:p-8">
        <h2 
          className="text-lg md:text-xl lg:text-2xl font-base font-space my-6 md:my-8 lg:my-10 text-black"
        >
          {hasShop ? "Mejora Tu Tienda" : "Comienza a Vender Hoy"}
        </h2>
        <p 
          className="text-center mb-6 md:mb-8 lg:mb-10 w-[60%] md:w-[40%] lg:w-[25%]"
          style={{ color: colors.mediumGray }}
        >
          {hasShop 
            ? "Actualiza y personaliza tu tienda online para incrementar las ventas y mejorar la experiencia de tus clientes."
            : "Crea tu tienda online en minutos y alcanza a miles de compradores potenciales con nuestra plataforma de e-commerce social."
          }
        </p>
        <DesignButton
          variant="primary"
          icon={FaArrowRightLong}
          iconPosition="right"
          onClick={toggleModal} 
        >
          {hasShop ? "Editar mi tienda" : "Crear mi tienda"}
        </DesignButton>
      </div>

        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8 w-[90%] max-w-4xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">Crear mi tienda</h1>
              <p className="text-xl text-[#666666] max-w-2xl mx-auto">
                Podés configurarla paso a paso o hacerlo con ayuda de IA.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
              {/* Manual Card */}
              <div 
                className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate('/shop-create')}
              >
                <div className="text-center">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-[#f8f8f8] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ff4f41]/10 transition-colors">
                    <i className="fa-solid fa-cog text-[#666666] text-3xl group-hover:text-[#ff4f41] transition-colors"></i>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Crear manualmente</h2>
                  
                  {/* Description */}
                  <p className="text-[#666666] text-lg mb-8 leading-relaxed">
                    Completá datos básicos, diseño, menú y categorías paso a paso con control total sobre cada detalle.
                  </p>
                  
                  {/* Button */}
                  <button className="w-full h-12 bg-[#f8f8f8] text-[#1c1c1e] font-semibold rounded-lg hover:bg-[#ff4f41] hover:text-white transition-all duration-300 group-hover:bg-[#ff4f41] group-hover:text-white">
                    Empezar wizard manual
                  </button>
                </div>
              </div>

              {/* AI Card (Featured) */}
              <div 
                className="bg-white rounded-2xl shadow-lg border-2 border-[#ff4f41] p-8 hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden"
                onClick={() => navigate('/layout-select')}
              >
                {/* Featured Badge */}
                <div className="absolute top-4 right-4">
                  <div className="inline-flex items-center px-3 py-1 bg-[#ff4f41] rounded-full">
                    <i className="fa-solid fa-star text-white mr-1 text-xs"></i>
                    <span className="text-white text-xs font-medium">Recomendado</span>
                  </div>
                </div>

                <div className="text-center">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-[#ff4f41]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-[#ff4f41]/20 transition-colors">
                    <i className="fa-solid fa-wand-magic-sparkles text-[#ff4f41] text-3xl"></i>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl font-bold font-space text-[#1c1c1e] mb-4">Crear con IA</h2>
                  
                  {/* Description */}
                  <p className="text-[#666666] text-lg mb-8 leading-relaxed">
                    Conversá con la IA y generá una propuesta personalizada en minutos. Rápido y eficiente.
                  </p>
                  
                  {/* Button */}
                  <button className="w-full h-12 bg-[#ff4f41] text-white font-semibold rounded-lg hover:bg-[#ff4f41]/90 transition-all duration-300">
                    Empezar asistente IA
                  </button>
                </div>
              </div>
            </div>
            
            {/* Help Note */}
            <div className="text-center">
              <p className="text-[#666666] text-sm">
                <i className="fa-solid fa-info-circle mr-2"></i>
                Podés cambiar de método antes de confirmar tu tienda.
              </p>
            </div>
            
            <div className="text-center mt-6">
              <button
                className="text-[#666666] hover:text-[#ff4f41] font-medium transition-colors"
                onClick={toggleModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};