// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ARTYMUSReceiptAnchor
/// @notice Anchors ARTYMUS audit receipt digests to Polygon-compatible chains.
/// @dev Stores only hashes and non-sensitive references. Do not store private payloads on-chain.
contract ARTYMUSReceiptAnchor {
    address public owner;

    string public constant SYSTEM = "ARTYMUS";
    string public constant VERSION = "1.0.0";
    bytes32 public constant ETHIC_VAULT_ANCHOR = 0x94565A33A458C91A2C217C89491C1279D97D4244D310B7BB9B4F519D09702152;

    struct ReceiptAnchor {
        bytes32 receiptDigest;
        bytes32 ethicVaultAnchor;
        string receiptId;
        string requestId;
        string decision;
        uint256 timestamp;
        address submitter;
        bool exists;
    }

    mapping(bytes32 => ReceiptAnchor) public anchors;

    event ReceiptAnchored(
        bytes32 indexed receiptDigest,
        bytes32 indexed ethicVaultAnchor,
        string receiptId,
        string requestId,
        string decision,
        uint256 timestamp,
        address indexed submitter
    );

    error AlreadyAnchored(bytes32 receiptDigest);
    error EmptyReceiptDigest();

    constructor() {
        owner = msg.sender;
    }

    function anchorReceipt(
        bytes32 receiptDigest,
        string calldata receiptId,
        string calldata requestId,
        string calldata decision
    ) external {
        if (receiptDigest == bytes32(0)) revert EmptyReceiptDigest();
        if (anchors[receiptDigest].exists) revert AlreadyAnchored(receiptDigest);

        anchors[receiptDigest] = ReceiptAnchor({
            receiptDigest: receiptDigest,
            ethicVaultAnchor: ETHIC_VAULT_ANCHOR,
            receiptId: receiptId,
            requestId: requestId,
            decision: decision,
            timestamp: block.timestamp,
            submitter: msg.sender,
            exists: true
        });

        emit ReceiptAnchored(
            receiptDigest,
            ETHIC_VAULT_ANCHOR,
            receiptId,
            requestId,
            decision,
            block.timestamp,
            msg.sender
        );
    }

    function verifyReceipt(bytes32 receiptDigest) external view returns (
        bool exists,
        bytes32 ethicVaultAnchor,
        string memory receiptId,
        string memory requestId,
        string memory decision,
        uint256 timestamp,
        address submitter
    ) {
        ReceiptAnchor memory anchor = anchors[receiptDigest];
        return (
            anchor.exists,
            anchor.ethicVaultAnchor,
            anchor.receiptId,
            anchor.requestId,
            anchor.decision,
            anchor.timestamp,
            anchor.submitter
        );
    }
}
