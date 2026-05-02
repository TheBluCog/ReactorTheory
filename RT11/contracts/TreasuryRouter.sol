// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.24;

interface ICredNFT {
    function cred(address) external view returns (
        uint256 contributionGraph,
        uint256 resonanceScore,
        uint256 entropyIndex,
        uint256 ubiRightsWeight,
        bool active
    );
}

/// @title RT11 Treasury Router
/// @notice 80/20 routing + baseline + resonance-weighted UBI payouts.
contract TreasuryRouter {
    address public owner;
    ICredNFT public credNFT;

    uint256 public ubiShareBps = 8000; // 80%
    uint256 public opsShareBps = 2000; // 20%
    uint256 public baselineShareBps = 5000; // 50% of UBI

    event Deposited(address indexed from, uint256 amount);
    event Distributed(uint256 total, uint256 ubiPool, uint256 opsPool);

    modifier onlyOwner() {
        require(msg.sender == owner, "RT11: owner only");
        _;
    }

    constructor(address _credNFT) {
        owner = msg.sender;
        credNFT = ICredNFT(_credNFT);
    }

    receive() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function setCredNFT(address _credNFT) external onlyOwner {
        credNFT = ICredNFT(_credNFT);
    }

    function setSplits(uint256 _ubiShareBps, uint256 _opsShareBps, uint256 _baselineShareBps) external onlyOwner {
        require(_ubiShareBps + _opsShareBps == 10000, "RT11: invalid split");
        ubiShareBps = _ubiShareBps;
        opsShareBps = _opsShareBps;
        baselineShareBps = _baselineShareBps;
    }

    /// @notice Distribute ETH balance to recipients based on CredNFT weights.
    function distribute(address[] calldata recipients) external {
        uint256 total = address(this).balance;
        require(total > 0, "RT11: no funds");
        require(recipients.length > 0, "RT11: no recipients");

        uint256 ubiPool = (total * ubiShareBps) / 10000;
        uint256 opsPool = total - ubiPool; // remainder

        uint256 baselinePool = (ubiPool * baselineShareBps) / 10000;
        uint256 augmentationPool = ubiPool - baselinePool;

        uint256 baselinePer = baselinePool / recipients.length;

        uint256 totalWeight = 0;
        uint256[] memory weights = new uint256[](recipients.length);

        for (uint256 i = 0; i < recipients.length; i++) {
            (, , , uint256 w, bool active) = credNFT.cred(recipients[i]);
            uint256 weight = active ? w : 0;
            if (weight == 0) weight = 1e18; // floor
            weights[i] = weight;
            totalWeight += weight;
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            uint256 aug = (augmentationPool * weights[i]) / (totalWeight == 0 ? 1 : totalWeight);
            uint256 payout = baselinePer + aug;
            (bool ok, ) = recipients[i].call{value: payout}("");
            require(ok, "RT11: transfer failed");
        }

        // send ops pool to owner (can be multisig)
        if (opsPool > 0) {
            (bool ok2, ) = owner.call{value: opsPool}("");
            require(ok2, "RT11: ops transfer failed");
        }

        emit Distributed(total, ubiPool, opsPool);
    }
}
