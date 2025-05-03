/**
 * Configuration service to centralize all environment and app configuration
 */

// Define types for better type safety and documentation
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  headers?: Record<string, string>;
}

interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: string;
}

interface QueryConfig {
  maxHistoryItems: number;
  defaultQueryTimeout: number;
  cacheResults: boolean;
  cacheDuration: number; // in milliseconds
}

interface VisualizationConfig {
  defaultChartType: string;
  colorPalette: string[];
  animationsEnabled: boolean;
  defaultDecimalPrecision: number;
}

interface AppConfig {
  name: string;
  version: string;
  logoPath: string;
  supportEmail: string;
  feedbackEnabled: boolean;
  analyticsEnabled: boolean;
  documentationUrl: string;
}

interface FullConfig {
  api: ApiConfig;
  environment: string;
  theme: ThemeConfig;
  query: QueryConfig;
  visualization: VisualizationConfig;
  app: AppConfig;
  features: Record<string, boolean>;
}

// Local storage keys
const STORAGE_KEYS = {
  THEME: 'ai-reporting-theme',
  API_SETTINGS: 'ai-reporting-api-settings',
  FEATURES: 'ai-reporting-features',
};

class ConfigService {
  private config: FullConfig;
  private initializing: boolean = false;
  private initialized: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Initialize with default config
    this.config = this.getDefaultConfig();
    
    // Determine environment and set environment-specific configs
    const environment = this.getEnvironment();
    this.config.environment = environment;
    this.config.api = this.getApiConfig(environment);
    
    // Load configurations that may be overridden by local storage
    this.loadStoredConfigurations();
    
    // Log configuration in development mode
    if (environment === 'development') {
      console.log('App configuration loaded:', this.config);
    }
  }

  /**
   * Initialize async configuration parts (if needed)
   * This allows loading configuration from a remote source
   */
  async initialize(): Promise<void> {
    if (this.initialized) return Promise.resolve();
    if (this.initializing && this.initPromise) return this.initPromise;
    
    this.initializing = true;
    this.initPromise = new Promise<void>((resolve) => {
      try {
        // Here you could load configuration from a remote endpoint
        // For example:
        // const remoteConfig = await fetch('/config').then(r => r.json());
        // this.mergeConfig(remoteConfig);
        
        // For now, just simulate a delay
        setTimeout(() => {
          this.initialized = true;
          this.initializing = false;
          resolve();
        }, 100);
      } catch (error) {
        console.error('Failed to initialize config service:', error);
        this.initializing = false;
        // Even if initialization fails, we mark as initialized to avoid
        // continuously trying to initialize
        this.initialized = true;
        resolve();
      }
    });
    
    return this.initPromise;
  }

  /**
   * Merge a partial config into the current config
   */
  private mergeConfig(partialConfig: Partial<FullConfig>): void {
    this.config = {
      ...this.config,
      ...partialConfig,
      api: { ...this.config.api, ...(partialConfig.api || {}) },
      theme: { ...this.config.theme, ...(partialConfig.theme || {}) },
      query: { ...this.config.query, ...(partialConfig.query || {}) },
      visualization: { ...this.config.visualization, ...(partialConfig.visualization || {}) },
      app: { ...this.config.app, ...(partialConfig.app || {}) },
      features: { ...this.config.features, ...(partialConfig.features || {}) },
    };
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): FullConfig {
    return {
      environment: 'production',
      api: {
        baseURL: '/api',
        timeout: 30000,
        retryAttempts: 2,
      },
      theme: {
        mode: 'system',
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        fontSize: '16px',
      },
      query: {
        maxHistoryItems: 10,
        defaultQueryTimeout: 60000,
        cacheResults: true,
        cacheDuration: 3600000, // 1 hour
      },
      visualization: {
        defaultChartType: 'bar',
        colorPalette: ['#1976d2', '#dc004e', '#9c27b0', '#ff9800', '#4caf50', '#e91e63'],
        animationsEnabled: true,
        defaultDecimalPrecision: 2,
      },
      app: {
        name: 'Dynamic Reporting AI',
        version: '1.0.0',
        logoPath: '/logo.png',
        supportEmail: 'support@example.com',
        feedbackEnabled: true,
        analyticsEnabled: false,
        documentationUrl: 'https://docs.example.com',
      },
      features: {
        advancedQueries: true,
        dataExport: true,
        shareableReports: true,
        customVisualizations: true,
        darkMode: true,
      },
    };
  }

  /**
   * Load any configurations that might be stored in localStorage
   */
  private loadStoredConfigurations(): void {
    try {
      // Load theme settings if available
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        this.config.theme = { ...this.config.theme, ...parsedTheme };
      }

      // Load API settings if available
      const storedApiSettings = localStorage.getItem(STORAGE_KEYS.API_SETTINGS);
      if (storedApiSettings) {
        const parsedApiSettings = JSON.parse(storedApiSettings);
        this.config.api = { ...this.config.api, ...parsedApiSettings };
      }

      // Load feature flags if available
      const storedFeatures = localStorage.getItem(STORAGE_KEYS.FEATURES);
      if (storedFeatures) {
        const parsedFeatures = JSON.parse(storedFeatures);
        this.config.features = { ...this.config.features, ...parsedFeatures };
      }
    } catch (error) {
      console.error('Error loading stored configurations:', error);
      // Continue with default configurations if loading fails
    }
  }

  /**
   * Determine current environment
   */
  public getEnvironment(): string {
    // Try to get from Vite env vars if available
    const viteEnv = (window as any).__VITE_ENV__;
    if (viteEnv) return viteEnv;
    
    // Try to get from import.meta if available, with safer checks
    let importMetaEnv: string | undefined = undefined;
    
    try {
      if (typeof import.meta !== 'undefined' && 
          import.meta && 
          'env' in import.meta && 
          import.meta.env && 
          'MODE' in import.meta.env) {
        importMetaEnv = (import.meta.env as any).MODE;
      }
    } catch (e) {
      // Ignore error if import.meta is not available
    }
    
    if (importMetaEnv) return importMetaEnv;
    
    // Fallback to checking window location
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'development';
    }
    
    // Default to production
    return 'production';
  }

  /**
   * Get API configuration based on environment
   */
  public getApiConfig(environment: string): ApiConfig {
    // Check for explicit API URL from any available source
    const explicitApiUrl = this.getExplicitApiUrl();
    
    // Base configuration for all environments
    const baseConfig: ApiConfig = {
      baseURL: explicitApiUrl || '/api',
      timeout: environment === 'development' ? 60000 : 30000, // Longer timeout for development
      retryAttempts: 3,
    };
    
    // Environment-specific configs
    switch (environment) {
      case 'development':
        return {
          ...baseConfig,
          baseURL: explicitApiUrl || '/api',
        };
      case 'test':
        return {
          ...baseConfig,
          baseURL: explicitApiUrl || 'http://localhost:8000',
          timeout: 5000, // shorter timeout for tests
        };
      case 'production':
      default:
        return {
          ...baseConfig,
          retryAttempts: 2, // fewer retries in production to avoid overloading
        };
    }
  }

  /**
   * Try to get API URL from various sources
   */
  private getExplicitApiUrl(): string | null {
    // Check for Vite environment variables
    let viteApiUrl: string | undefined = undefined;
    
    try {
      // Safe way to access import.meta.env
      if (typeof import.meta !== 'undefined' && 
          import.meta && 
          'env' in import.meta && 
          import.meta.env && 
          'VITE_API_URL' in import.meta.env) {
        viteApiUrl = (import.meta.env as any).VITE_API_URL;
      }
    } catch (e) {
      // Ignore error if import.meta is not available
    }
    
    if (viteApiUrl) return viteApiUrl;
    
    // Check for global window variables (could be set by index.html)
    const windowApiUrl = (window as any).__API_URL__;
    if (windowApiUrl) return windowApiUrl;
    
    // No explicit API URL found
    return null;
  }

  /**
   * Update theme settings
   */
  updateTheme(themeUpdates: Partial<ThemeConfig>): void {
    this.config.theme = { ...this.config.theme, ...themeUpdates };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(this.config.theme));
  }

  /**
   * Update API settings
   */
  updateApiSettings(apiUpdates: Partial<ApiConfig>): void {
    this.config.api = { ...this.config.api, ...apiUpdates };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.API_SETTINGS, JSON.stringify(this.config.api));
  }

  /**
   * Update feature flags
   */
  updateFeature(featureName: string, enabled: boolean): void {
    this.config.features = { 
      ...this.config.features, 
      [featureName]: enabled 
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(this.config.features));
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featureName: string): boolean {
    return !!this.config.features[featureName];
  }

  /**
   * Reset all configurations to defaults
   */
  resetToDefaults(): void {
    const environment = this.config.environment;
    this.config = this.getDefaultConfig();
    this.config.environment = environment;
    this.config.api = this.getApiConfig(environment);
    
    // Clear localStorage
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.API_SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.FEATURES);
  }

  /**
   * Get theme configuration
   */
  getThemeConfig(): ThemeConfig {
    return this.config.theme;
  }

  /**
   * Get query configuration
   */
  getQueryConfig(): QueryConfig {
    return this.config.query;
  }

  /**
   * Get visualization configuration
   */
  getVisualizationConfig(): VisualizationConfig {
    return this.config.visualization;
  }

  /**
   * Get app configuration
   */
  getAppConfig(): AppConfig {
    return this.config.app;
  }

  /**
   * Get feature flags
   */
  getFeatures(): Record<string, boolean> {
    return this.config.features;
  }

  /**
   * Get the full configuration object
   */
  getConfig(): FullConfig {
    return this.config;
  }
}

// Create and export a singleton instance
export const configService = new ConfigService();
export default configService;