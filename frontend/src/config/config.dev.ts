import { AppConfig, defaultConfig } from './config.base';

/**
 * Development environment configuration
 */
const devConfig: Partial<AppConfig> = {
  api: {
    baseURL: 'http://localhost:8000/api',
    timeout: 60000, // Longer timeout for development
  },
  features: {
    webSearch: true,
    multiDatabase: true,
    visualization: true,
  },
  ui: {
    theme: 'light',
    animationsEnabled: true,
  },
};

/**
 * Final development configuration (merging with defaults)
 */
const config: AppConfig = {
  ...defaultConfig,
  ...devConfig,
  api: {
    ...defaultConfig.api,
    ...devConfig.api,
  },
  features: {
    ...defaultConfig.features,
    ...devConfig.features,
  },
  ui: {
    ...defaultConfig.ui,
    ...devConfig.ui,
  },
};

export default config;