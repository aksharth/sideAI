(function() {
  'use strict';

  const ExtensionAPI = {
    // Default API base URL
    DEFAULT_BASE_URL: 'https://webby-sider-backend-175d47f9225b.herokuapp.com',

    // Storage key for custom API base URL
    STORAGE_KEY: 'sider_api_base_url',

    /**
     * Get API base URL from storage or use default
     * @returns {Promise<string>} The API base URL
     */
    async getBaseUrl() {
      return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.get([this.STORAGE_KEY], (result) => {
            let baseUrl = result[this.STORAGE_KEY] || this.DEFAULT_BASE_URL;
            // Remove /docs if present (Swagger UI path)
            baseUrl = baseUrl.replace(/\/docs\/?$/, '');
            resolve(baseUrl);
          });
        } else {
          // Fallback for non-extension contexts
          let baseUrl = this.DEFAULT_BASE_URL;
          baseUrl = baseUrl.replace(/\/docs\/?$/, '');
          resolve(baseUrl);
        }
      });
    },

    /**
     * Set custom API base URL
     * @param {string} url - The custom API base URL
     * @returns {Promise<void>}
     */
    async setBaseUrl(url) {
      return new Promise((resolve, reject) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.set({ [this.STORAGE_KEY]: url }, () => {
            if (chrome.runtime.lastError) {
              reject(new Error(chrome.runtime.lastError.message));
            } else {
              resolve();
            }
          });
        } else {
          reject(new Error('Chrome storage is not available'));
        }
      });
    },

    /**
     * Build full API endpoint URL
     * @param {string} endpoint - The API endpoint path (e.g., '/api/auth/login')
     * @returns {Promise<string>} The full API URL
     */
    async buildUrl(endpoint) {
      const baseUrl = await this.getBaseUrl();
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      return `${baseUrl}${cleanEndpoint}`;
    },

    /**
     * Get authentication token from localStorage
     * @returns {string|null} The auth token
     */
    getAuthToken() {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('authToken');
      }
      return null;
    },

    /**
     * Get default headers for API requests
     * @param {Object} options - Additional headers to include
     * @returns {Promise<Object>} Headers object
     */
    async getHeaders(options = {}) {
      const headers = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...options
      };

      const authToken = this.getAuthToken();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      return headers;
    },

    /**
     * Get headers for file upload requests (without Content-Type)
     * @param {Object} options - Additional headers to include
     * @returns {Promise<Object>} Headers object
     */
    async getUploadHeaders(options = {}) {
      const headers = {
        'accept': 'application/json',
        ...options
      };

      const authToken = this.getAuthToken();
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      return headers;
    },

    /**
     * Make an API request
     * @param {string} endpoint - The API endpoint path
     * @param {Object} options - Fetch options (method, body, headers, etc.)
     * @returns {Promise<Response>} The fetch response
     */
    async request(endpoint, options = {}) {
      const url = await this.buildUrl(endpoint);
      const headers = options.headers || await this.getHeaders();
      
      const fetchOptions = {
        ...options,
        headers: {
          ...headers,
          ...(options.headers || {})
        }
      };

      return fetch(url, fetchOptions);
    },

    /**
     * Make an API request and parse JSON response
     * @param {string} endpoint - The API endpoint path
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} Parsed JSON response
     */
    async requestJson(endpoint, options = {}) {
      const response = await this.request(endpoint, options);
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
        }
      }
    },

    /**
     * API Endpoints
     */
    endpoints: {
      // Auth endpoints
      auth: {
        register: '/api/auth/register',
        login: '/api/auth/login',
        me: '/api/auth/me',
        refresh: '/api/auth/refresh'
      },

      // Conversation endpoints
      conversations: {
        list: '/api/conversations',
        create: '/api/conversations',
        get: (id) => `/api/conversations/${id}`,
        update: (id) => `/api/conversations/${id}`,
        delete: (id) => `/api/conversations/${id}`,
        export: (id) => `/api/conversations/${id}/export`,
        messages: (id) => `/api/conversations/${id}/messages`
      },

      // Chat endpoints
      chat: {
        send: '/api/chat/send',
        completions: '/api/chat/v1/completions'
      },

      // Image/Upload endpoints
      uploader: {
        upload: '/api/uploader/v1/file/upload-directly',
        getFile: (fileId) => `/api/uploader/v1/file/${fileId}`
      },

      // Image processing endpoints
      images: {
        toText: '/api/images/to-text',
        toTextV1: '/api/images/v1/to_text',
        toTextAlt: '/api/images/to_text',
        imageToText: '/api/images/image_to_text',
        imageToTextV1: '/api/images/v1/image_to_text'
      }
    },

    /**
     * Get all image-to-text endpoint variations (for fallback)
     * @returns {Promise<string[]>} Array of endpoint URLs
     */
    async getImageToTextEndpoints() {
      const baseUrl = await this.getBaseUrl();
      return [
        `${baseUrl}/api/images/to-text`,
        `${baseUrl}/api/images/v1/to_text`,
        `${baseUrl}/api/images/to_text`,
        `${baseUrl}/api/images/image_to_text`,
        `${baseUrl}/api/image/to_text`,
        `${baseUrl}/api/image/v1/to_text`,
        `${baseUrl}/api/images/v1/image_to_text`
      ];
    },

    /**
     * Get custom endpoint from storage (if configured)
     * @param {string} storageKey - Storage key for custom endpoint
     * @returns {Promise<string|null>} Custom endpoint URL or null
     */
    async getCustomEndpoint(storageKey) {
      return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.get([storageKey], (result) => {
            const customEndpoint = result[storageKey];
            if (customEndpoint) {
              resolve(customEndpoint);
            } else {
              resolve(null);
            }
          });
        } else {
          resolve(null);
        }
      });
    }
  };

  // Export to window for global access
  if (typeof window !== 'undefined') {
    window.SiderExtensionAPI = ExtensionAPI;
  }

  // Export to self for service worker contexts
  if (typeof self !== 'undefined' && typeof window === 'undefined') {
    self.SiderExtensionAPI = ExtensionAPI;
  }
})();

