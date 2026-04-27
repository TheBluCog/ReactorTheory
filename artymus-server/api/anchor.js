// Polygon Anchor Adapter (non-custodial reference)

export function attachAnchor(receipt, txHash) {
  if (!txHash) return receipt;

  return {
    ...receipt,
    anchor: {
      network: "polygon",
      tx_hash: txHash,
      explorer_url: `https://polygonscan.com/tx/${txHash}`
    }
  };
}
