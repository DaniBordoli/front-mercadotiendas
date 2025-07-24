import React from 'react';

interface ApplicationsCounterProps {
  count: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente que muestra el número de propuestas/postulaciones recibidas para una campaña
 */
export const ApplicationsCounter: React.FC<ApplicationsCounterProps> = ({ 
  count, 
  size = 'md',
  className = ''
}) => {
  // Configuración de tamaños
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <div className={`bg-blue-100 text-blue-800 rounded-full font-medium flex items-center ${sizeClasses[size]} ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`${iconSizes[size]} mr-1`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
        />
      </svg>
      <span>{count} {count === 1 ? 'propuesta' : 'propuestas'}</span>
    </div>
  );
};

export default ApplicationsCounter;
