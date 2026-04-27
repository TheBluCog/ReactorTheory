import { ethers } from 'ethers';

export async function autoAnchorLive(receipt) {
  const provider = new ethers.JsonRpcProvider(process.env.POLYGON_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const contract = new ethers.Contract(
    process.env.CONTRACT_ADDRESS,
    [
      "function anchorReceipt(bytes32,string,string,string) public"
    ],
    wallet
  );

  const tx = await contract.anchorReceipt(
    receipt.digest,
    receipt.receipt_id,
    receipt.request_id,
    receipt.decision
  );

  await tx.wait();

  return {
    tx_hash: tx.hash,
    explorer: `https://polygonscan.com/tx/${tx.hash}`
  };
}
