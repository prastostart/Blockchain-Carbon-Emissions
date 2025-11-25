🌍 Carbon Emission Tracker (Hybrid Web3)
A Hybrid DApp (Decentralized Application) that tracks carbon emissions. It demonstrates the "Off-chain Storage, On-chain Proof" pattern often used in enterprise blockchain solutions.

🏗 Architecture
Frontend (React): 
User interface to submit data and view the dashboard.

Backend (Express.js):
- Hashes the private data (Description).
- Stores full data in a local database (MongoDB/In-Memory).
- Signs a transaction to store the Emission Value + Data Hash on the Blockchain.
  lockchain (Hardhat/Solidity): Stores the immutable proof of integrity.
  
🚀 Installation & Setup

This project consists of three parts. You will need 3 separate terminal windows.

Part 1: Blockchain (The Ledger)

Navigate to the folder:
code
Bash
cd blockchain
npm install

Terminal 1: Start the local blockchain node.
code
Bash
npx hardhat node
(Keep this running! Do not close it.)

Terminal 2: Deploy the Smart Contract.
code
Bash
npx hardhat ignition deploy ./ignition/modules/EmissionTracker.js --network localhost
⚠️ IMPORTANT: Copy the Contract Address outputted here (e.g., 0x5Fb...). You will need it for the Backend.

Part 2: Backend (The API)

Navigate to the folder:
code
Bash
cd backend
npm install
Configure server.js:
Open server.js.
Find const CONTRACT_ADDRESS = "...".
Paste the address you copied from the deployment step.

Terminal 2 (Reused): Start the server.

code
Bash
node server.js
Note: The server runs on Port 5001 to avoid conflicts with macOS AirPlay (Port 5000).

Part 3: Frontend (The UI)

Navigate to the folder:
code
Bash
cd frontend
npm install

Terminal 3: Start the React app.
code
Bash
npm start
Open http://localhost:3000 in your browser.

🕵️‍♂️ Usage Flow
Submit Data: Enter an emission amount (e.g., 500) and a description (e.g., "Factory Output Q1").
Process:
Backend creates a SHA256 hash of the description.
Backend sends the Hash + Amount to the Blockchain.
Verify: The Dashboard updates to show the data fetched directly from the Blockchain.

Backend: Node.js, Express, Ethers.js v6
Frontend: React, Axios
Database: MongoDB (Optional/Hybrid)
