import { ethers } from 'hardhat'

async function main() {
  console.log('RT11 FULL DEPLOY START')

  const [deployer] = await ethers.getSigners()
  console.log('Deployer:', deployer.address)

  // Deploy CredNFT
  const CredNFT = await ethers.getContractFactory('CredNFT')
  const cred = await CredNFT.deploy()
  await cred.waitForDeployment()
  const credAddress = await cred.getAddress()
  console.log('CredNFT:', credAddress)

  // Deploy ResonanceEngine
  const ResonanceEngine = await ethers.getContractFactory('ResonanceEngine')
  const engine = await ResonanceEngine.deploy(credAddress)
  await engine.waitForDeployment()
  const engineAddress = await engine.getAddress()
  console.log('ResonanceEngine:', engineAddress)

  // Link engine to cred
  const tx1 = await cred.setResonanceEngine(engineAddress)
  await tx1.wait()
  console.log('Linked ResonanceEngine → CredNFT')

  // Deploy TreasuryRouter
  const TreasuryRouter = await ethers.getContractFactory('TreasuryRouter')
  const treasury = await TreasuryRouter.deploy(credAddress)
  await treasury.waitForDeployment()
  const treasuryAddress = await treasury.getAddress()
  console.log('TreasuryRouter:', treasuryAddress)

  console.log('\nRT11 DEPLOY COMPLETE')
  console.log('--------------------------------')
  console.log('CredNFT:', credAddress)
  console.log('ResonanceEngine:', engineAddress)
  console.log('TreasuryRouter:', treasuryAddress)
  console.log('--------------------------------')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
