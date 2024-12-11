/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DIGIFORCE_API_URL: string; 
    readonly VITE_DIGIFORCE_API_KEY: string;
    readonly VITE_IFRAME_URL: string;
    readonly VITE_PLAY_URL: string; 

    // Add more environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  