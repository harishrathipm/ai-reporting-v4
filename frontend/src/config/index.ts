import { AppConfig } from './config.base';
import devConfig from './config.dev';
import prodConfig from './config.prod';

/**
 * Get the current environment
 */
function getEnvironment(): 'development' | 'production' {
  const hostname = window.location.hostname;
  return (hostname === 'localhost' || hostname === '127.0.0.1')
    ? 'development'
    : 'production';
}

/**
 * Get the appropriate configuration based on the current environment
 */
function getConfig(): AppConfig {
  const environment = getEnvironment();
  return environment === 'production' ? prodConfig : devConfig;
}

// Export the configuration based on the current environment
const config = getConfig();
export default config;