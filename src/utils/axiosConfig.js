import axios from 'axios';

// Create a custom event for loading state
const loadingEvent = new CustomEvent('axios-loading', { detail: { loading: true } });
const loadedEvent = new CustomEvent('axios-loading', { detail: { loading: false } });

let activeRequests = 0;

// Request interceptor - shows loading
axios.interceptors.request.use(
  (config) => {
    activeRequests++;
    if (activeRequests === 1) {
      // Dispatch loading event when first request starts
      window.dispatchEvent(loadingEvent);
    }
    console.log('🚀 API Request:', config.url);
    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(loadedEvent);
    }
    return Promise.reject(error);
  }
);

// Response interceptor - hides loading
axios.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) {
      // Dispatch loaded event when all requests complete
      window.dispatchEvent(loadedEvent);
    }
    console.log('✅ API Response:', response.config.url);
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) {
      window.dispatchEvent(loadedEvent);
    }
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  }
);

export default axios;