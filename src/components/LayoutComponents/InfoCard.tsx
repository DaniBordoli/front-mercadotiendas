import React from 'react';
import { useFirstLayoutStore } from '../../stores/firstLayoutStore';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => {
  const editableVariables = useFirstLayoutStore(state => state.editableVariables);
  
  return (
    <div className="flex flex-col items-center rounded-lg p-8 shadow w-56" style={{ backgroundColor: editableVariables.heroBackgroundColor || '#f8f9fa' }}>
      {icon}
      <div className="text-lg mb-2 font-semibold" style={{ color: editableVariables.aboutUsTextColor || editableVariables.textColor || '#333' }}>{title}</div>
      <div className="font-bold mb-1" style={{ color: editableVariables.primaryColor || '#666' }}>{value}</div>
    </div>
  );
};

export default InfoCard;
