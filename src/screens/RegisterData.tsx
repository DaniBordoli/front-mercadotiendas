import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { updateUserType } from '../services/userService';

function RegisterData() {
  const navigate = useNavigate();
  const [selectedRoles, setSelectedRoles] = useState<('buyer' | 'seller' | 'influencer')[]>([]);

  const handleRoleSelect = useCallback((role: 'buyer' | 'seller' | 'influencer') => {
    setSelectedRoles(prevRoles => {
      if (prevRoles.includes(role)) {
        // Si el rol ya está seleccionado, lo removemos
        return prevRoles.filter(r => r !== role);
      } else {
        // Si el rol no está seleccionado, lo agregamos
        return [...prevRoles, role];
      }
    });
  }, []);

  const handleContinue = useCallback(async () => {
    if (selectedRoles.length === 0) {
      alert('Por favor selecciona al menos un rol');
      return;
    }
    
    try {
      console.log('Roles seleccionados:', selectedRoles);
      
      // Actualizar el tipo de usuario en la base de datos
      await updateUserType(selectedRoles);
      
      console.log('Tipo de usuario actualizado exitosamente');
      
      // Navegar según la cantidad de roles seleccionados
      if (selectedRoles.length > 1) {
        // Si seleccionó más de un rol, ir a configuración de roles
        navigate('/role-configuration');
      } else {
        // Si seleccionó un solo rol, usar la lógica anterior
        if (selectedRoles.includes('seller')) {
          navigate('/data-seller');
        } else {
          navigate('/register/basic-data');
        }
      }
    } catch (error) {
      console.error('Error al actualizar tipo de usuario:', error);
      alert('Error al guardar el tipo de usuario. Por favor intenta de nuevo.');
    }
  }, [selectedRoles, navigate]);

  return (
    <>
      <div className="bg-[#f8f8f8] min-h-screen font-sans flex flex-col" style={{paddingTop: '2px'}}>
        <Navbar />
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-center" style={{paddingTop: '0px', paddingBottom: '50px'}}>
          <div className="max-w-4xl mx-auto px-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div className="w-16 h-1 bg-[#ff4f41] mx-2"></div>
                  <div className="w-10 h-10 bg-[#ff4f41] rounded-full flex items-center justify-center text-white font-semibold">2</div>
                  <div className="w-16 h-1 bg-[#e5e5e7] mx-2"></div>
                  <div className="w-10 h-10 bg-[#e5e5e7] rounded-full flex items-center justify-center text-[#666666] font-semibold">3</div>
                </div>
              </div>
              <p className="text-center text-[#666666]">Paso 2 de 3</p>
            </div>

            {/* Step 2: Role Selection */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Elegí cómo querés usar MercadoTiendas</h1>
                <p className="text-[#666666] text-lg">Podés cambiar de rol más tarde desde tu perfil</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {/* Buyer Card */}
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedRoles.includes('buyer') 
                      ? 'border-[#ff4f41] bg-[#ff4f41]/5' 
                      : 'border-[#e5e5e7] bg-white hover:border-[#ff4f41]/50'
                  }`}
                  onClick={() => handleRoleSelect('buyer')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#ff4f41] rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-shopping-cart text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1c1c1e] mb-2">Comprador</h3>
                    <p className="text-[#666666] text-sm">Explorá productos únicos y comprá de tiendas verificadas</p>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedRoles.includes('buyer')
                          ? 'bg-[#ff4f41] text-white'
                          : 'bg-[#e5e5e7] text-[#666666]'
                      }`}>
                        {selectedRoles.includes('buyer') ? (
                          <><i className="fa-solid fa-check mr-1"></i>Seleccionado</>
                        ) : (
                          'Seleccionar'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seller Card */}
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedRoles.includes('seller') 
                      ? 'border-[#ff4f41] bg-[#ff4f41]/5' 
                      : 'border-[#e5e5e7] bg-white hover:border-[#ff4f41]/50'
                  }`}
                  onClick={() => handleRoleSelect('seller')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#00a699] rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-store text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1c1c1e] mb-2">Vendedor</h3>
                    <p className="text-[#666666] text-sm">Creá tu tienda online y vendé tus productos</p>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedRoles.includes('seller')
                          ? 'bg-[#ff4f41] text-white'
                          : 'bg-[#e5e5e7] text-[#666666]'
                      }`}>
                        {selectedRoles.includes('seller') ? (
                          <><i className="fa-solid fa-check mr-1"></i>Seleccionado</>
                        ) : (
                          'Seleccionar'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Influencer Card */}
                <div 
                  className={`border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedRoles.includes('influencer') 
                      ? 'border-[#ff4f41] bg-[#ff4f41]/5' 
                      : 'border-[#e5e5e7] bg-white hover:border-[#ff4f41]/50'
                  }`}
                  onClick={() => handleRoleSelect('influencer')}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#ff4f41] rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fa-solid fa-star text-white text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-[#1c1c1e] mb-2">Influencer</h3>
                    <p className="text-[#666666] text-sm">Colaborá con marcas y monetizá tu contenido</p>
                    <div className="mt-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedRoles.includes('influencer')
                          ? 'bg-[#ff4f41] text-white'
                          : 'bg-[#e5e5e7] text-[#666666]'
                      }`}>
                        {selectedRoles.includes('influencer') ? (
                          <><i className="fa-solid fa-check mr-1"></i>Seleccionado</>
                        ) : (
                          'Seleccionar'
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center">
                <button 
                  type="button" 
                  onClick={handleContinue}
                  className="px-8 h-12 bg-[#ff4f41] text-white font-semibold rounded-lg hover:bg-[#ff4f41]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <FooterHome />
    </>
  );
}

export default RegisterData;