import React from 'react';
import { colors } from '../../../design/colors';
import '../../../styles/responsive.css';

export const WideCard: React.FC = () => {
  return (
    <div className="wide-card-container w-full h-[320px] rounded-lg overflow-hidden mt-10">
      <h2 
        className="text-xl mt-8 font-space ml-8 text-left pl-8 md:pl-16 lg:pl-32 mb-4"
        style={{ color: colors.darkGray }}
      >
        En Vivo Ahora
      </h2>
      
      <div className="flex justify-center items-center gap-4 md:gap-5 lg:gap-6 mt-4 px-4">
        <div className="wide-card-image w-[42%] h-50 bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src="https://placehold.co/700x192"
            alt="Live stream 1"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="wide-card-image w-[42%] h-50 bg-white rounded-lg shadow-sm overflow-hidden">
          <img
            src="https://placehold.co/700x192"
            alt="Live stream 2"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
