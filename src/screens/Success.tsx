import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { useAuthStore } from '../stores/slices/authSlice';

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  // Obtener roles del state de navegación o del usuario autenticado
  const getUserTypes = () => {
    // Si viene desde /role-configuration, usar los roles del state
    if (location.state?.selectedRoles) {
      return location.state.selectedRoles;
    }
    // Fallback: usar los roles del usuario autenticado
    return user?.userType || [];
  };

  const handleExploreMarketplace = () => {
    navigate('/dashboard');
  };

  const handleConfigureProfile = () => {
    navigate('/data-dashboard');
  };

  const handleHelpCenter = () => {
    // Implementar navegación al centro de ayuda
    console.log('Navegando al centro de ayuda');
  };

  const handleConnectInfluencers = () => {
    // Implementar navegación para conectar con otros influencers
    console.log('Conectando con otros influencers');
  };

  const handleInfluencerGuide = () => {
    // Implementar navegación a la guía para influencers
    console.log('Navegando a la guía para influencers');
  };

  // Función para obtener el mensaje personalizado según el tipo de usuario
  const getSuccessMessage = () => {
    const userTypes = getUserTypes();
    const primaryType = userTypes[0] || 'buyer';
    
    switch (primaryType.toLowerCase()) {
      case 'buyer':
      case 'comprador':
        return 'Has completado exitosamente tu configuración como comprador. Ahora podés comenzar a comprar en MercadoTiendas.';
      case 'seller':
      case 'vendedor':
        return 'Has completado exitosamente tu configuración como vendedor. Ahora podés comenzar a vender tus productos en MercadoTiendas.';
      case 'influencer':
        return 'Has completado exitosamente tu configuración como influencer. Ahora podés comenzar a colaborar con marcas y monetizar tu contenido en MercadoTiendas.';
      default:
        return 'Has completado exitosamente tu configuración. Ahora podés comenzar a usar MercadoTiendas.';
    }
  };

  // Función para renderizar los roles activos
  const renderActiveRoles = () => {
    const userTypes = getUserTypes();
    
    return userTypes.map((type: string, index: number) => {
      const roleConfig = {
        buyer: {
          icon: 'fa-solid fa-cart-shopping',
          color: '#00a699',
          label: 'Comprador'
        },
        comprador: {
          icon: 'fa-solid fa-cart-shopping',
          color: '#00a699',
          label: 'Comprador'
        },
        seller: {
          icon: 'fa-solid fa-store',
          color: '#ff4f41',
          label: 'Vendedor'
        },
        vendedor: {
          icon: 'fa-solid fa-store',
          color: '#ff4f41',
          label: 'Vendedor'
        },
        influencer: {
          icon: 'fa-solid fa-star',
          color: '#ff4f41',
          label: 'Influencer'
        }
      };
      
      const config = roleConfig[type.toLowerCase() as keyof typeof roleConfig] || roleConfig.buyer;
      
      return (
        <div key={index} className={`inline-flex items-center px-4 py-2 rounded-full border`} 
             style={{ 
               backgroundColor: `${config.color}1A`, 
               borderColor: `${config.color}33` 
             }}>
          <i className={`${config.icon} mr-2`} style={{ color: config.color }}></i>
          <span className="font-medium" style={{ color: config.color }}>{config.label}</span>
        </div>
      );
    });
  };

  return (
    <>
      <div className="bg-[#f8f8f8] min-h-screen font-sans flex flex-col" style={{paddingTop: '20px'}}>
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1" style={{paddingTop: '20px', paddingBottom: '20px'}}>
          <div className="max-w-4xl mx-auto px-6">
            {/* Success Screen */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8 text-center">
              {/* Success Icon */}
              <div className="w-24 h-24 bg-[#00a699] rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-check text-white text-3xl"></i>
              </div>

              {/* Success Message */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold font-space text-[#1c1c1e] mb-4">¡Tu perfil está listo!</h1>
                <p className="text-[#666666] text-lg max-w-2xl mx-auto">
                  {getSuccessMessage()}
                </p>
              </div>

              {/* Active Roles Display */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-[#1c1c1e] mb-4">Tus roles activos</h2>
                <div className="flex flex-wrap justify-center gap-3">
                  {renderActiveRoles()}
                </div>
              </div>

              {/* Next Actions */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#1c1c1e] mb-6">¿Qué querés hacer ahora?</h2>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* Explore Marketplace */}
                  <button 
                    onClick={handleExploreMarketplace}
                    className="h-16 bg-[#ff4f41] text-white font-semibold rounded-lg hover:bg-[#ff4f41]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-store text-xl"></i>
                    <span>Explorar Marketplace</span>
                  </button>

                  {/* Configure Profile */}
                  <button 
                    onClick={handleConfigureProfile}
                    className="h-16 bg-white border-2 border-[#ff4f41] text-[#ff4f41] font-semibold rounded-lg hover:bg-[#ff4f41]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 flex items-center justify-center gap-3"
                  >
                    <i className="fa-solid fa-user-gear text-xl"></i>
                    <span>Configurar perfil</span>
                  </button>
                </div>

                {/* Secondary Actions - Only for Influencers */}
                {getUserTypes().includes('influencer') && (
                  <div className="pt-6 border-t border-[#e5e5e7] mt-8">
                    <div className="flex flex-wrap justify-center gap-4">
                      <button 
                        onClick={handleHelpCenter}
                        className="text-[#666666] hover:text-[#ff4f41] transition-colors font-medium"
                      >
                        <i className="fa-solid fa-question-circle mr-2"></i>
                        Centro de ayuda
                      </button>
                      <button 
                        onClick={handleConnectInfluencers}
                        className="text-[#666666] hover:text-[#ff4f41] transition-colors font-medium"
                      >
                        <i className="fa-solid fa-users mr-2"></i>
                        Conectar con otros influencers
                      </button>
                      <button 
                        onClick={handleInfluencerGuide}
                        className="text-[#666666] hover:text-[#ff4f41] transition-colors font-medium"
                      >
                        <i className="fa-solid fa-book mr-2"></i>
                        Guía para influencers
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        <FooterHome />
      </div>
    </>
  );
}

export default Success;