// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

/// @title RT11 CredNFT
/// @notice Minimal soulbound-style credential for RT11 reputation state.
contract CredNFT {
    address public owner;
    address public resonanceEngine;

    struct CredState {
        uint256 contributionGraph;
        uint256 resonanceScore;
        uint256 entropyIndex;
        uint256 ubiRightsWeight;
        bool active;
    }

    mapping(address => CredState) public cred;

    event CredActivated(address indexed account);
    event CredUpdated(address indexed account, uint256 contributionGraph, uint256 resonanceScore, uint256 entropyIndex, uint256 ubiRightsWeight);
    event ResonanceEngineSet(address indexed engine);

    modifier onlyOwner() {
        require(msg.sender == owner, "RT11: owner only");
        _;
    }

    modifier onlyEngine() {
        require(msg.sender == resonanceEngine || msg.sender == owner, "RT11: engine only");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function setResonanceEngine(address engine) external onlyOwner {
        resonanceEngine = engine;
        emit ResonanceEngineSet(engine);
    }

    function activate(address account) external onlyEngine {
        cred[account].active = true;
        if (cred[account].ubiRightsWeight == 0) {
            cred[account].ubiRightsWeight = 1e18;
        }
        emit CredActivated(account);
    }

    function updateCred(
        address account,
        uint256 contributionGraph,
        uint256 resonanceScore,
        uint256 entropyIndex,
        uint256 ubiRightsWeight
    ) external onlyEngine {
        cred[account] = CredState({
            contributionGraph: contributionGraph,
            resonanceScore: resonanceScore,
            entropyIndex: entropyIndex,
            ubiRightsWeight: ubiRightsWeight,
            active: true
        });
        emit CredUpdated(account, contributionGraph, resonanceScore, entropyIndex, ubiRightsWeight);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "RT11: zero owner");
        owner = newOwner;
    }
}
