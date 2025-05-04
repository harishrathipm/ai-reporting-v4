import axios, { AxiosInstance } from 'axios';
import config from '../config';

class ApiService {
  private api: AxiosInstance;
  
  constructor() {
    this.api = axios.create({
      baseURL: config.api.baseURL,
      timeout: config.api.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      response => response,
      error => {
        console.error('API Error:', error.response || error);
        return Promise.reject(error);
      }
    );
  }
  
  getApi(): AxiosInstance {
    return this.api;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService.getApi();