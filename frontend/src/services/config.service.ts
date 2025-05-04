/**
 * Simplified configuration service that reads from env.json
 */
import envConfig from '../env.json';
import { EnvConfig } from '../types';

// Simple config type for better type safety
interface ApiConfig {
  baseURL: string;
}

class ConfigService {
  private apiConfig: ApiConfig;

  constructor() {
    this.apiConfig = this.initApiConfig();
  }

  /**
   * Initialize API configuration from env.json
   */
  private initApiConfig(): ApiConfig {
    // Read config from env.json
    const config = envConfig as EnvConfig;
    const apiUrl = config.apiUrl || '/api'; // Default to '/api' if not specified
    
    return { baseURL: apiUrl };
  }

  /**
   * Get the current API configuration
   */
  getApiConfig(): ApiConfig {
    return this.apiConfig;
  }
}

// Create and export a singleton instance
export const configService = new ConfigService();
export default configService;