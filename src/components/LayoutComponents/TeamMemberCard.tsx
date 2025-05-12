import React from 'react';

interface TeamMemberCardProps {
  image: string;
  name: string;
  role: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ image, name, role }) => (
  <div className="flex flex-col items-center">
    <img
      src={image}
      alt={name}
      className="w-24 h-24 rounded-full mb-4 object-cover"
    />
    <div className="font-semibold text-base mb-1">{name}</div>
    <div className="text-sm text-gray-500 mb-2">{role}</div>
    <div className="flex gap-3 text-gray-400">
      <a href="#"><i className="fab fa-twitter" /></a>
      <a href="#"><i className="fab fa-facebook" /></a>
      <a href="#"><i className="fab fa-linkedin" /></a>
    </div>
  </div>
);

export default TeamMemberCard;
