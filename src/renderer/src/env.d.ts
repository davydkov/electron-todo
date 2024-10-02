/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly RENDERER_VITE_WS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
