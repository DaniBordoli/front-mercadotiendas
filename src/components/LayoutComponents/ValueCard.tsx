import React from 'react';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  horizontal?: boolean;
}

const ValueCard: React.FC<ValueCardProps> = ({ icon, title, description, horizontal }) => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  
  if (horizontal) {
    return (
      <div className="rounded-lg p-6 flex items-start gap-5 shadow w-full md:max-w-xl" style={{ backgroundColor: editableVariables.heroBackgroundColor || '#f8f9fa' }}>
        {icon}
        <div>
          <div className="font-semibold mb-1" style={{ color: editableVariables.aboutUsTextColor || editableVariables.textColor || '#333' }}>{title}</div>
          <div className="text-sm" style={{ color: editableVariables.aboutUsTextColor || editableVariables.textColor || '#666' }}>{description}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg p-7 flex flex-col items-start shadow w-full md:max-w-xl">
      {icon}
      <div className="font-semibold mb-1" style={{ color: editableVariables.aboutUsTextColor || editableVariables.textColor || '#333' }}>{title}</div>
      <div className="text-sm" style={{ color: editableVariables.aboutUsTextColor || editableVariables.textColor || '#666' }}>{description}</div>
    </div>
  );
};

export default ValueCard;
