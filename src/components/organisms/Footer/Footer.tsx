import React from 'react';
import { colors } from '../../../design/colors';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import '../../../styles/responsive.css';

export const Footer: React.FC = () => {
  const footerSections = [
    {
      title: "Empresa",
      links: [
        { text: "Sobre Nosotros", url: "#" },
        { text: "Careers", url: "#" },
        { text: "Blog", url: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Términos y Condiciones", url: "#" },
        { text: "Privacidad", url: "#" },
        { text: "Cookies", url: "#" }
      ]
    }
  ];

  // Social media icons for "Síguenos" section
  const socialMediaIcons = [
    { icon: <FaInstagram size={24} />, url: "#" },
    { icon: <FaTwitter size={24} />, url: "#" },
    { icon: <FaFacebook size={24} />, url: "#" }
  ];

  return (
    <footer className="footer-container w-full h-[629px] bg-[#F8F8F8] py-8 md:py-12 lg:py-16">
      <div className="container mx-auto flex justify-center mt-10 md:mt-16 lg:mt-20 px-4 md:mr-16 lg:mr-32">
        <div className="footer-sections flex flex-col md:flex-row md:gap-20 lg:gap-80"> 
          {/* Regular sections with text links */}
          {footerSections.map((section, index) => (
            <div key={index} className="flex flex-col mb-8 md:mb-0">
              <h3 
                className="mb-4 md:mb-6 lg:mb-8 font-space font-medium" 
                style={{ color: colors.darkGray }}
              >
                {section.title}
              </h3>
              <div className="flex flex-col gap-2 md:gap-3 lg:gap-4"> 
                {section.links.map((link, linkIndex) => (
                  <a 
                    key={linkIndex} 
                    href={link.url} 
                    className="text-sm hover:underline" 
                    style={{ color: colors.mediumGray }}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            </div>
          ))}
          
      
          <div className="flex flex-col">
            <h3 
              className="mb-4 md:mb-6 lg:mb-8 font-space font-medium" 
              style={{ color: colors.darkGray }}
            >
              Síguenos
            </h3>
            <div className="flex flex-row gap-4 md:gap-5 lg:gap-6"> 
              {socialMediaIcons.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  style={{ color: colors.mediumGray }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto mt-20 md:mt-30 lg:mt-40 px-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-end pb-4">
            <p className="text-sm w-full md:w-[50%] lg:w-[30%] mt-8 md:mt-10 lg:mt-14 ml-0 md:ml-1 lg:ml-2" style={{ color: colors.mediumGray }}>
              La plataforma de e-commerce social para emprendedores y creadores de contenido.
            </p>
          </div>
          <div className="w-full md:w-[95%] lg:w-[90%] mx-auto border-t mt-4 border-gray-200"></div>
          <div className="text-center text-xs pt-4" style={{ color: colors.mediumGray }}>
            © 2025 MercadoTiendas. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
