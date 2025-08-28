import { API_URL, DEFAULT_CAMPAIGN_IMAGE } from '../config';
import { authFetch } from '../utils/authFetch';

// Interfaces
export interface Campaign {
  _id: string;
  name: string;
  description: string;
  shop: string | any; // Puede ser string (ID) o objeto Shop completo cuando está populado
  budget: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'closed';
  category: string;
  requirements: string;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

export interface CampaignApplication {
  _id: string;
  campaign: string | Campaign;
  user: string | any; // Puede ser string (ID) o objeto User completo cuando está populado
  message: string;
  socialMediaLinks: string[];
  proposedFee: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Helper para manejar respuestas
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// Funciones para campañas
export const getAllCampaigns = async (status?: string, category?: string) => {
  let url = `${API_URL}/campaigns`;
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (category) params.append('category', category);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  try {
    const response = await fetch(url);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
};

export const getCampaignById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/${id}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching campaign with ID ${id}:`, error);
    throw error;
  }
};

// Subir imagen de campaña
export const uploadCampaignImage = async (imageFile: File, campaignId?: string): Promise<{ success: boolean; imageUrl: string; message: string }> => {
  console.log('Iniciando subida de imagen...', {
    nombre: imageFile.name,
    tipo: imageFile.type,
    tamaño: `${(imageFile.size / 1024).toFixed(2)} KB`,
    campaignId: campaignId || 'nueva campaña'
  });

  const formData = new FormData();
  formData.append('image', imageFile);
  
  if (campaignId) {
    formData.append('campaignId', campaignId);
    console.log(`Subiendo imagen para la campaña existente ID: ${campaignId}`);
  } else {
    console.log('Subiendo imagen para una nueva campaña');
  }

  try {
    console.log(`Enviando solicitud a ${API_URL}/uploads/campaign...`);
    const response = await authFetch(`${API_URL}/uploads/campaign`, {
      method: 'POST',
      body: formData
    });

    console.log('Respuesta recibida, estado HTTP:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error en la respuesta del servidor:', errorData);
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    const result = await response.json();
    console.log('Respuesta del servidor:', result);
    
    // Verificar que la respuesta tenga el formato esperado
    if (!result.imageUrl) {
      console.error('La respuesta no contiene una URL de imagen válida:', result);
      return {
        success: false,
        imageUrl: '',
        message: 'La respuesta del servidor no contiene una URL de imagen válida'
      };
    }
    
    // Si la imagen se subió correctamente y tenemos un ID de campaña, verificar que la campaña se actualizó
    if (campaignId && result.success) {
      try {
        // Verificar que la campaña tenga la nueva imagen
        console.log('Verificando que la campaña se actualizó con la nueva imagen...');
        const verifyResponse = await getCampaignById(campaignId);
        
        if (verifyResponse.data.imageUrl === result.imageUrl) {
          console.log('Imagen actualizada correctamente en la campaña');
        } else {
          console.warn('La imagen no se actualizó en la campaña:', {
            urlEsperada: result.imageUrl,
            urlActual: verifyResponse.data.imageUrl
          });
        }
      } catch (verifyError) {
        console.error('Error al verificar la actualización de la imagen:', verifyError);
      }
    }
    
    // Asegurarse de que la respuesta tenga el formato correcto
    return {
      success: result.success || true,
      imageUrl: result.imageUrl,
      message: result.message || 'Imagen subida exitosamente'
    };
  } catch (error: any) {
    console.error('Error al subir la imagen:', error);
    return {
      success: false,
      imageUrl: '',
      message: error.message || 'Error desconocido al subir la imagen'
    };
  }
};

// Crear una nueva campaña
export const createCampaign = async (
  campaignData: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>, 
  imageFile?: File
): Promise<any> => {
  console.log('Iniciando creación de campaña en el servicio');
  console.log('Datos recibidos:', { ...campaignData, imageFile: imageFile ? `${imageFile.name} (${imageFile.size} bytes)` : 'No hay imagen' });

  // Si hay un archivo de imagen, subirlo primero
  let imageUrl = campaignData.imageUrl || DEFAULT_CAMPAIGN_IMAGE;
  
  if (imageFile) {
    try {
      console.log('Subiendo imagen de campaña...');
      const uploadResponse = await uploadCampaignImage(imageFile);
      console.log('Respuesta de subida de imagen:', uploadResponse);
      
      if (uploadResponse && uploadResponse.success && uploadResponse.imageUrl) {
        imageUrl = uploadResponse.imageUrl;
        console.log('URL de imagen actualizada:', imageUrl);
      } else {
        console.error('La respuesta de subida de imagen no contiene una URL válida:', uploadResponse);
      }
    } catch (error) {
      console.error('Error al subir la imagen de la campaña:', error);
      // Continuar con la imagen por defecto
    }
  } else {
    console.log('No se proporcionó imagen, usando imagen por defecto:', imageUrl);
  }

  // Crear la campaña con la URL de la imagen
  console.log('Enviando datos de campaña al servidor con imageUrl:', imageUrl);
  const response = await authFetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...campaignData,
      imageUrl
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Error en la respuesta del servidor:', errorData);
    throw new Error(errorData.message || 'Error al crear la campaña');
  }

  const responseData = await response.json();
  console.log('Campaña creada exitosamente:', responseData);
  return responseData;
};

export const updateCampaign = async (id: string, campaignData: Partial<Campaign>) => {
  try {
    const response = await authFetch(`${API_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaignData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating campaign with ID ${id}:`, error);
    throw error;
  }
};

export const deleteCampaign = async (id: string) => {
  try {
    const response = await authFetch(`${API_URL}/campaigns/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error deleting campaign with ID ${id}:`, error);
    throw error;
  }
};

export const updateCampaignStatus = async (id: string, status: 'draft' | 'active' | 'closed') => {
  try {
    const response = await authFetch(`${API_URL}/campaigns/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating status for campaign with ID ${id}:`, error);
    throw error;
  }
};

export const getCampaignsByShop = async (shopId: string) => {
  try {
    const response = await fetch(`${API_URL}/campaigns/shop/${shopId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching campaigns for shop with ID ${shopId}:`, error);
    throw error;
  }
};

// Funciones para aplicaciones a campañas
export const applyToCampaign = async (campaignId: string, applicationData: {
  message: string;
  socialMediaLinks: string[];
  proposedFee?: number;
}) => {
  try {
    const response = await authFetch(`${API_URL}/applications/campaign/${campaignId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error applying to campaign with ID ${campaignId}:`, error);
    throw error;
  }
};

export const getCampaignApplications = async (campaignId: string) => {
  try {
    const response = await authFetch(`${API_URL}/applications/campaign/${campaignId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching applications for campaign with ID ${campaignId}:`, error);
    throw error;
  }
};

export const getApplicationById = async (applicationId: string) => {
  try {
    const response = await authFetch(`${API_URL}/applications/${applicationId}`);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error fetching application with ID ${applicationId}:`, error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => {
  try {
    const response = await authFetch(`${API_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  } catch (error) {
    console.error(`Error updating status for application with ID ${applicationId}:`, error);
    throw error;
  }
};

export const getUserApplications = async () => {
  try {
    const response = await authFetch(`${API_URL}/applications/user/me`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};
