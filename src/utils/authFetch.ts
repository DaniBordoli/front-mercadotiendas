import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

const API_URL = process.env.REACT_APP_API_URL;

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  let token = getStorageItem('token');
  let refreshToken = getStorageItem('refreshToken');

  // Determinar si el cuerpo es FormData para evitar forzar Content-Type JSON
  const isFormData = init.body instanceof FormData;

  // Añade el token al header solo si es necesario, y Content-Type cuando NO es FormData
  init.headers = {
    ...init.headers,
    Authorization: token ? `Bearer ${token}` : '',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  } as Record<string, string>;

  let response = await fetch(input, init);

  // Si el token expiró, intenta refrescarlo
  if (response.status === 401 && refreshToken) {
    // Intenta refrescar el token
    const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      const newToken = data.data?.accessToken;
      if (newToken) {
        setStorageItem('token', newToken);
        // Reintenta la request original con el nuevo token
        init.headers = {
          ...init.headers,
          Authorization: `Bearer ${newToken}`,
        } as Record<string, string>;
        response = await fetch(input, init);
      }
    } else {
      // Refresh token inválido, forzar logout
      removeStorageItem('token');
      removeStorageItem('refreshToken');
      window.location.href = '/login';
      throw new Error('Sesión expirada, por favor inicia sesión nuevamente.');
    }
  }

  return response;
}