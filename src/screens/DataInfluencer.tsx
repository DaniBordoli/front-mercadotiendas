import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/organisms/Navbar';
import FooterHome from '../components/organisms/FooterHome/FooterHome';
import { updateInfluencerData, InfluencerDataForm } from '../services/userService';

function DataInfluencer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    category: '',
    niches: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNicheChange = (niche: string) => {
    setFormData(prev => {
      const niches = prev.niches.includes(niche)
        ? prev.niches.filter(n => n !== niche)
        : prev.niches.length < 5
        ? [...prev.niches, niche]
        : prev.niches;
      return { ...prev, niches };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.category) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    
    try {
      const influencerFormData: InfluencerDataForm = {
        username: formData.username,
        instagram: formData.instagram,
        tiktok: formData.tiktok,
        youtube: formData.youtube,
        category: formData.category,
        niches: formData.niches
      };
      
      await updateInfluencerData(influencerFormData);
      console.log('Datos de influencer guardados exitosamente');
      navigate('/success');
    } catch (error: any) {
      console.error('Error al guardar datos del influencer:', error);
      alert(error.message || 'Error al guardar los datos. Por favor intenta nuevamente.');
    }
  };

  const handleCompleteLater = async () => {
    // Guardar datos parciales si hay algún campo completado
    const hasData = formData.username || formData.instagram || formData.tiktok || formData.youtube || formData.category || formData.niches.length > 0;
    
    if (hasData) {
      try {
        const influencerFormData: InfluencerDataForm = {
          username: formData.username,
          instagram: formData.instagram,
          tiktok: formData.tiktok,
          youtube: formData.youtube,
          category: formData.category,
          niches: formData.niches
        };
        
        await updateInfluencerData(influencerFormData);
        console.log('Datos parciales guardados');
      } catch (error: any) {
        console.error('Error al guardar datos parciales:', error);
      }
    }
    
    navigate('/dashboard');
  };

  return (
    <>
      <div className="bg-[#f8f8f8] min-h-screen font-sans flex flex-col" style={{paddingTop: '2px'}}>
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-1 py-8 pt-20">
          <div className="max-w-4xl mx-auto px-6">
            {/* Progress Indicator */}
            <div className="mb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div className="w-16 h-1 bg-[#00a699] mx-2"></div>
                  <div className="w-10 h-10 bg-[#00a699] rounded-full flex items-center justify-center text-white font-semibold">
                    <i className="fa-solid fa-check text-sm"></i>
                  </div>
                  <div className="w-16 h-1 bg-[#ff4f41] mx-2"></div>
                  <div className="w-10 h-10 bg-[#ff4f41] rounded-full flex items-center justify-center text-white font-semibold">3</div>
                </div>
              </div>
              <p className="text-center text-[#666666]">Paso 3 de 3</p>
            </div>

            {/* Step 3: Influencer Configuration */}
            <div className="bg-white rounded-2xl shadow-lg border border-[#e5e5e7] p-6">
              <div className="text-center mb-4">
                <h1 className="text-3xl font-bold font-space text-[#1c1c1e] mb-2">Configurá tu perfil de influencer</h1>
                <p className="text-[#666666] text-lg">Completá estos datos para comenzar a colaborar con marcas y monetizar tu contenido</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Public Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Usuario público / @handle *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#666666] font-medium">@</span>
                    <input 
                      type="text" 
                      id="username" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="mi_usuario" 
                      className="w-full h-12 pl-8 pr-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                      required
                    />
                  </div>
                  <p className="text-xs text-[#666666] mt-1">Este será tu identificador único en MercadoTiendas</p>
                </div>

                {/* Social Networks */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-[#1c1c1e] mb-2">Redes sociales</h3>
                  
                  {/* Instagram */}
                  <div>
                    <label htmlFor="instagram" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      <i className="fab fa-instagram text-pink-500 mr-2"></i>Instagram
                    </label>
                    <input 
                      type="url" 
                      id="instagram" 
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/tu_usuario" 
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                    />
                  </div>

                  {/* TikTok */}
                  <div>
                    <label htmlFor="tiktok" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      <i className="fab fa-tiktok text-black mr-2"></i>TikTok
                    </label>
                    <input 
                      type="url" 
                      id="tiktok" 
                      name="tiktok"
                      value={formData.tiktok}
                      onChange={handleInputChange}
                      placeholder="https://tiktok.com/@tu_usuario" 
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                    />
                  </div>

                  {/* YouTube */}
                  <div>
                    <label htmlFor="youtube" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                      <i className="fab fa-youtube text-red-500 mr-2"></i>YouTube
                    </label>
                    <input 
                      type="url" 
                      id="youtube" 
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/c/tu_canal" 
                      className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Categoría principal *
                  </label>
                  <select 
                    id="category" 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-white rounded-lg border border-[#e5e5e7] text-[#1c1c1e] focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20 focus:border-[#ff4f41]"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="fashion">Moda y estilo</option>
                    <option value="beauty">Belleza y cuidado personal</option>
                    <option value="tech">Tecnología</option>
                    <option value="lifestyle">Estilo de vida</option>
                    <option value="fitness">Fitness y bienestar</option>
                    <option value="food">Gastronomía</option>
                    <option value="travel">Viajes</option>
                    <option value="gaming">Gaming</option>
                    <option value="home">Hogar y decoración</option>
                    <option value="entertainment">Entretenimiento</option>
                  </select>
                </div>

                {/* Niches */}
                <div>
                  <label className="block text-sm font-medium text-[#1c1c1e] mb-2">
                    Nichos específicos
                  </label>
                  <p className="text-xs text-[#666666] mb-3">Seleccioná hasta 5 nichos donde te especializás</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'streetwear', label: 'Streetwear' },
                      { id: 'makeup', label: 'Makeup' },
                      { id: 'skincare', label: 'Skincare' },
                      { id: 'accessories', label: 'Accesorios' },
                      { id: 'sneakers', label: 'Sneakers' },
                      { id: 'wellness', label: 'Wellness' }
                    ].map(niche => (
                      <div key={niche.id} className="inline-flex items-center">
                        <input 
                          type="checkbox" 
                          id={`niche-${niche.id}`}
                          checked={formData.niches.includes(niche.id)}
                          onChange={() => handleNicheChange(niche.id)}
                          className="mr-2 rounded border-[#e5e5e7] text-[#ff4f41] focus:ring-[#ff4f41]"
                        />
                        <label htmlFor={`niche-${niche.id}`} className="text-sm text-[#1c1c1e]">{niche.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 h-12 bg-[#ff4f41] text-white font-semibold rounded-lg hover:bg-[#ff4f41]/90 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20"
                  >
                    Guardar y finalizar
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCompleteLater}
                    className="flex-1 h-12 bg-white border border-[#e5e5e7] text-[#666666] font-medium rounded-lg hover:bg-[#f8f8f8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff4f41]/20"
                  >
                    Completar más tarde
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
      
      <FooterHome />
    </>
  );
}

export default DataInfluencer;