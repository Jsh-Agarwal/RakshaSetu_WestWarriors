const hre = require("hardhat");

async function main() {
  // Deploy CrimeLedger
  const CrimeLedger = await hre.ethers.getContractFactory("CrimeLedger");
  const ledger = await CrimeLedger.deploy();
  
  await ledger.waitForDeployment();
  console.log("CrimeLedger deployed to:", await ledger.getAddress());
  
  // Get test accounts
  const [admin, citizen, officer] = await hre.ethers.getSigners();
  console.log("Admin address:", admin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});