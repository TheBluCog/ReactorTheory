// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

interface ICredNFT2 {
    function updateCred(address account, uint256 cg, uint256 rs, uint256 ei, uint256 w) external;
}

/// @title RT11 Resonance Engine
/// @notice Computes UAP and Resonance and updates CredNFT.
contract ResonanceEngine {
    address public owner;
    ICredNFT2 public credNFT;

    event Evaluated(address indexed account, uint256 uap, uint256 resonance);

    modifier onlyOwner() {
        require(msg.sender == owner, "RT11: owner only");
        _;
    }

    constructor(address _credNFT) {
        owner = msg.sender;
        credNFT = ICredNFT2(_credNFT);
    }

    function setCredNFT(address _credNFT) external onlyOwner {
        credNFT = ICredNFT2(_credNFT);
    }

    function computeUAP(uint256 E, uint256 I, uint256 C, uint256 D) public pure returns (uint256) {
        if (D == 0) D = 1;
        return (E * I * C) / D;
    }

    function computeResonance(
        uint256 E,
        uint256 I,
        uint256 C,
        uint256 D,
        uint256 networkImpact,
        uint256 entropy
    ) public pure returns (uint256) {
        if (D == 0) D = 1;
        if (entropy == 0) entropy = 1;
        return ((E * I * C) * networkImpact) / (D * entropy);
    }

    /// @notice Evaluate a participant and update CredNFT (off-chain inputs for now).
    function evaluate(
        address account,
        uint256 E,
        uint256 I,
        uint256 C,
        uint256 D,
        uint256 networkImpact,
        uint256 entropy
    ) external onlyOwner {
        uint256 u = computeUAP(E, I, C, D);
        uint256 r = computeResonance(E, I, C, D, networkImpact, entropy);

        // simplistic mapping to cred state (scaled as needed)
        uint256 cg = E;
        uint256 rs = r;
        uint256 ei = D * (1e18 - C);
        uint256 w = 1e18 + rs; // naive weight

        credNFT.updateCred(account, cg, rs, ei, w);
        emit Evaluated(account, u, r);
    }
}
