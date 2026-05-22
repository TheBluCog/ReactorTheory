export type RT11Mode = 'demo' | 'testnet';

const envMode = import.meta.env.VITE_RT11_EXECUTION_MODE;

export const rt11Config = {
  mode: (envMode === 'testnet' ? 'testnet' : 'demo') as RT11Mode,
  get isDemo() {
    return this.mode === 'demo';
  },
  get isTestnet() {
    return this.mode === 'testnet';
  }
};
