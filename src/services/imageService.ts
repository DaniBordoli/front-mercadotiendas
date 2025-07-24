import { API_URL } from '../config';

// Definimos el tamaño máximo de archivo localmente para evitar conflictos de importación
const IMAGE_MAX_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Valida si un archivo es una imagen válida y no excede el tamaño máximo
 * @param file Archivo a validar
 * @returns Objeto con resultado de validación y mensaje de error si existe
 */
export const validateImage = (file: File): { isValid: boolean; errorMessage?: string } => {
  if (file.size > IMAGE_MAX_SIZE) {
    return { isValid: false, errorMessage: 'La imagen no debe superar los 10MB' };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, errorMessage: 'Por favor selecciona un archivo de imagen válido' };
  }

  return { isValid: true };
};

/**
 * Convierte un archivo a una URL de datos (base64)
 * @param file Archivo a convertir
 * @returns Promesa que resuelve a la URL de datos
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Sube una imagen al servidor
 * @param imageFile Archivo de imagen a subir
 * @param endpoint Endpoint de la API para subir la imagen
 * @returns Promesa que resuelve a la respuesta del servidor
 */
export const uploadImage = async (imageFile: File, endpoint: string): Promise<any> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token provided');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al subir la imagen');
  }

  return await response.json();
};
