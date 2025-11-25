// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EmissionTracker {
    // 1. Define the structure of a record
    struct Entry {
        uint256 emission; // The numeric value (e.g., CO2 in kg)
        string hash;      // The SHA256 hash of the description
        uint256 timestamp; // When it was added
    }

    // 2. An array to store all records
    Entry[] public entries;

    // 3. Submit Function: Adds a new entry to the array
    function submit(uint256 _emission, string memory _hash) public {
        entries.push(Entry({
            emission: _emission,
            hash: _hash,
            timestamp: block.timestamp // Uses the blockchain's clock
        }));
    }

    // 4. Get All Function: Returns the full list
    function getAll() public view returns (Entry[] memory) {
        return entries;
    }
}