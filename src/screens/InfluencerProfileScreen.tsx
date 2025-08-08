import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { DesignButton } from '../components/atoms/DesignButton';
import Toast from '../components/atoms/Toast';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';

interface SocialMedia {
  platform: string;
  username: string;
  followers: string;
}

interface InfluencerProfile {
  niche: string;
  bio: string;
  socialMedia: SocialMedia[];
  stats: {
    totalApplications: number;
    acceptedApplications: number;
    completedCampaigns: number;
    rating: number;
  };
}

export const InfluencerProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  // Datos de ejemplo para el perfil de influencer
  const [profile, setProfile] = useState<InfluencerProfile>({
    niche: 'moda',
    bio: 'Influencer especializado en moda y tendencias actuales. Colaboro con marcas para crear contenido auténtico y atractivo.',
    socialMedia: [
      { platform: 'instagram', username: 'fashionista', followers: '10000' },
      { platform: 'tiktok', username: 'fashion_trends', followers: '5000' },
      { platform: 'youtube', username: '', followers: '' },
      { platform: 'twitter', username: 'fashion_tweets', followers: '3000' },
    ],
    stats: {
      totalApplications: 15,
      acceptedApplications: 8,
      completedCampaigns: 5,
      rating: 4.7,
    },
  });

  useEffect(() => {
    // Aquí cargaríamos los datos reales del perfil del influencer desde la API
    // Por ahora, simulamos una carga
    const loadProfile = async () => {
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // En una implementación real, aquí haríamos una llamada a la API
        // const response = await fetch(`/api/influencer-profile/${user._id}`);
        // const data = await response.json();
        // setProfile(data);
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el perfil de influencer:', error);
        setToast({
          show: true,
          message: 'Error al cargar tu perfil de influencer',
          type: 'error',
        });
        setLoading(false);
      }
    };

    if (user && user.isInfluencer) {
      loadProfile();
    } else {
      navigate('/user-dashboard');
    }
  }, [user, navigate]);

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <FaInstagram className="text-xl" />;
      case 'tiktok':
        return <FaTiktok className="text-xl" />;
      case 'youtube':
        return <FaYoutube className="text-xl" />;
      case 'twitter':
        return <FaTwitter className="text-xl" />;
      default:
        return null;
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-influencer-profile');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil de Influencer</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna izquierda - Información personal */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden">
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-600 capitalize">{profile.niche}</p>
            </div>
            
            <div className="mt-4">
              <DesignButton
                variant="secondary"
                onClick={handleEditProfile}
                className="w-full"
              >
                Editar Perfil
              </DesignButton>
            </div>
          </div>
          
          {/* Redes sociales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Redes Sociales</h3>
            <div className="space-y-4">
              {profile.socialMedia
                .filter(social => social.username)
                .map((social) => (
                  <div key={social.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSocialIcon(social.platform)}
                      <span className="capitalize">{social.platform}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">@{social.username}</span>
                      <span className="text-xs text-gray-500">{parseInt(social.followers).toLocaleString()} seguidores</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Estadísticas y biografía */}
        <div className="md:col-span-2">
          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-500">{profile.stats.totalApplications}</p>
                <p className="text-sm text-gray-600">Aplicaciones</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-500">{profile.stats.acceptedApplications}</p>
                <p className="text-sm text-gray-600">Aceptadas</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-500">{profile.stats.completedCampaigns}</p>
                <p className="text-sm text-gray-600">Completadas</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-500">{profile.stats.rating}</p>
                <p className="text-sm text-gray-600">Calificación</p>
              </div>
            </div>
          </div>
          
          {/* Biografía */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Biografía</h3>
            <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
          </div>
          
          {/* Campañas recientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Campañas Recientes</h3>
              <DesignButton
                variant="neutral"
                onClick={() => navigate('/my-applications')}
              >
                Ver todas
              </DesignButton>
            </div>
            
            {profile.stats.acceptedApplications > 0 ? (
              <div className="space-y-4">
                {/* Aquí irían las campañas recientes del influencer */}
                <p className="text-gray-600">Mostrando las campañas más recientes en las que has participado.</p>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">Aún no has participado en ninguna campaña</p>
                <DesignButton
                  variant="secondary"
                  onClick={() => navigate('/campaigns')}
                >
                  Explorar Campañas
                </DesignButton>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        duration={3000}
      />
    </div>
  );
};

export default InfluencerProfileScreen;
