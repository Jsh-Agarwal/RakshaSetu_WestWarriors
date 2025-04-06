const express = require('express');
const cors = require('cors');
const { 
  getProvider,
  getContract,
  getReportCount,
  submitReport
} = require('./blockchain');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const network = await getProvider().getNetwork();
    res.json({
      status: 'running',
      chainId: network.chainId,
      contractAddress: getContract().target
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit new report
app.post('/api/reports', async (req, res) => {
  try {
    const txReceipt = await submitReport({
      citizenId: 1, // Mock citizen ID
      nameHash: ethers.id("John Doe"),
      encryptedNameIPFS: "ipfs://Qm...",
      currentLocation: "40.7128,-74.0060",
      crimeLocation: "40.7128,-74.0060",
      evidenceURIs: ["ipfs://Qm..."],
      crimeTime: Math.floor(Date.now() / 1000)
    });
    
    res.json({
      success: true,
      transactionHash: txReceipt.hash,
      blockNumber: txReceipt.blockNumber
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      details: error.stack 
    });
  }
});

// Get report count
app.get('/api/reports/count', async (req, res) => {
  try {
    const count = await getReportCount();
    res.json({ count: Number(count) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Connected to contract at ${getContract().target}`);
});