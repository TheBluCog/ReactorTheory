// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/// @title SRT - Signal / Soulbound Token
/// @notice Non-transferable identity-bound participation token.
contract SRT {
    string public constant name = "Stakeholder Resonance Token";
    string public constant symbol = "SRT";

    address public issuer;

    mapping(address => bool) public hasToken;

    event Minted(address indexed user);
    event Revoked(address indexed user);

    modifier onlyIssuer() {
        require(msg.sender == issuer, "ISSUER_ONLY");
        _;
    }

    constructor() {
        issuer = msg.sender;
    }

    function mint(address user) external onlyIssuer {
        require(!hasToken[user], "ONE_PER_HUMAN");
        hasToken[user] = true;
        emit Minted(user);
    }

    function revoke(address user) external onlyIssuer {
        require(hasToken[user], "NOT_MINTED");
        hasToken[user] = false;
        emit Revoked(user);
    }
}
