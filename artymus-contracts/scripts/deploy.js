import hre from 'hardhat';

async function main() {
  const Factory = await hre.ethers.getContractFactory('ARTYMUSReceiptAnchor');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();

  console.log('ARTYMUSReceiptAnchor deployed to:', await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
