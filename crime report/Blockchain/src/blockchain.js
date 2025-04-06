const { ethers } = require('ethers');
require('dotenv').config();

// Initialize provider and signer
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Simplified contract ABI (only essential functions)
const contractABI = [
  "function submitReport(uint256,bytes32,string,string,string,string[],uint256) external",
  "function reportCounter() external view returns (uint256)",
  "function reports(uint256) external view returns (tuple(uint256,bytes32,string,string,string,uint256,uint256,uint8,address))"
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

module.exports = {
  getProvider: () => provider,
  getContract: () => contract,
  getReportCount: async () => await contract.reportCounter(),
  submitReport: async (reportData) => {
    const tx = await contract.submitReport(
      reportData.citizenId,
      reportData.nameHash,
      reportData.encryptedNameIPFS,
      reportData.currentLocation,
      reportData.crimeLocation,
      reportData.evidenceURIs,
      reportData.crimeTime
    );
    return tx.wait();
  }
};