import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { DesignButton } from '../../atoms/DesignButton';
import { colors } from '../../../design/colors';

interface ReviewFormProps {
  productId: string; // Necesitamos saber a qué producto se refiere la opinión
  onCancel: () => void;
  onSubmit: (reviewData: { rating: number; text: string }) => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onCancel, onSubmit }) => {
  // State para rating y texto (se añadirá en el siguiente paso)
  const [rating, setRating] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleStarHover = (index: number) => {
    setHoverRating(index + 1);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = () => {
    if (rating > 0 && text.trim()) { // Asegurarse de que haya rating y texto
        onSubmit({ rating, text });
    } else {
        alert("Por favor, selecciona una calificación y escribe tu opinión.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 shadow-xl w-full max-w-md relative">
        <button 
            onClick={onCancel}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none font-semibold"
            aria-label="Cerrar"
        >
            &times;
        </button>
        <h2 className="text-xl font-semibold font-space mb-4" style={{ color: colors.darkGray }}>Escribe tu opinión</h2>
        
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>Tu calificación:</label>
            <div className="flex space-x-1">
                {[...Array(5)].map((_, index) => {
                    const starValue = index + 1;
                    const isSelected = starValue <= rating;
                    const isHovered = starValue <= hoverRating;
                    return (
                        <FaStar 
                            key={index}
                            size={28} 
                            className={`cursor-pointer transition-colors ${ (isHovered || isSelected) ? 'text-yellow-500' : 'text-gray-300' }`}
                            onClick={() => handleStarClick(index)}
                            onMouseEnter={() => handleStarHover(index)}
                            onMouseLeave={handleStarLeave}
                        />
                    );
                })}
            </div>
        </div>

        <div className="mb-6">
            <label htmlFor="reviewText" className="block text-sm font-medium mb-2" style={{ color: colors.mediumGray }}>Tu opinión:</label>
            <textarea
                id="reviewText"
                rows={4}
                className="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
                style={{ borderColor: colors.lightGray }}
                placeholder="Describe tu experiencia con el producto..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>

        <div className="flex justify-end space-x-3">
            <DesignButton variant="secondary" size="medium" onClick={onCancel}>
                Cancelar
            </DesignButton>
            <DesignButton variant="primary" size="medium" onClick={handleSubmit} disabled={rating === 0 || !text.trim()}>
                Enviar opinión
            </DesignButton>
        </div>
      </div>
    </div>
  );
}; 