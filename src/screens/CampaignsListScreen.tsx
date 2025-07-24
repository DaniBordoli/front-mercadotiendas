import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { FaPlus, FaFilter, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { ApplicationsCounter } from '../components/molecules/ApplicationsCounter';
import { getAllCampaigns, Campaign as ApiCampaign } from '../services/campaignService';
import Toast from '../components/atoms/Toast';
import CampaignImage from '../components/atoms/CampaignImage';

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  imageUrl?: string;
  endDate: string;
  status: 'active' | 'closed' | 'draft';
  category: string;
  applicationsCount: number;
  shop?: any;
}

const CampaignsListScreen: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Cargar campañas desde la API
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Mostrar toast de carga
        setToast({
          show: true,
          message: 'Cargando campañas...',
          type: 'info'
        });
        
        const response = await getAllCampaigns(filter !== 'all' ? filter : undefined);
        
        // Mapear la respuesta de la API al formato que espera nuestro componente
        const formattedCampaigns = response.data.map((campaign: ApiCampaign) => ({
          id: campaign._id,
          name: campaign.name,
          description: campaign.description,
          budget: campaign.budget,
          // Usar una imagen por defecto si no hay una específica para la campaña
          imageUrl: campaign.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
          endDate: campaign.endDate,
          status: campaign.status,
          category: campaign.category,
          applicationsCount: campaign.applicationsCount,
          shop: campaign.shop
        }));
        
        setCampaigns(formattedCampaigns);
        
        // Ocultar toast después de cargar
        setToast(prev => ({ ...prev, show: false }));
      } catch (error: any) {
        console.error('Error al cargar campañas:', error);
        setError(error.message || 'Error al cargar las campañas');
        
        // Mostrar toast de error
        setToast({
          show: true,
          message: 'Error al cargar las campañas',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [filter]);
  
  // Función para reintentar la carga cuando hay un error
  const retryFetch = () => {
    setFilter(filter); // Esto disparará el useEffect nuevamente
  };

  // Ya no necesitamos filtrar aquí, ya que lo hacemos en la API
  const filteredCampaigns = campaigns;

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Campañas para Influencers</h1>
          {user?.shop && (
            <button 
              onClick={() => navigate('/campaigns/create')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FaPlus className="mr-2" /> Crear Campaña
            </button>
          )}
        </div>

        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <FaFilter className="text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold">Filtrar por categoría</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'Moda' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('Moda')}
            >
              Moda
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'Tecnología' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('Tecnología')}
            >
              Tecnología
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'Deportes' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('Deportes')}
            >
              Deportes
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'Belleza' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('Belleza')}
            >
              Belleza
            </button>
            <button 
              className={`px-3 py-1 rounded-full text-sm ${filter === 'Gastronomía' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => setFilter('Gastronomía')}
            >
              Gastronomía
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            <p className="text-gray-600 animate-pulse">Cargando campañas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-2" />
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={retryFetch}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
            >
              <FaSync className="mr-2" /> Reintentar
            </button>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <CampaignImage 
                    src={campaign.imageUrl} 
                    alt={campaign.name} 
                    className="w-full h-full object-cover"
                    campaignId={campaign.id}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{campaign.name}</h3>
                    {campaign.status === 'active' ? (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Activa
                      </span>
                    ) : campaign.status === 'closed' ? (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Cerrada
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        Borrador
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>Presupuesto: ${campaign.budget}</span>
                    <span>Hasta: {new Date(campaign.endDate).toLocaleDateString()}</span>
                  </div>
                  <div className="mb-3">
                    <ApplicationsCounter count={campaign.applicationsCount} size="sm" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {campaign.category}
                    </span>
                    <button 
                      onClick={() => navigate(`/campaigns/${campaign.id}`)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No hay campañas disponibles con los filtros seleccionados.</p>
          </div>
        )}

        {!isAuthenticated && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Eres un influencer?</h3>
            <p className="text-blue-600 mb-4">Regístrate para poder postularte a estas campañas y comenzar a colaborar con marcas.</p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Registrarme ahora
            </button>
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

export default CampaignsListScreen;
