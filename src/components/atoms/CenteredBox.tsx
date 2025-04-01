import React from 'react';

interface CenteredBoxProps {
  children: React.ReactNode;
  width?: string | number; 
  height?: string | number; 
  className?: string; 
}

function CenteredBox({ children, width, height, className }: CenteredBoxProps) {
  return (
    <div className={`flex items-center justify-center min-h-screen ${className || ''}`}>
      <div
        className="bg-white p-6 rounded shadow-2xl"
        style={{ width, height }}
      >
        {children}
      </div>
    </div>
  );
}

export default CenteredBox;
