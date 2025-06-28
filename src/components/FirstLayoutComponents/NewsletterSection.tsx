import React from 'react';
import { InputDefault } from '../atoms/InputDefault/InputDefault';

interface NewsletterSectionProps {
  newsletterTitle?: string;
  newsletterTitleColor?: string;
  backgroundColor?: string;
  titleColor?: string;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ newsletterTitle = "Suscríbete a nuestro boletín", newsletterTitleColor = "#000", backgroundColor = "bg-gray-50", titleColor = "#000" }) => {
  return (
    <div className="py-12" style={{ backgroundColor }}>
      <h2 className="text-2xl font-bold text-center mb-4" style={{ color: newsletterTitleColor }}>{newsletterTitle}</h2>
      <p className="text-center text-gray-600 mb-8">
        Recibe las últimas novedades sobre productos y próximas ofertas.
      </p>
      <div className="flex justify-center items-center mb-12 gap-4">
        <div >
          <InputDefault className='w-80' placeholder="Ingresa tu correo electrónico" type="email" />
        </div>
        <button className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">
          Suscribirse
        </button>
      </div>
    </div>
  );
};

export default NewsletterSection;
