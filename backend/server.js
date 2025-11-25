const express = require("express");
const crypto = require("crypto");
const { ethers } = require("ethers");
const cors = require("cors");

const app = express();
app.use(express.json());

// 1. SIMPLE CORS (Allow Everything for Debugging)
app.use(cors()); 

// 2. IN-MEMORY DATABASE (Removes MongoDB failure risk)
// Data resets when you restart the server, but it's perfect for testing.
const localDatabase = [];

// 3. BLOCKCHAIN CONFIG
const PROVIDER_URL = "http://127.0.0.1:8545"; 
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"; // <--- PASTE ADDRESS HERE
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// Load ABI safely
let CONTRACT_ABI;
try {
    const artifact = require("./EmissionTrackerABI.json");
    CONTRACT_ABI = artifact.abi || artifact;
} catch (e) {
    console.error("⚠️ Warning: EmissionTrackerABI.json not found. Blockchain calls will fail.");
    CONTRACT_ABI = [];
}

// 4. ETHERS SETUP (Crash-Proof)
let contract;
try {
    // Explicitly define the network to prevent ENS crashes
    const network = new ethers.Network("localhost", 31337);
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL, network, { staticNetwork: true });
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
} catch (error) {
    console.error("⚠️ Blockchain setup failed:", error.message);
}

// --- ROUTES ---

app.get("/", (req, res) => {
    res.send("Backend is Running!");
});

app.post("/submitEmission", async (req, res) => {
    console.log("📩 Request Received:", req.body);
    try {
        const { emission, description } = req.body;
        
        // 1. Hash
        const hash = crypto.createHash("sha256").update(description).digest("hex");

        // 2. Save Off-Chain (Memory)
        localDatabase.push({ emission, description, hash, timestamp: new Date() });
        console.log("💾 Saved to Memory DB");

        // 3. Save On-Chain
        if (!contract) throw new Error("Blockchain not connected");
        
        console.log("⛓️ Sending transaction...");
        const tx = await contract.submit(emission, hash);
        console.log("⏳ Waiting...");
        await tx.wait();
        console.log("✅ Transaction Hash:", tx.hash);

        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.get("/getEmissions", async (req, res) => {
    try {
        if (!contract) throw new Error("Blockchain not connected");

        const data = await contract.getAll();
        const formatted = data.map(entry => ({
            emission: Number(entry.emission),
            hash: entry.hash,
            timestamp: new Date(Number(entry.timestamp) * 1000).toLocaleString()
        }));
        res.json(formatted);
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Changed to 5001 to avoid AirPlay conflict
const PORT = 5001; 
app.listen(PORT, () => {
    console.log("========================================");
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log("========================================");
});