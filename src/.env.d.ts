/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_ML_CLIENT_ID: string
  readonly VITE_API_URL: string
  readonly VITE_API_URL_HTTPS: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
