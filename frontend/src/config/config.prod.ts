import { AppConfig, defaultConfig } from './config.base';

/**
 * Production environment configuration
 */
const prodConfig: Partial<AppConfig> = {
  api: {
    baseURL: '/api', // In production, we use relative URLs
    timeout: 30000,
  },
  features: {
    webSearch: true,
    multiDatabase: true,
    visualization: true,
  },
  ui: {
    theme: 'system',
    animationsEnabled: true,
  },
};

/**
 * Final production configuration (merging with defaults)
 */
const config: AppConfig = {
  ...defaultConfig,
  ...prodConfig,
  api: {
    ...defaultConfig.api,
    ...prodConfig.api,
  },
  features: {
    ...defaultConfig.features,
    ...prodConfig.features,
  },
  ui: {
    ...defaultConfig.ui,
    ...prodConfig.ui,
  },
};

export default config;