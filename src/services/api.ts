import { authFetch } from '../utils/authFetch';
export const API_URL = process.env.REACT_APP_API_URL;

const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/test/status`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error testing connection:', error);
    throw error;
  }
};

interface AiChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AiChatRequestBody {
  messages: AiChatMessage[];
  currentTemplate: any; // Use a more specific type if available (EditableVariables)
}

interface AiChatResponse {
  reply: string;
  templateUpdates: any | null;
  isFinalStep?: boolean;
  shouldCreateShop?: boolean;
  shopData?: any;
}

export const sendChatMessageToAI = async (messages: AiChatMessage[], currentTemplate: any): Promise<AiChatResponse> => {
  const requestBody: AiChatRequestBody = { messages, currentTemplate };

  try {
      const response = await authFetch(`${API_URL}/ai/chat`, {
          method: 'POST',
          body: JSON.stringify(requestBody),
      });

      // Use handleResponse to automatically check response.ok and parse JSON
      const data = await handleResponse(response);

      // Assuming handleResponse returns the 'data' field from the backend successResponse structure
      if (data && data.data && typeof data.data.reply === 'string') {
          return {
              reply: data.data.reply,
              templateUpdates: data.data.templateUpdates !== undefined ? data.data.templateUpdates : null,
              isFinalStep: data.data.isFinalStep,
              shouldCreateShop: data.data.shouldCreateShop,
              shopData: data.data.shopData
          };
      } else {
          console.error("Invalid response structure received from AI backend. Response data:", data);
          throw new Error('Invalid response structure received from AI backend');
      }

  } catch (error) {
      console.error('Error sending chat message to AI:', error);
      throw error; // Re-throw to be caught by the calling component
  }
};

export const updateShopTemplate = async (templateUpdate: any) => {
  const response = await authFetch(`${API_URL}/shops/template`, {
    method: 'PUT',
    body: JSON.stringify({ templateUpdate }),
  });
  return handleResponse(response);
};

export const fetchShopTemplate = async () => {
  const response = await authFetch(`${API_URL}/shops/template`, {
    method: 'GET',
  });
  return handleResponse(response);
};

export const uploadShopLogo = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  
  const response = await authFetch(`${API_URL}/shop/logo`, {
    method: 'PUT',
    body: formData,
  });
  return handleResponse(response);
};
