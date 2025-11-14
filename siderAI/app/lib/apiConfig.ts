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
    COMPLETIONS: '/api/chat/v1/completions',
  },
  // Conversation endpoints
  CONVERSATIONS: {
    CREATE: '/api/conversations',
    GET: '/api/conversations', // GET /api/conversations/{conversation_id}
    LIST: '/api/conversations',
  },
  // File endpoints
  FILES: {
    UPLOAD: '/api/files/upload',
    UPLOAD_DIRECTLY: '/api/uploader/v1/file/upload-directly',
  },
} as const;

export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

