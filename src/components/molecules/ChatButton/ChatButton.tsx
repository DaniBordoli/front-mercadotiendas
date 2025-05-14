import React from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ isOpen, onClick }) => {
  // Helper for hover state (slightly darker orange)
  const hoverOrange = '#E04437'; 

  return (
    <button
      className={`fixed bottom-6 right-6 rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 transition-all duration-300 ${
        isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-[#FF4F41] hover:bg-[#E04437]' // Replaced blue with orange/hover orange
      }`}
      onClick={onClick}
      aria-label={isOpen ? 'Cerrar asistente AI' : 'Abrir asistente AI'}
    >
      {isOpen ? (
        <FaTimes className="text-white text-xl" />
      ) : (
        <FaRobot className="text-white text-xl" />
      )}
    </button>
  );
}; 