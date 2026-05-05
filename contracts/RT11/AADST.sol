// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

/// @title AADST - ARTYMUS AIR Digital Security Token scaffold
/// @notice Reference architecture only. Production deployment requires securities counsel, transfer-agent integration, KYC/AML, sanctions screening, and audit.
contract AADST {
    string public constant name = "ARTYMUS AIR Digital Security Token";
    string public constant symbol = "AADST";
    uint8 public constant decimals = 0;

    address public owner;
    address public transferAgent;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => bool) public whitelisted;
    mapping(address => string) public jurisdictionTag;
    mapping(address => string) public exemptionTag;

    event Whitelisted(address indexed account, bool status);
    event TransferAgentUpdated(address indexed transferAgent);
    event Issued(address indexed investor, uint256 amount);
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event ForcedTransfer(address indexed from, address indexed to, uint256 amount, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "OWNER_ONLY");
        _;
    }

    modifier onlyTransferAgent() {
        require(msg.sender == transferAgent, "TRANSFER_AGENT_ONLY");
        _;
    }

    constructor(address initialTransferAgent) {
        owner = msg.sender;
        transferAgent = initialTransferAgent;
    }

    function setTransferAgent(address newTransferAgent) external onlyOwner {
        require(newTransferAgent != address(0), "ZERO_ADDRESS");
        transferAgent = newTransferAgent;
        emit TransferAgentUpdated(newTransferAgent);
    }

    function setWhitelist(
        address account,
        bool status,
        string calldata jurisdiction,
        string calldata exemption
    ) external onlyTransferAgent {
        whitelisted[account] = status;
        jurisdictionTag[account] = jurisdiction;
        exemptionTag[account] = exemption;
        emit Whitelisted(account, status);
    }

    function mint(address investor, uint256 amount) external onlyTransferAgent {
        require(whitelisted[investor], "INVESTOR_NOT_WHITELISTED");
        balanceOf[investor] += amount;
        totalSupply += amount;
        emit Issued(investor, amount);
        emit Transfer(address(0), investor, amount);
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        require(whitelisted[msg.sender], "SENDER_NOT_WHITELISTED");
        require(whitelisted[to], "RECIPIENT_NOT_WHITELISTED");
        require(balanceOf[msg.sender] >= amount, "INSUFFICIENT_BALANCE");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function forcedTransfer(address from, address to, uint256 amount, string calldata reason) external onlyTransferAgent {
        require(whitelisted[to], "RECIPIENT_NOT_WHITELISTED");
        require(balanceOf[from] >= amount, "INSUFFICIENT_BALANCE");

        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit ForcedTransfer(from, to, amount, reason);
        emit Transfer(from, to, amount);
    }
}
