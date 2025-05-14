import React from 'react';

interface HeroSectionProps {
  title?: string;
  image?: string;
  buttonText?: string;
  textColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  button2Text?: string;
  button2Color?: string;
  button2TextColor?: string;
  backgroundColor?: string;
  description?: string; // Nuevo campo para el texto del <p>
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "Discover Your Style With Our Collection",
  image = "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=2141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  buttonText = "Shop Now",
  textColor = "#000000",
  buttonColor = "#3B82F6",
  buttonTextColor = "#FFFFFF",
  button2Text = "Learn More",
  button2Color = "#FFFFFF",
  button2TextColor = "#1F2937",
  backgroundColor = "#F9FAFB",
  description = "Shop the latest trends in fashion, accessories, and lifestyle products.", // Valor por defecto
}) => {
  return (
    <div className="flex h-[700px] p-8" style={{ backgroundColor }}>
      <div className="flex-1 flex flex-col justify-center pl-40">
        <h1 className="text-4xl w-6/12 font-bold mb-4" style={{ color: textColor }}>{title}</h1>
        <p className="text-lg text-gray-600 mb-8">
          {description}
        </p>
        <div className="flex gap-4">
          <button
            className="px-6 py-3 rounded hover:opacity-90"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          >
            {buttonText}
          </button>
          <button
            className="px-6 py-3 border rounded hover:opacity-90"
            style={{
              backgroundColor: button2Color,
              color: button2TextColor,
              borderColor: button2TextColor,
              borderWidth: 1,
              borderStyle: "solid",
            }}
          >
            {button2Text}
          </button>
        </div>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <img src={image} alt="Placeholder" className="w-4/5 h-4/5 rounded-lg object-cover shadow-lg" />
      </div>
    </div>
  );
};

export default HeroSection;
