/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AMOY_TREASURY_ROUTER_ADDRESS?: `0x${string}`;
  readonly VITE_WALLETCONNECT_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
