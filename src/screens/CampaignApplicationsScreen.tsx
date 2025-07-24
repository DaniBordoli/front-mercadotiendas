import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { useAuthStore } from '../stores';
import { getCampaignById, getCampaignApplications, updateApplicationStatus } from '../services/campaignService';
import Toast from '../components/atoms/Toast';
import { FaArrowLeft, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';

// Tipos
interface Application {
  _id: string;
  campaign: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  socialLinks?: string;
  proposedRate?: number;
  createdAt: string;
}

interface Campaign {
  _id: string;
  name: string;
  shop: {
    _id: string;
    name: string;
  };
}

export const CampaignApplicationsScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Cargar datos de la campaña y sus aplicaciones
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Obtener detalles de la campaña
        const campaignResponse = await getCampaignById(id);
        setCampaign(campaignResponse.data);
        
        // Verificar que el usuario es el dueño de la tienda
        if (user?.shop?._id !== campaignResponse.data.shop._id) {
          setError('No tienes permiso para ver las aplicaciones de esta campaña');
          setLoading(false);
          return;
        }
        
        // Obtener aplicaciones de la campaña
        const applicationsResponse = await getCampaignApplications(id);
        setApplications(applicationsResponse.data);
        
      } catch (error: any) {
        console.error('Error al cargar datos:', error);
        setError(error.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, user]);

  // Manejar cambio de estado de una aplicación
  const handleStatusChange = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      
      // Actualizar el estado local
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      
      setToast({
        show: true,
        message: `Aplicación ${newStatus === 'accepted' ? 'aceptada' : 'rechazada'} correctamente`,
        type: 'success'
      });
    } catch (error: any) {
      console.error('Error al actualizar estado:', error);
      setToast({
        show: true,
        message: error.message || 'Error al actualizar el estado',
        type: 'error'
      });
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (error) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/campaigns')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Volver a campañas
            </button>
          </div>
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
            onClick={() => navigate(`/campaigns/${id}`)}
            className="text-red-500 hover:text-red-600 mr-4"
          >
            <FaArrowLeft className="inline mr-2" /> Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Aplicaciones para: {campaign?.name}
          </h1>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No hay aplicaciones para esta campaña todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {applications.map((application) => (
              <div key={application._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <img
                      src={application.user.avatar || "https://placehold.co/50x50?text=User"}
                      alt={application.user.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{application.user.name}</h3>
                      <p className="text-gray-600 text-sm">{application.user.email}</p>
                      <p className="text-gray-500 text-xs">
                        Aplicó el {formatDate(application.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="mb-2">
                      {application.status === 'pending' ? (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                          Pendiente
                        </span>
                      ) : application.status === 'accepted' ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                          Aceptada
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
                          Rechazada
                        </span>
                      )}
                    </div>
                    {application.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(application._id, 'accepted')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                        >
                          <FaCheck className="mr-1" /> Aceptar
                        </button>
                        <button
                          onClick={() => handleStatusChange(application._id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                        >
                          <FaTimes className="mr-1" /> Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">Mensaje:</h4>
                  <p className="text-gray-600 whitespace-pre-line">{application.message}</p>
                </div>
                
                {application.socialLinks && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Enlaces sociales:</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.socialLinks.split(',').map((link, index) => (
                        <a
                          key={index}
                          href={link.startsWith('http') ? link : `https://${link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {link.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                          <FaExternalLinkAlt className="ml-1 text-xs" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {application.proposedRate && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Tarifa propuesta:</h4>
                    <p className="text-gray-600">${application.proposedRate.toFixed(2)}</p>
                  </div>
                )}
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

export default CampaignApplicationsScreen;
