interface EnvConfig {
  VITE_API_BASE_URL: string
  VITE_APP_TITLE: string
  VITE_DEBUG: boolean
}

export const envConfig: EnvConfig = {
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  VITE_APP_TITLE: import.meta.env.VITE_APP_TITLE || 'SDKWork AIoT',
  VITE_DEBUG: import.meta.env.VITE_DEBUG === 'true'
}

export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD