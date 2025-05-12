import React from 'react';

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, value }) => (
  <div className="flex flex-col items-center bg-gray-50 rounded-lg p-8 shadow w-56">
    {icon}
    <div className="text-lg text-gray-900 mb-2 font-semibold">{title}</div>
    <div className="font-bold mb-1 text-gray-400">{value}</div>
  </div>
);

export default InfoCard;
