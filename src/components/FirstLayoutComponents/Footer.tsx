import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { HiLocationMarker } from 'react-icons/hi';
import { FaPhone } from 'react-icons/fa6';
import { IoMail } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface FooterProps {
  footerTitle?: string;
  footerTitleColor?: string;
  backgroundColor?: string;
  textColor?: string;
  footerDescription?: string;
}

const Footer: React.FC<FooterProps> = ({
  footerTitle = 'ShopSmart',
  footerTitleColor = '#FFFFFF',
  backgroundColor = '#0B1120',
  textColor = '#FFFFFF',
  footerDescription = 'Tu destino integral para moda y accesorios.',
}) => {
  const navigate = useNavigate();

  return (
    <footer className="py-12" style={{ backgroundColor, color: textColor }}>
      <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      
        <div>
          <h3 className="text-lg font-bold mb-4" style={{ color: footerTitleColor }}>{footerTitle}</h3>
          <p className="text-sm mb-4">{footerDescription}</p>
          <div className="flex gap-4 text-gray-400">
            <FaFacebook className="text-xl cursor-pointer hover:text-white" />
            <FaInstagram className="text-xl cursor-pointer hover:text-white" />
            <FaTwitter className="text-xl cursor-pointer hover:text-white" />
          </div>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4">Enlaces rápidos</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => navigate('/first-layout/aboutus-layout')}
              >
                Sobre nosotros
              </span>
            </li>
            <li>
              <span
                className="hover:text-white cursor-pointer"
                onClick={() => navigate('/first-layout/contact-layout')}
              >
                Contacto
              </span>
            </li>
            <li><a href="#blog" className="hover:text-white">Blog</a></li>
            <li><a href="#faqs" className="hover:text-white">Preguntas frecuentes</a></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4">Servicio al cliente</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#shipping" className="hover:text-white">Política de envíos</a></li>
            <li><a href="#returns" className="hover:text-white">Devoluciones y cambios</a></li>
            <li><a href="#size-guide" className="hover:text-white">Guía de tallas</a></li>
            <li><a href="#terms" className="hover:text-white">Términos y condiciones</a></li>
          </ul>
        </div>

      
        <div>
          <h3 className="text-lg font-bold mb-4">Información de contacto</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-center gap-2">
              <HiLocationMarker className="text-xl" /> 123 Calle de la Moda, NY 10001
            </li>
            <li className="flex items-center gap-2">
              <FaPhone className="text-xl" /> +1 234 567 8900
            </li>
            <li className="flex items-center gap-2">
              <IoMail className="text-xl" /> info@shopsmart.com
            </li>
          </ul>
        </div>
      </div>
      <hr className="border-t border-gray-800 my-8 mx-auto w-10/12" />
      <div className="mt-8 text-center text-sm text-gray-400">
        © 2025 ShopSmart. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
