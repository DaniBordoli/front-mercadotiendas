import React from 'react';

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  lines: string[];
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, lines }) => (
  <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center">
    {icon}
    <div className="font-semibold mb-1">{title}</div>
    <div className="text-sm text-gray-500 text-center">
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
    </div>
  </div>
);

export default ContactInfoCard;
