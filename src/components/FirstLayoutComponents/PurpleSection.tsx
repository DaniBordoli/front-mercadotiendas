import React from 'react';

interface PurpleSectionProps {
  titleColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  backgroundColor?: string;
}

const PurpleSection: React.FC<PurpleSectionProps> = ({
  titleColor = "#fff",
  buttonColor = "#fff",
  buttonTextColor = "#63459C",
  backgroundColor = "#63459C",
}) => {
  return (
    <div className="py-12 px-4 md:px-12 lg:px-24 xl:px-44">
      <div className="p-6 md:p-8 rounded-lg" style={{ backgroundColor }}>
        <div className="flex flex-col md:flex-row h-auto md:h-[700px]">
          <div className="flex-1 flex flex-col justify-center md:ml-40 md:pr-40">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:w-6/12" style={{ color: titleColor }}>Oferta de verano</h1>
            <p className="text-base md:text-lg text-white my-8 md:my-12">
              Obtén hasta un 50% de descuento en artículos seleccionados. ¡Oferta por tiempo limitado!
            </p>
            <div>
              <button
                className="px-6 py-3 rounded hover:bg-gray-200"
                style={{ backgroundColor: buttonColor, color: buttonTextColor }}
              >
                Comprar ahora
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center mt-8 md:mt-0">
            <img
              src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Placeholder"
              className="w-full max-w-xs md:max-w-md lg:max-w-lg h-auto rounded-lg object-cover shadow-lg"
              style={{ aspectRatio: '1 / 1' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurpleSection;
