import React from 'react';
import { FaUser, FaDownload, FaMapMarkerAlt, FaRegHeart, FaSignOutAlt, FaClipboardList, FaBox } from 'react-icons/fa';

const ProfileSidebar: React.FC = () => (
  <aside className="w-full md:w-64 bg-white rounded-lg p-6 flex flex-col items-center md:items-start mb-8 md:mb-0">
    <div className="flex items-center w-full mb-6">
      <img
        src="https://randomuser.me/api/portraits/men/32.jpg"
        alt="User"
        className="w-16 h-16 rounded-full mr-4"
      />
      <div>
        <div className="font-semibold text-gray-900">John Doe</div>
        <div className="text-xs text-gray-500">Member since 2024</div>
      </div>
    </div>
    <nav className="w-full flex flex-col gap-2">
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-blue-600 bg-blue-50 font-medium">
        <FaClipboardList /> Dashboard
      </a>
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-gray-100">
        <FaBox /> Orders
      </a>
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-gray-100">
        <FaDownload /> Downloads
      </a>
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-gray-100">
        <FaMapMarkerAlt /> Addresses
      </a>
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-gray-100">
        <FaUser /> Account Details
      </a>
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-gray-700 hover:bg-gray-100">
        <FaRegHeart /> Wishlist
      </a>
      <a href="#" className="flex items-center gap-2 px-3 py-2 rounded text-red-600 hover:bg-red-50 mt-2">
        <FaSignOutAlt /> Logout
      </a>
    </nav>
  </aside>
);

export default ProfileSidebar;
