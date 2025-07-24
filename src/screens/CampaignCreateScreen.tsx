import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { Navbar } from '../components/organisms/Navbar/Navbar';
import { createCampaign } from '../services/campaignService';
import { validateImage, fileToDataUrl } from '../services/imageService';
// Importamos solo lo que necesitamos para evitar errores de importación
import { API_URL } from '../config';
import Toast from '../components/atoms/Toast';
import CampaignImage from '../components/atoms/CampaignImage';

export const CampaignCreateScreen: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    startDate: '',
    endDate: '',
    requirements: ['']
  });

  // Verificar si el usuario tiene una tienda
  if (!user || !user.shop) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso restringido</h2>
        <p className="text-gray-600 mb-6">Necesitas tener una tienda para crear campañas.</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Volver a campañas
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const updatedRequirements = formData.requirements.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        requirements: updatedRequirements
      }));
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log('No se seleccionó ningún archivo');
      return;
    }
    
    console.log('Archivo seleccionado:', {
      nombre: file.name,
      tipo: file.type,
      tamaño: `${(file.size / 1024).toFixed(2)} KB`
    });
    
    // Validar la imagen
    const validation = validateImage(file);
    if (!validation.isValid) {
      console.error('Error de validación de imagen:', validation.errorMessage);
      setToast({
        show: true,
        message: validation.errorMessage || 'Error al validar la imagen',
        type: 'error'
      });
      e.target.value = '';
      return;
    }
    
    try {
      console.log('Convirtiendo imagen para previsualización...');
      // Convertir a URL de datos para previsualización
      const dataUrl = await fileToDataUrl(file);
      console.log('Imagen convertida exitosamente. Actualizando estado...');
      setImagePreview(dataUrl);
      setImageFile(file);
      console.log('Estado de imagen actualizado correctamente');
    } catch (error) {
      console.error('Error al cargar la imagen para previsualización:', error);
      setToast({
        show: true,
        message: 'Error al cargar la imagen',
        type: 'error'
      });
    }
  };

  // Validar el formulario
  const validateForm = (): Record<string, string> => {
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
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (endDate < today) {
        newErrors.endDate = 'La fecha de finalización no puede ser anterior a hoy';
      }
    }
    
    const filteredRequirements = formData.requirements.filter(req => req.trim() !== '');
    if (filteredRequirements.length === 0) {
      newErrors.requirements = 'Debe especificar al menos un requisito';
    }
    
    if (!imageFile && !imagePreview) {
      newErrors.image = 'La imagen de la campaña es obligatoria';
    }
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Iniciando proceso de creación de campaña');
    
    // Validar el formulario
    console.log('Validando formulario...');
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      console.log('Errores de validación encontrados:', formErrors);
      setErrors(formErrors);
      
      // Desplazarse al primer error
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      
      setToast({
        show: true,
        message: 'Por favor corrige los errores en el formulario',
        type: 'error'
      });
      return;
    }
    
    console.log('Formulario validado correctamente');
    setLoading(true);
    
    try {
      // Mostrar toast de progreso
      setToast({
        show: true,
        message: 'Creando campaña...',
        type: 'info'
      });
      
      // Filtrar requisitos vacíos y unirlos en un string
      const filteredRequirements = formData.requirements
        .filter(req => req.trim() !== '')
        .join('\n');
      
      // Crear objeto de campaña con todos los campos requeridos
      const campaignData = {
        name: formData.name,
        description: formData.description,
        budget: parseFloat(formData.budget),
        category: formData.category,
        startDate: formData.startDate || new Date().toISOString(),
        endDate: formData.endDate,
        requirements: filteredRequirements,
        status: 'active' as const,
        shop: user?.shop?._id || '',
        imageUrl: ''
      };
      
      console.log('Datos de campaña preparados:', campaignData);
      console.log('Estado de la imagen:', {
        hayImagen: !!imageFile,
        nombreArchivo: imageFile?.name,
        tamaño: imageFile ? `${(imageFile.size / 1024).toFixed(2)} KB` : 'N/A',
        previsualización: !!imagePreview
      });
      
      // Enviar datos al servidor
      console.log('Enviando datos al servidor...');
      const response = await createCampaign(campaignData, imageFile || undefined);
      console.log('Respuesta del servidor:', response);
      
      // Verificar si la imagen se subió correctamente
      if (imageFile && response.data?.imageUrl) {
        console.log('URL de imagen guardada:', response.data.imageUrl);
      } else if (imageFile && !response.data?.imageUrl) {
        console.warn('Se seleccionó una imagen pero no se guardó la URL en la respuesta');
      }
      
      // Mostrar mensaje de éxito
      setToast({
        show: true,
        message: '¡Campaña creada exitosamente! Redirigiendo...',
        type: 'success'
      });
      
      // Redireccionar a la página de detalle de la campaña
      const campaignId = response.data?._id || response.id;
      console.log('Redirigiendo a la página de detalle:', `/campaigns/${campaignId}`);
      setTimeout(() => {
        navigate(`/campaigns/${campaignId}`);
      }, 2000);
      
    } catch (error: any) {
      console.error('Error al crear la campaña:', error);
      console.error('Detalles del error:', {
        mensaje: error.message,
        respuesta: error.response?.data,
        estado: error.response?.status
      });
      
      // Mensaje de error más específico si está disponible
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Error al crear la campaña. Por favor intenta nuevamente.';
      
      setToast({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setLoading(false);
      console.log('Proceso de creación de campaña finalizado');
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#F8F8F8' }}>
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/campaigns')}
          className="text-red-500 hover:text-red-600 mr-4"
        >
          ← Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Crear nueva campaña</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Nombre de la campaña *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Nombre de la campaña"
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Descripción detallada *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Describe los detalles de tu campaña"
                rows={4}
                required
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">
                Presupuesto (USD) *
              </label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.budget ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                placeholder="Ej: 5000"
                min="1"
                step="0.01"
                required
              />
              {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
            </div>

            <div>
              <label htmlFor="category" className="block text-gray-700 font-medium mb-2">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="Moda">Moda</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Belleza">Belleza</option>
                <option value="Hogar">Hogar y Decoración</option>
                <option value="Deportes">Deportes</option>
                <option value="Alimentos">Alimentos y Bebidas</option>
                <option value="Viajes">Viajes</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                Fecha de inicio *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.startDate ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                required
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                Fecha límite de aplicación *
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500`}
                required
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Requisitos para influencers *
              </label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) => handleRequirementChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ej: Mínimo 5,000 seguidores en Instagram"
                    required={index === 0}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="text-blue-500 hover:text-blue-700 text-sm mt-1"
              >
                + Agregar otro requisito
              </button>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">
                Imagen de la campaña *
              </label>
              <div className={`border-2 border-dashed ${errors.image ? 'border-red-500' : 'border-gray-300'} rounded-lg p-6 text-center relative`}>
                {imagePreview ? (
                  <div className="relative">
                    <CampaignImage
                      src={imagePreview || undefined}
                      alt="Vista previa"
                      className="max-h-64 mx-auto rounded"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="campaign-image-upload" className="cursor-pointer block">
                    <FaCloudUploadAlt className="mx-auto text-gray-400 text-5xl mb-2" />
                    <p className="text-gray-500 mb-2">Arrastra una imagen o haz clic para seleccionar</p>
                    <p className="text-gray-400 text-sm">PNG, JPG (Máx. 5MB)</p>
                  </label>
                )}
                <input
                  id="campaign-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`hidden ${imagePreview ? 'hidden' : ''}`}
                  required={!imagePreview}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/campaigns')}
              className="px-4 py-2 text-gray-700 mr-4"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg flex items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Creando...
                </>
              ) : (
                'Crear campaña'
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

export default CampaignCreateScreen;
