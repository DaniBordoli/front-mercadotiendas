import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { FaCloudUploadAlt, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { getCampaignById, updateCampaign, uploadCampaignImage, Campaign } from '../services/campaignService';
import { validateImage, fileToDataUrl } from '../services/imageService';
import { MAX_FILE_SIZE } from '../config';
import Toast from '../components/atoms/Toast';

export const CampaignEditScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(false);
  const [loadingCampaign, setLoadingCampaign] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    category: '',
    startDate: new Date().toISOString().split('T')[0], // Fecha actual como valor predeterminado
    endDate: '',
    requirements: [''] // Array para almacenar los requisitos
  });

  // Cargar datos de la campaña
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      try {
        setLoadingCampaign(true);
        const response = await getCampaignById(id);
        const campaign = response.data;
        
        // Guardar la campaña en el estado
        setCampaign(campaign);
        
        // Verificar que el usuario es el dueño de la tienda
        if (user?.shop?._id !== campaign.shop._id) {
          setToast({
            show: true,
            message: 'No tienes permiso para editar esta campaña',
            type: 'error'
          });
          navigate(`/campaigns/${id}`);
          return;
        }
        
        // Formatear los requisitos como array
        const requirementsArray = campaign.requirements 
          ? (typeof campaign.requirements === 'string' 
              ? campaign.requirements.split('\n').filter(Boolean) 
              : campaign.requirements)
          : [''];
        
        // Establecer los datos del formulario
        setFormData({
          name: campaign.name || '',
          description: campaign.description || '',
          budget: campaign.budget ? campaign.budget.toString() : '',
          category: campaign.category || '',
          startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
          requirements: requirementsArray
        });
        
        // Establecer la imagen de previsualización
        if (campaign.imageUrl) {
          console.log('Cargando imagen de la campaña:', campaign.imageUrl);
          setImagePreview(campaign.imageUrl);
        }
        
      } catch (error: any) {
        console.error('Error al cargar la campaña:', error);
        setToast({
          show: true,
          message: `Error: ${error.message || 'No se pudo cargar la campaña'}`,
          type: 'error'
        });
      } finally {
        setLoadingCampaign(false);
      }
    };
    
    fetchCampaign();
  }, [id, navigate, user?.shop?._id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Manejar cambios en los requisitos
  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  // Añadir un nuevo campo de requisito
  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  // Eliminar un campo de requisito
  const removeRequirement = (index: number) => {
    if (formData.requirements.length <= 1) return;
    
    const updatedRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  // Manejar cambio de imagen
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validar la imagen
    const validation = validateImage(file);
    if (!validation.isValid) {
      setToast({
        show: true,
        message: validation.errorMessage || 'Error al validar la imagen',
        type: 'error'
      });
      e.target.value = '';
      return;
    }
    
    try {
      // Convertir a URL de datos para previsualización
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(dataUrl);
      setImageFile(file);
    } catch (error) {
      setToast({
        show: true,
        message: 'Error al cargar la imagen',
        type: 'error'
      });
      console.error('Error al cargar la imagen:', error);
    }
  };

  // Eliminar la imagen seleccionada
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
  };

  // Validar el formulario
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la campaña es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.budget || isNaN(parseFloat(formData.budget)) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = 'El presupuesto debe ser un número mayor que cero';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de finalización es obligatoria';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endDate = new Date(formData.endDate);
      if (endDate <= today) {
        newErrors.endDate = 'La fecha de finalización debe ser posterior a hoy';
      }
    }
    
    const filteredRequirements = formData.requirements.filter(req => req.trim() !== '');
    if (filteredRequirements.length === 0) {
      newErrors.requirements = 'Debe especificar al menos un requisito';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar el formulario antes de enviar
    if (!validateForm()) {
      setToast({
        show: true,
        message: 'Por favor, completa todos los campos obligatorios',
        type: 'error'
      });
      return;
    }
    
    if (!id) return;
    
    setLoading(true);

    try {
      // Filtrar requisitos vacíos
      const filteredRequirements = formData.requirements.filter(req => req.trim() !== '');
      
      // Preparar los datos para enviar a la API
      const campaignData = {
        name: formData.name,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        requirements: filteredRequirements.join('\n'), // Convertir array a string con saltos de línea
      };
      
      // Manejo de la imagen:
      let imageUpdated = false;
      let imageResponse: { success: boolean; imageUrl: string; message: string } | null = null;
      
      // 1. Si hay una nueva imagen (imageFile), subirla primero
      if (imageFile) {
        try {
          console.log('Subiendo nueva imagen para la campaña...');
          imageResponse = await uploadCampaignImage(imageFile, id);
          
          if (imageResponse?.success && imageResponse?.imageUrl) {
            const imageUrl = imageResponse.imageUrl; // Guardar en variable local para evitar accesos nulos
            imageUpdated = true;
            console.log('Nueva imagen subida correctamente:', imageUrl);
            
            // Actualizar la URL de la imagen en el estado local y la previsualización
            setCampaign(prev => prev ? {
              ...prev,
              imageUrl: imageUrl
            } : prev);
            
            // Actualizar también la previsualización
            setImagePreview(imageUrl);
          } else {
            console.error('La respuesta de subida de imagen no fue exitosa:', imageResponse);
          }
        } catch (imageError: any) {
          console.error('Error al subir la imagen:', imageError);
          setToast({
            show: true,
            message: `Error al subir la imagen: ${imageError?.message || 'Error desconocido'}`,
            type: 'error'
          });
          // Continuamos con la actualización de la campaña sin la imagen
        }
      } else {
        console.log('Manteniendo la imagen actual de la campaña');
      }
      
      // 2. Actualizar la campaña
      console.log('Actualizando datos de la campaña...');
      const updateResponse = await updateCampaign(id, campaignData);
      console.log('Respuesta de actualización de campaña:', updateResponse);
      
      // 3. Verificar que la campaña se actualizó correctamente
      const updatedCampaign = await getCampaignById(id);
      console.log('Campaña actualizada:', updatedCampaign);
      
      // Actualizar el estado local con los datos más recientes
      setCampaign(updatedCampaign.data);
      
      // Verificar si la imagen se actualizó correctamente
      if (imageUpdated && updatedCampaign.data.imageUrl) {
        console.log('Verificando URL de imagen actualizada:', updatedCampaign.data.imageUrl);
        // Actualizar la previsualización con la URL más reciente
        setImagePreview(updatedCampaign.data.imageUrl);
      }
      
      // Mostrar mensaje de éxito y redirigir
      setToast({
        show: true,
        message: '¡Campaña actualizada con éxito!' + (imageUpdated ? ' (Imagen actualizada)' : ' (Imagen mantenida)'),
        type: 'success'
      });
      
      // Esperar un momento antes de redirigir para que el usuario vea el mensaje
      setTimeout(() => {
        navigate(`/campaigns/${id}`);
      }, 1500);
    } catch (error: any) {
      console.error('Error al actualizar la campaña:', error);
      setToast({
        show: true,
        message: `Error: ${error.message || 'Ocurrió un error al actualizar la campaña'}`,
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCampaign) {
    return (
      <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(`/campaigns/${id}`)}
            className="text-red-500 hover:text-red-600 mr-4"
          >
            <FaArrowLeft className="inline mr-2" /> Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Editar Campaña</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Nombre de la campaña *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="Nombre de la campaña"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[120px]`}
                  placeholder="Describe los detalles de la campaña, objetivos, etc."
                  required
                ></textarea>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Presupuesto (USD) *
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.budget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                  placeholder="1000"
                  min="0"
                  step="100"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="moda">Moda</option>
                  <option value="belleza">Belleza</option>
                  <option value="tecnologia">Tecnología</option>
                  <option value="hogar">Hogar y Decoración</option>
                  <option value="alimentos">Alimentos y Bebidas</option>
                  <option value="salud">Salud y Bienestar</option>
                  <option value="deportes">Deportes</option>
                  <option value="viajes">Viajes</option>
                  <option value="entretenimiento">Entretenimiento</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>
            
            {/* Columna derecha */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Fecha de finalización *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Requisitos para aplicar *
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder={`Requisito ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      disabled={formData.requirements.length <= 1}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirement}
                  className="mt-2 text-blue-500 hover:text-blue-700 text-sm font-medium"
                >
                  + Añadir otro requisito
                </button>
                {errors.requirements && (
                  <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Imagen de la campaña
                </label>
                <div className={`border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 text-center relative`}>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Vista previa"
                        className="mx-auto h-48 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="campaign-image-upload" className="cursor-pointer block">
                        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Haz clic para seleccionar una imagen o arrastra y suelta aquí
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG o JPEG (máx. {MAX_FILE_SIZE / (1024 * 1024)}MB)
                        </p>
                      </label>
                      <input
                        id="campaign-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/campaigns/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </div>
        </form>
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

export default CampaignEditScreen;
