# Dynamic Reporting AI - Development Guidelines

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [File Organization Principles](#file-organization-principles)
3. [Test-Driven Development](#test-driven-development)
4. [Backend Development (Python/FastAPI)](#backend-development)
5. [Frontend Development (React/TypeScript)](#frontend-development)
6. [AI/ML Components (LangGraph/LangChain)](#ai-ml-components)
7. [Infrastructure & Containerization](#infrastructure-containerization)
8. [Configuration Management](#configuration-management)
9. [Testing](#testing)
10. [Documentation](#documentation)
11. [Code Review Process](#code-review-process)
12. [Actionable Guidelines](#actionable-guidelines)

## General Guidelines

// ...existing code for general guidelines...

## Infrastructure & Containerization

### Docker-Based Development
- Use Docker and Docker Compose for all development environments
- Include Dockerfiles for all components (frontend, backend, databases)
- Define service dependencies and networking in docker-compose.yml
- Use environment-specific docker-compose override files (dev, test, prod)

### Container Best Practices
- Use specific version tags for base images (avoid "latest")
- Implement multi-stage builds to minimize image size
- Create non-root users for running applications
- Secure sensitive data with Docker secrets or environment variables
- Mount volumes for development to enable hot reloading

### Docker Compose Structure
- Define separate services for each component:
  - Frontend
  - Backend
  - Databases (MongoDB, SQL)
  - Additional services (Redis, etc.)
- Configure proper health checks for all services
- Set up proper networking between containers
- Use named volumes for persistent data

### Local Development Workflow
- Run `docker-compose up` to start the entire stack
- Enable hot reloading for both frontend and backend
- Use Docker exec for running commands inside containers
- Configure debugging to work with containerized services

## Configuration Management

### Configuration Principles
- **Never hardcode configuration values** in application code
- Externalize all configuration through environment variables or config files
- Use strong typing for configuration values
- Provide sensible defaults for non-critical configuration
- Document all configuration options

### Environment Variables
- Use `.env` files for local development (never commit to version control)
- Create `.env.example` templates with dummy values for documentation
- Follow naming conventions: `SERVICE_CATEGORY_OPTION` (e.g., `DB_MONGO_URI`)
- Validate environment variables at application startup

### Configuration Hierarchy
1. Environment variables (highest priority)
2. Configuration files
3. Default values in code (lowest priority)

### Secrets Management
- Never commit secrets to version control
- Use environment variables for secrets in development
- Use a secrets management solution for production (e.g., Azure Key Vault, HashiCorp Vault)
- Implement proper access controls for secrets

### Configuration in Different Components

#### Backend Configuration
```python
# config.py
import os
from pydantic import BaseSettings, Field

class AppSettings(BaseSettings):
    # API settings
    api_title: str = "Dynamic Reporting AI"
    api_description: str = "AI-powered Virtual Data Analyst"
    api_version: str = "0.1.0"
    
    # Database settings
    mongodb_uri: str = Field(..., env="MONGODB_URI")
    sql_connection_string: str = Field(None, env="SQL_CONNECTION_STRING")
    
    # AI settings
    openai_api_key: str = Field(..., env="OPENAI_API_KEY")
    model_name: str = Field("gpt-4", env="MODEL_NAME")
    
    # Web search
    tavily_api_key: str = Field(None, env="TAVILY_API_KEY")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Create settings instance
settings = AppSettings()
```

#### Frontend Configuration
```typescript
// config.ts
interface Config {
  apiUrl: string;
  features: {
    webSearch: boolean;
    multiDatabase: boolean;
    visualization: boolean;
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
  };
}

// Load configuration from environment or config file
const config: Config = {
  apiUrl: import.meta.env.VITE_API_URL || '/api',
  features: {
    webSearch: import.meta.env.VITE_FEATURE_WEB_SEARCH === 'true',
    multiDatabase: import.meta.env.VITE_FEATURE_MULTI_DB === 'true',
    visualization: import.meta.env.VITE_FEATURE_VISUALIZATION === 'true',
  },
  theme: {
    mode: (import.meta.env.VITE_THEME_MODE || 'system') as 'light' | 'dark' | 'system',
  },
};

export default config;
```

## Testing

// ...existing code for Testing...

## Documentation

// ...existing code for Documentation...

## Code Review Process

// ...existing code for Code Review Process...

## Actionable Guidelines

### When Making Infrastructure Changes
1. **Update Docker files** first to reflect the new requirements
2. **Test changes locally** using Docker Compose
3. **Document changes** in README and infrastructure documentation
4. **Update CI/CD workflows** if necessary
5. **Consider backward compatibility** for existing development environments

### When Adding Configuration Options
1. **Add to configuration model/interface** first
2. **Update example files** with the new configuration options
3. **Provide sensible defaults** where possible
4. **Document new options** in the configuration documentation
5. **Update your local .env file** with the new values for testing