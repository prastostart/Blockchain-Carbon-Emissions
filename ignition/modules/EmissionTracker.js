const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EmissionTrackerModule", (m) => {
  // Deploy the contract
  const tracker = m.contract("EmissionTracker");

  // Return the contract instance so we can interact with it later if needed
  return { tracker };
});