import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { Footer } from '../components/organisms/Footer';
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
    description: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: string;
}

const MyApplicationsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  useEffect(() => {
    const loadApplications = async () => {
      if (!user) return;
      
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
  }, [user]);

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/user-dashboard')}
            className="mr-4 text-gray-600 hover:text-gray-800"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Mis Aplicaciones a Campañas</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : applications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {applications.map(application => (
              <div 
                key={application._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{application.campaign.name}</h2>
                      <p className="text-gray-500 text-sm">
                        Aplicaste el {formatDate(application.createdAt)}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {getStatusText(application.status)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Tu mensaje:</h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {application.message}
                    </p>
                  </div>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <button
                      onClick={() => navigate(`/campaigns/${application.campaign._id}`)}
                      className="text-red-500 hover:text-red-600 font-medium flex items-center"
                    >
                      Ver detalles de la campaña <FaExternalLinkAlt className="ml-1 text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No has aplicado a ninguna campaña todavía</h2>
            <p className="text-gray-500 mb-6">
              Explora las campañas disponibles y aplica a las que te interesen para comenzar a colaborar con tiendas.
            </p>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg"
            >
              Explorar campañas
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-auto">
        <Footer />
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

export default MyApplicationsScreen;
