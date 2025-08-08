import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaUserCircle, FaTag, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { ApplicationsCounter } from '../components/molecules/ApplicationsCounter';
import { getCampaignById, applyToCampaign, updateCampaignStatus } from '../services/campaignService';
import Toast from '../components/atoms/Toast';
import CampaignImage from '../components/atoms/CampaignImage';

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  imageUrl?: string;
  endDate: string;
  startDate?: string;
  status: 'active' | 'closed' | 'draft';
  category: string;
  requirements: string[];
  shopId: string;
  shopName: string;
  applicationsCount: number;
}

const CampaignDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [applying, setApplying] = useState<boolean>(false);
  const [proposal, setProposal] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info'
  });
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  console.log('campaign', campaign);

  useEffect(() => {
    const fetchCampaignData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Mostrar toast de carga
        setToast({
          show: true,
          message: 'Cargando detalles de la campaña...',
          type: 'info'
        });
        
        const response = await getCampaignById(id);
        
        // Mapear la respuesta de la API al formato que espera nuestro componente
        const campaignData = response.data;
        const formattedCampaign: Campaign = {
          id: campaignData._id,
          name: campaignData.name,
          description: campaignData.description,
          budget: campaignData.budget,
          imageUrl: campaignData.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
          endDate: campaignData.endDate,
          startDate: campaignData.startDate || new Date().toISOString(),
          status: campaignData.status,
          category: campaignData.category,
          requirements: campaignData.requirements ? 
            (typeof campaignData.requirements === 'string' ? 
              campaignData.requirements.split('\n').filter(Boolean) : 
              campaignData.requirements) : 
            [],
          shopId: campaignData.shop?._id || '',
          shopName: campaignData.shop?.name || 'Tienda',
          applicationsCount: campaignData.applicationsCount || 0
        };
        
        setCampaign(formattedCampaign);
        
        // Ocultar toast después de cargar
        setToast(prev => ({ ...prev, show: false }));
      } catch (error: any) {
        console.error('Error al cargar la campaña:', error);
        setError(error.message || 'Error al cargar los detalles de la campaña');
        
        // Mostrar toast de error
        setToast({
          show: true,
          message: 'Error al cargar los detalles de la campaña',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaignData();
  }, [id]);
  
  // Función para reintentar la carga cuando hay un error
  const retryFetch = () => {
    if (id) {
      // Esto disparará el useEffect nuevamente
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          // Mostrar toast de carga
          setToast({
            show: true,
            message: 'Intentando cargar nuevamente...',
            type: 'info'
          });
          
          const response = await getCampaignById(id);
          
          // Mapear la respuesta de la API al formato que espera nuestro componente
          const campaignData = response.data;
          console.log('campaignData', campaignData)

          const formattedCampaign: Campaign = {
            id: campaignData._id,
            name: campaignData.name,
            description: campaignData.description,
            budget: campaignData.budget,
            imageUrl: campaignData.imageUrl || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc',
            endDate: campaignData.endDate,
            startDate: campaignData.startDate || new Date().toISOString(),
            status: campaignData.status,
            category: campaignData.category,
            requirements: campaignData.requirements ? 
              (typeof campaignData.requirements === 'string' ? 
                campaignData.requirements.split('\n').filter(Boolean) : 
                campaignData.requirements) : 
              [],
            shopId: campaignData.shop?._id || '',
            shopName: campaignData.shop?.name || 'Tienda',
            applicationsCount: campaignData.applicationsCount || 0
          };
          
          setCampaign(formattedCampaign);
          
          // Mostrar toast de éxito
          setToast({
            show: true,
            message: 'Campaña cargada correctamente',
            type: 'success'
          });
        } catch (error: any) {
          console.error('Error al cargar la campaña:', error);
          setError(error.message || 'Error al cargar los detalles de la campaña');
          
          // Mostrar toast de error
          setToast({
            show: true,
            message: 'Error al cargar los detalles de la campaña',
            type: 'error'
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign?.id) return;
    
    setApplying(true);
    
    try {
      // Mostrar toast de progreso
      setToast({
        show: true,
        message: 'Enviando tu solicitud...',
        type: 'info'
      });
      
      // Enviar la solicitud a la API
      await applyToCampaign(campaign.id, {
        message: proposal,
        socialMediaLinks: [], // Aquí podríamos añadir un campo para enlaces de redes sociales
        proposedFee: 0 // Y otro para la tarifa propuesta
      });
      
      // Actualizar el contador de aplicaciones localmente
      if (campaign) {
        setCampaign({
          ...campaign,
          applicationsCount: campaign.applicationsCount + 1
        });
      }
      
      // Mostrar mensaje de éxito
      setToast({
        show: true,
        message: '¡Tu solicitud ha sido enviada con éxito!',
        type: 'success'
      });
      
      setProposal('');
    } catch (error: any) {
      console.error('Error al aplicar a la campaña:', error);
      
      // Mostrar mensaje de error
      setToast({
        show: true,
        message: `Error: ${error.message || 'No se pudo enviar tu solicitud'}`,
        type: 'error'
      });
    } finally {
      setApplying(false);
    }
  };

  const isOwner = user?.shop?._id === campaign?.shopId;
  const canApply = isAuthenticated && !isOwner && campaign?.status === 'active';

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        <p className="text-gray-600 animate-pulse">Cargando detalles de la campaña...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error al cargar la campaña</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => navigate('/campaigns')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Volver a campañas
              </button>
              <button 
                onClick={retryFetch}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FaSync className="mr-2" /> Reintentar
              </button>
            </div>
          </div>
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
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Campaña no encontrada</h2>
        <p className="text-gray-600 mb-6">La campaña que estás buscando no existe o ha sido eliminada.</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Volver a campañas
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
        <button
          onClick={() => navigate('/campaigns')}
          className="text-red-500 hover:text-red-600 mb-4 flex items-center"
        >
          <FaArrowLeft className="mr-2" /> Volver a campañas
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-64 overflow-hidden">
            <CampaignImage
              src={campaign.imageUrl}
              alt={campaign.name}
              className="w-full h-full object-cover"
              campaignId={campaign.id}
            />
          </div>
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-800">{campaign.name}</h1>
              <div className="flex items-center gap-2">
                <ApplicationsCounter count={campaign.applicationsCount} size="sm" />
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                  campaign.status === 'closed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {campaign.status === 'active' ? 'Activa' : campaign.status === 'closed' ? 'Cerrada' : 'Borrador'}
                </span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <FaUserCircle className="mr-2" />
              <span>Publicado por: {campaign.shopName}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2" />
                <span>Fecha límite: {new Date(campaign.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMoneyBillWave className="mr-2" />
                <span>Presupuesto: ${campaign.budget}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaTag className="mr-2" />
                <span>Categoría: {campaign.category}</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h2>
              <p className="text-gray-600">{campaign.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Requisitos</h2>
              <ul className="list-disc pl-5 text-gray-600">
                {campaign.requirements.map((req, index) => (
                  <li key={index} className="mb-1">{req}</li>
                ))}
              </ul>
            </div>

            {canApply && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Postularme a esta campaña</h2>
                <form onSubmit={handleApply}>
                  <div className="mb-4">
                    <label htmlFor="proposal" className="block text-gray-700 mb-2">
                      Tu propuesta
                    </label>
                    <textarea
                      id="proposal"
                      value={proposal}
                      onChange={(e) => setProposal(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={6}
                      placeholder="Describe por qué eres el candidato ideal para esta campaña, tu experiencia previa y cómo planeas promocionar los productos..."
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className={`w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center ${applying ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {applying ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      'Enviar solicitud'
                    )}
                  </button>
                </form>
              </div>
            )}

            {isOwner && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Opciones de administrador</h2>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Editar campaña
                  </button>
                  <button
                    onClick={() => navigate(`/campaigns/${campaign.id}/applications`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Ver postulaciones
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('¿Estás seguro de que deseas cerrar esta campaña?')) {
                        try {
                          if (!campaign?.id) return;
                          
                          // Mostrar toast de progreso
                          setToast({
                            show: true,
                            message: 'Cerrando campaña...',
                            type: 'info'
                          });
                          
                          await updateCampaignStatus(campaign.id, 'closed');
                          
                          // Actualizar el estado local
                          setCampaign(campaign ? { ...campaign, status: 'closed' } : null);
                          
                          // Mostrar mensaje de éxito
                          setToast({
                            show: true,
                            message: 'Campaña cerrada correctamente',
                            type: 'success'
                          });
                        } catch (error: any) {
                          console.error('Error al cerrar la campaña:', error);
                          
                          // Mostrar mensaje de error
                          setToast({
                            show: true,
                            message: `Error: ${error.message || 'No se pudo cerrar la campaña'}`,
                            type: 'error'
                          });
                        }
                      }
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cerrar campaña
                  </button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">¿Quieres postularte a esta campaña?</h3>
                <p className="text-blue-600 mb-4">Inicia sesión o regístrate para poder enviar tu propuesta.</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Registrarme
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
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

export default CampaignDetailScreen;
