import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { Footer } from '../components/organisms/Footer';
import { useAuthStore } from '../stores';
import { getUserApplications } from '../services/campaignService';

import { FaPlus, FaClipboardList, FaStore, FaUser } from 'react-icons/fa';
import Toast from '../components/atoms/Toast';

interface Application {
  _id: string;
  campaign: {
    _id: string;
    name: string;
    imageUrl?: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

const UserDashboard: React.FC = () => {
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
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Cargar aplicaciones del usuario si es un influencer
        if (!user.shop) {
          const response = await getUserApplications();
          setApplications(response.data.slice(0, 3)); // Mostrar solo las 3 más recientes
          

        }
      } catch (error: any) {
        console.error('Error al cargar datos del usuario:', error);
        setToast({
          show: true,
          message: error.message || 'Error al cargar tus datos',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
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
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Bienvenido, {user?.name || 'Usuario'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel izquierdo - Información del usuario */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <FaUser className="text-gray-400 text-2xl" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{user?.name}</h2>
                <p className="text-gray-500">{user?.email}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4 mt-4">
              <h3 className="font-medium text-gray-700 mb-3">Acciones rápidas</h3>
              <div className="space-y-2">
                {user?.shop ? (
                  <>
                    <button 
                      onClick={() => navigate('/campaigns/create')}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaPlus className="mr-2" /> Crear nueva campaña
                    </button>
                    <button 
                      onClick={() => navigate('/shop-profile')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaStore className="mr-2" /> Gestionar mi tienda
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/campaigns')}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaPlus className="mr-2" /> Explorar campañas
                    </button>
                    <button 
                      onClick={() => navigate('/my-applications')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center"
                    >
                      <FaClipboardList className="mr-2" /> Ver mis aplicaciones
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Panel central y derecho - Contenido según el tipo de usuario */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Sección Datos Personales */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FaUser className="mr-2 text-blue-600" />
                  Datos Personales
                </h2>
                <button 
                  onClick={() => navigate('/profile')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Editar →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Nombre: <span className="font-medium text-gray-800">{user?.name}</span></p>
                  <p className="text-gray-600">Email: <span className="font-medium text-gray-800">{user?.email}</span></p>
                </div>
                <div>
                  <p className="text-gray-600">Tipo: <span className="font-medium text-gray-800">{user?.userType || (user?.shop ? 'Vendedor' : 'Influencer')}</span></p>
                </div>
              </div>
            </div>



            {/* Contenido principal según tipo de usuario */}
            {user?.shop ? (
              // Contenido para dueños de tiendas
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Gestión de campañas</h2>
                <p className="text-gray-600 mb-6">
                  Como dueño de tienda, puedes crear y gestionar campañas para promocionar tus productos con influencers.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                    <h3 className="font-medium text-lg mb-2">Crear campaña</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Crea una nueva campaña para promocionar tus productos con influencers.
                    </p>
                    <button 
                      onClick={() => navigate('/campaigns/create')}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Comenzar ahora →
                    </button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                    <h3 className="font-medium text-lg mb-2">Ver mis campañas</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Revisa y gestiona todas tus campañas activas y anteriores.
                    </p>
                    <button 
                      onClick={() => navigate('/campaigns')}
                      className="text-red-500 hover:text-red-600 font-medium"
                    >
                      Ver campañas →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Contenido para influencers
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Mis aplicaciones recientes</h2>
                  <button 
                    onClick={() => navigate('/my-applications')}
                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                  >
                    Ver todas →
                  </button>
                </div>
                
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
                  </div>
                ) : applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map(application => (
                      <div 
                        key={application._id} 
                        className="border border-gray-100 rounded-lg p-4 hover:border-red-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{application.campaign.name}</h3>
                            <p className="text-gray-500 text-sm">
                              Aplicaste el {formatDate(application.createdAt)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusText(application.status)}
                          </span>
                        </div>
                        <div className="mt-3">
                          <button
                            onClick={() => navigate(`/campaigns/${application.campaign._id}`)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            Ver detalles →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">Aún no has aplicado a ninguna campaña</p>
                    <button
                      onClick={() => navigate('/campaigns')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Explorar campañas
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
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

export default UserDashboard;
