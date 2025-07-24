import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { DesignButton } from '../components/atoms/DesignButton';
import { InputDefault } from '../components/atoms/InputDefault/InputDefault';
import Toast from '../components/atoms/Toast';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';

interface SocialMedia {
  platform: string;
  username: string;
  followers: string;
}

interface InfluencerData {
  niche: string;
  bio: string;
  socialMedia: SocialMedia[];
}

export const BecomeInfluencerScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, forceLoadProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'info',
  });

  const [formData, setFormData] = useState<InfluencerData>({
    niche: '',
    bio: '',
    socialMedia: [
      { platform: 'instagram', username: '', followers: '' },
      { platform: 'tiktok', username: '', followers: '' },
      { platform: 'youtube', username: '', followers: '' },
      { platform: 'twitter', username: '', followers: '' },
    ],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSocialMediaChange = (index: number, field: string, value: string) => {
    const updatedSocialMedia = [...formData.socialMedia];
    updatedSocialMedia[index] = {
      ...updatedSocialMedia[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      socialMedia: updatedSocialMedia,
    });
  };

  const validateForm = (): boolean => {
    // Verificar que al menos un campo de redes sociales esté completo
    const hasCompleteSocialMedia = formData.socialMedia.some(
      (sm) => sm.username.trim() !== '' && sm.followers.trim() !== ''
    );

    if (!hasCompleteSocialMedia) {
      setToast({
        show: true,
        message: 'Debes completar al menos una red social con nombre de usuario y seguidores',
        type: 'error',
      });
      return false;
    }

    if (formData.niche.trim() === '') {
      setToast({
        show: true,
        message: 'Debes seleccionar un nicho',
        type: 'error',
      });
      return false;
    }

    if (formData.bio.trim() === '') {
      setToast({
        show: true,
        message: 'Debes proporcionar una biografía',
        type: 'error',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Filtrar solo las redes sociales que tienen datos
      const filledSocialMedia = formData.socialMedia.filter(
        (sm) => sm.username.trim() !== '' && sm.followers.trim() !== ''
      );

      // Preparar los datos para enviar al backend
      const influencerData = {
        niche: formData.niche,
        bio: formData.bio,
        socialMedia: filledSocialMedia,
      };

      // Aquí iría la llamada a la API para convertirse en influencer
      // Por ahora, simularemos una respuesta exitosa
      console.log('Enviando datos de influencer:', influencerData);
      
      // Simular un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar el perfil del usuario para reflejar que ahora es influencer
      await forceLoadProfile();
      
      setToast({
        show: true,
        message: '¡Felicidades! Tu solicitud para ser influencer ha sido enviada.',
        type: 'success',
      });
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        navigate('/user-dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error al enviar la solicitud de influencer:', error);
      setToast({
        show: true,
        message: 'Ocurrió un error al enviar tu solicitud. Por favor intenta nuevamente.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const nicheOptions = [
    'Moda',
    'Belleza',
    'Fitness',
    'Comida',
    'Viajes',
    'Tecnología',
    'Gaming',
    'Lifestyle',
    'Educación',
    'Otro',
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Conviértete en Influencer</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-700 mb-4">
          Únete a nuestra red de influencers y accede a campañas exclusivas con las mejores marcas.
          Completa el siguiente formulario para comenzar.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Selecciona tu nicho principal
            </label>
            <select
              name="niche"
              value={formData.niche}
              onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Selecciona un nicho</option>
              {nicheOptions.map((niche) => (
                <option key={niche} value={niche.toLowerCase()}>
                  {niche}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Cuéntanos sobre ti (Biografía)
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]"
              placeholder="Describe tu experiencia, estilo y lo que te hace único como influencer..."
              required
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Tus redes sociales</h3>
            <p className="text-sm text-gray-600 mb-4">
              Completa al menos una red social donde tengas presencia como influencer
            </p>
            
            <div className="space-y-4">
              {formData.socialMedia.map((social, index) => (
                <div key={social.platform} className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2 w-full md:w-1/3">
                    {getSocialIcon(social.platform)}
                    <span className="capitalize">{social.platform}</span>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <InputDefault
                      type="text"
                      value={social.username}
                      onChange={(value) => handleSocialMediaChange(index, 'username', value)}
                      placeholder={`Usuario de ${social.platform}`}
                    />
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <InputDefault
                      type="text"
                      value={social.followers}
                      onChange={(value) => handleSocialMediaChange(index, 'followers', value)}
                      placeholder="Número de seguidores"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center pt-4">
            <DesignButton
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? 'Enviando solicitud...' : 'Enviar solicitud'}
            </DesignButton>
          </div>
        </form>
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

export default BecomeInfluencerScreen;
