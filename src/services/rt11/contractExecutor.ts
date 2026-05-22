import { rt11Config } from '../../config/rt11.config';

export const contractExecutor = {
  /**
   * Hard safety check for RT11 execution.
   * Blocks any blockchain transaction if not in testnet mode.
   */
  verifyExecutionMode() {
    if (!rt11Config.isTestnet) {
      throw new Error("RT11 execution blocked: testnet mode required");
    }
  },

  /**
   * Validates payout recipients to prevent execution with unsafe addresses.
   */
  validateAddresses(addresses: readonly string[]) {
    const invalid = addresses.some(addr => 
      !addr || 
      addr === '0x0000000000000000000000000000000000000000' || 
      addr === '0x0000000000000000000000000000000000000001'
    );
    if (invalid) {
      throw new Error("RT11 execution blocked: invalid payout recipient address detected");
    }
  }
};
