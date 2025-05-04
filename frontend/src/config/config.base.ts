/**
 * Base configuration interface that defines all available configuration options
 */
export interface AppConfig {
  // API configuration
  api: {
    baseURL: string;
    timeout: number;
  };
  
  // Feature flags
  features: {
    webSearch: boolean;
    multiDatabase: boolean;
    visualization: boolean;
  };
  
  // Database connections
  databases: {
    mongodb: string;
    sql?: string;
  };
  
  // UI/UX settings
  ui: {
    theme: 'light' | 'dark' | 'system';
    animationsEnabled: boolean;
  };
}

/**
 * Default configuration values (fallbacks)
 */
export const defaultConfig: AppConfig = {
  api: {
    baseURL: '/api',
    timeout: 30000,
  },
  features: {
    webSearch: false,
    multiDatabase: false,
    visualization: true,
  },
  databases: {
    mongodb: 'mongodb://localhost:27017/ai_reporting',
  },
  ui: {
    theme: 'system',
    animationsEnabled: true,
  },
};