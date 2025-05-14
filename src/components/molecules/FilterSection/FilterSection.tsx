import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean; // Opción para que esté abierto por defecto
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="py-3 border-b border-gray-200"> {/* Separador visual */}
      <button 
        onClick={toggleOpen} 
        className="flex justify-between items-center w-full text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <h3 className="font-semibold text-base" style={{ color: '#1C1C1E' }}>{title}</h3>
        {isOpen ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen mt-2' : 'max-h-0'}`}
        style={{ transitionProperty: 'max-height, margin-top' }} // Asegura transición suave
      >
        {isOpen && children} {/* Renderizar contenido solo si está abierto para eficiencia */}
      </div>
    </div>
  );
}; 