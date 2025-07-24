import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { useAuthStore } from '../stores';
import { getUserApplications } from '../services/campaignService';
import Toast from '../components/atoms/Toast';
import { FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';

// Tipos
interface Application {
  _id: string;
  campaign: {
    _id: string;
    name: string;
    imageUrl?: string;
    shop: {
      _id: string;
      name: string;
    };
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  socialLinks?: string;
  proposedRate?: number;
  createdAt: string;
}

export const UserApplicationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Cargar aplicaciones del usuario
  useEffect(() => {
    const loadApplications = async () => {
      try {
        setLoading(true);
        const response = await getUserApplications();
        setApplications(response.data);
      } catch (error: any) {
        console.error('Error al cargar aplicaciones:', error);
        setToast({
          show: true,
          message: error.message || 'Error al cargar tus aplicaciones',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadApplications();
  }, []);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Obtener color según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Obtener texto según el estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Aceptada';
      case 'rejected':
        return 'Rechazada';
      default:
        return 'Pendiente';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-red-500 hover:text-red-600 mr-4"
          >
            <FaArrowLeft className="inline mr-2" /> Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Mis Aplicaciones a Campañas
          </h1>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600 mb-4">No has aplicado a ninguna campaña todavía.</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Explorar campañas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src={application.campaign.imageUrl || "https://placehold.co/400x200?text=Campaña"}
                    alt={application.campaign.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{application.campaign.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Tienda: {application.campaign.shop.name}
                  </p>
                  
                  <p className="text-gray-500 text-xs mb-4">
                    Aplicaste el {formatDate(application.createdAt)}
                  </p>
                  
                  <div className="border-t border-gray-100 pt-3 mt-2">
                    <button
                      onClick={() => navigate(`/campaigns/${application.campaign._id}`)}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm flex items-center justify-center"
                    >
                      Ver detalles de la campaña
                      <FaExternalLinkAlt className="ml-2 text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, show: false }))}
        duration={3000}
      />
    </div>
  );
};

export default UserApplicationsScreen;
