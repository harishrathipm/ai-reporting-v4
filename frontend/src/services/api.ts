import axios, { AxiosInstance } from 'axios';
import configService from './config.service';

class ApiService {
  private api: AxiosInstance;
  
  constructor() {
    const { baseURL } = configService.getApiConfig(configService.getEnvironment());
    
    this.api = axios.create({
      baseURL,
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