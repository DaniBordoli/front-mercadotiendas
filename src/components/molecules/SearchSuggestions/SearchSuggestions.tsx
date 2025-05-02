import React from 'react';

interface Suggestion {
  id: string;
  name: string;
  // Puedes añadir más campos como imageUrl, category, etc. si es necesario
}

interface SearchSuggestionsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: Suggestion) => void;
  isVisible: boolean;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  isVisible,
}) => {
  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <ul 
      className="absolute z-50 w-full bg-white border border-gray-300 rounded-b-md shadow-lg mt-1 max-h-60 overflow-y-auto"
      // Ajusta el 'w-full' o añade un ancho específico si es necesario para que coincida con el input
    >
      {suggestions.map((suggestion) => (
        <li
          key={suggestion.id}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion.name}
        </li>
      ))}
    </ul>
  );
};

// Exportar también el index para facilitar importaciones
// Crear archivo: frontend/front-mercadotiendas-main/src/components/molecules/SearchSuggestions/index.ts
// con el contenido: export * from './SearchSuggestions'; 