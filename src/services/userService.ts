import { updateUserProfile } from '../stores/slices/authSlice';

export interface BasicDataForm {
  fullName: string;
  country: string;
  province: string;
  city: string;
  birthDate: string;
}

export interface InfluencerDataForm {
  username: string;
  instagram: string;
  tiktok: string;
  youtube: string;
  category: string;
  niches: string[];
}



/**
 * Actualiza los datos básicos del usuario
 * @param formData - Datos del formulario de datos básicos
 * @returns Promise<void>
 */
export const updateUserBasicData = async (formData: BasicDataForm): Promise<void> => {
  try {
    // Convertir fullName a name para que coincida con el backend
    const userData = {
      name: formData.fullName, // El backend espera 'name', no 'fullName'
      country: formData.country,
      province: formData.province,
      city: formData.city,
      birthDate: formData.birthDate
    };

    // Usar la función existente de updateUserProfile
    await updateUserProfile(userData);
    
    console.log('Datos básicos del usuario actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar datos básicos del usuario:', error);
    throw error;
  }
};

/**
 * Actualiza el tipo de usuario
 * @param userTypes - Array de tipos de usuario seleccionados
 * @returns Promise<void>
 */
export const updateUserType = async (userTypes: ('buyer' | 'seller' | 'influencer')[]): Promise<void> => {
  try {
    const userData = {
      userType: userTypes
    };

    // Usar la función existente de updateUserProfile
    await updateUserProfile(userData);
    
    console.log('Tipo de usuario actualizado exitosamente:', userTypes);
  } catch (error) {
    console.error('Error al actualizar tipo de usuario:', error);
    throw error;
  }
};

/**
 * Actualiza solo el tipo de usuario a comprador
 * @returns Promise<void>
 */
export const updateUserTypeToBuyer = async (): Promise<void> => {
  try {
    await updateUserType(['buyer']);
    console.log('Usuario configurado como comprador');
  } catch (error) {
    console.error('Error al configurar usuario como comprador:', error);
    throw error;
  }
};

/**
 * Valida los datos del formulario de datos básicos
 * @param formData - Datos del formulario a validar
 * @returns Objeto con errores de validación
 */
export const validateBasicDataForm = (formData: BasicDataForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Validar nombre completo
  if (!formData.fullName.trim()) {
    errors.fullName = 'El nombre completo es requerido';
  } else if (formData.fullName.trim().length < 2) {
    errors.fullName = 'El nombre debe tener al menos 2 caracteres';
  }

  // Validar país
  if (!formData.country.trim()) {
    errors.country = 'El país es requerido';
  }

  // Validar provincia
  if (!formData.province.trim()) {
    errors.province = 'La provincia es requerida';
  }

  // Validar ciudad
  if (!formData.city.trim()) {
    errors.city = 'La ciudad es requerida';
  }

  // Validar fecha de nacimiento
  if (!formData.birthDate) {
    errors.birthDate = 'La fecha de nacimiento es requerida';
  } else {
    const birthDate = new Date(formData.birthDate);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 13) {
      errors.birthDate = 'Debes tener al menos 13 años';
    } else if (age > 120) {
      errors.birthDate = 'Fecha de nacimiento inválida';
    }
  }

  return errors;
};

/**
 * Formatea la fecha para el input de tipo date
 * @param dateString - Fecha en formato string
 * @returns Fecha formateada para input date (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return date.toISOString().split('T')[0];
};

/**
 * Obtiene la fecha máxima permitida (13 años atrás desde hoy)
 * @returns Fecha máxima en formato YYYY-MM-DD
 */
export const getMaxBirthDate = (): string => {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  return maxDate.toISOString().split('T')[0];
};

/**
 * Obtiene la fecha mínima permitida (120 años atrás desde hoy)
 * @returns Fecha mínima en formato YYYY-MM-DD
 */
export const getMinBirthDate = (): string => {
  const today = new Date();
  const minDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  return minDate.toISOString().split('T')[0];
};

/**
 * Actualiza los datos del perfil de influencer
 * @param formData - Datos del formulario de influencer
 * @returns Promise<void>
 */
export const updateInfluencerData = async (formData: InfluencerDataForm): Promise<void> => {
  try {
    // Mapear los campos del formulario a los campos esperados por el backend
    const userData = {
      influencerUsername: formData.username,
      influencerInstagram: formData.instagram,
      influencerTiktok: formData.tiktok,
      influencerYoutube: formData.youtube,
      influencerCategory: formData.category,
      influencerNiches: formData.niches
    };

    // Usar la función existente de updateUserProfile
    await updateUserProfile(userData);
    
    console.log('Datos de influencer actualizados exitosamente');
  } catch (error) {
    console.error('Error al actualizar datos de influencer:', error);
    throw error;
  }
};

/**
 * Obtiene los datos del perfil de influencer del usuario actual
 * @returns Promise<InfluencerDataForm | null>
 */
export const getInfluencerData = async (): Promise<InfluencerDataForm | null> => {
  try {
    // Esta función debería obtener los datos del store o hacer una llamada a la API
    // Por ahora retornamos null, pero se puede implementar según la estructura del store
    return null;
  } catch (error) {
    console.error('Error al obtener datos de influencer:', error);
    throw error;
  }
};