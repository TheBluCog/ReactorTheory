import crypto from 'crypto';

export function generateReceipt(input, decision, uap) {
  const timestamp = new Date().toISOString();

  const receipt = {
    receipt_id: `rcpt_${Date.now()}`,
    request_id: input.request_id || "unknown",
    decision,
    uap_score: uap,
    proof_status: input.proof?.status || "UNKNOWN",
    anchor_hash: "94565A33A458C91A2C217C89491C1279D97D4244D310B7BB9B4F519D09702152",
    timestamp
  };

  const digest = crypto
    .createHash('sha256')
    .update(JSON.stringify(receipt))
    .digest('hex');

  return { ...receipt, digest };
}
