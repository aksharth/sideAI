export const API_BASE_URL = 'https://webby-sider-backend-175d47f9225b.herokuapp.com';

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    GOOGLE: '/auth/google',
  },
  // Chat endpoints
  CHAT: {
    SEND: '/api/chat/send',
  },
  // Conversation endpoints
  CONVERSATIONS: {
    CREATE: '/api/conversations',
  },
  // File endpoints
  FILES: {
    UPLOAD: '/api/files/upload',
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

