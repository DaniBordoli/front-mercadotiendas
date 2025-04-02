import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { Button } from '../components/atoms/Button';
import { FaSignOutAlt } from 'react-icons/fa';

export function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600"
          >
            <FaSignOutAlt />
            Cerrar sesión
          </Button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Contenido del dashboard en desarrollo...
          </p>
        </div>
      </div>
    </div>
  );
}
