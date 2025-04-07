import React from 'react';

export const WideCard: React.FC = () => {
  return (
    <div className="flex justify-center my-8">
      <div className="w-[calc(384px*3+48px)] h-64 bg-white rounded-sm shadow-md overflow-hidden">
        <img
          src="https://placehold.co/1180x250"
          alt="Wide Card Placeholder"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
