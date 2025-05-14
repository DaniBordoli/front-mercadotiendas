import React from 'react';

interface DashboardCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, value, icon }) => (
  <div className="bg-white rounded-lg p-6 flex flex-col shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-gray-500">{label}</span>
      {icon}
    </div>
    <div className="text-2xl font-semibold text-left">{value}</div>
  </div>
);

export default DashboardCard;
