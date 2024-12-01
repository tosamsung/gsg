/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DIGIFORCE_API_URL: string; // Replace with your environment variables
    readonly VITE_DIGIFORCE_API_KEY: string;
    readonly VITE_IFRAME_URL: string; // Replace with your environment variables
    // Add more environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  