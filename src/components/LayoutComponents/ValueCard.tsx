import React from 'react';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  horizontal?: boolean;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, horizontal }) => {
  if (horizontal) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 flex items-start gap-5 shadow w-full md:max-w-xl">
        {icon}
        <div>
          <div className="font-semibold mb-1">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg p-7 flex flex-col items-start shadow w-full md:max-w-xl">
      {icon}
      <div className="font-semibold mb-1">{title}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </div>
  );
};

export default ValueCard;
