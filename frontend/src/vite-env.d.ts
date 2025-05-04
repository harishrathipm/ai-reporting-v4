/// <reference types="vite/client" />

// Type declaration for JSON imports (needed for env.json)
declare module "*.json" {
  const value: any;
  export default value;
}