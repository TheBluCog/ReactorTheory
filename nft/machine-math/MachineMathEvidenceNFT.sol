// SPDX-License-Identifier: Apache-2.0
pragma solidity 0.8.24;

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

/// @title MACHINE.MATH Evidence
/// @notice One-of-one ERC-721 bound to RT5ArtifactRegistry artifact 13 on Ethereum Sepolia.
/// @dev The constructor mints token 13 to the deployer. There is no admin, external mint, burn,
///      upgrade, pause, royalty, or metadata mutation path.
contract MachineMathEvidenceNFT {
    string public constant name = "MACHINE.MATH Evidence";
    string public constant symbol = "MMATH";

    uint256 public constant TOKEN_ID = 13;
    uint256 public constant ARTIFACT_ID = 13;
    address public constant REGISTRY = 0x7F768D887397f305f146E5852625Eb2908Bac3B9;
    bytes32 public constant SHA256_HASH =
        0x95505502c600c81e276192e26108facab2bb496bf4117ef5f50a1116c0452019;
    bytes32 public constant KECCAK256_HASH =
        0x0ecbe462bbdf05832eec55d40987e5571d3ea53b05a9a5df29827841de9928d4;
    bytes32 public constant ANCHOR_TX_HASH =
        0x1a646c24073d3d79e51afcf9b71ad62c5b18097acca8298e843441a35bf4b934;

    string private constant TOKEN_URI = "data:application/json;base64,eyJuYW1lIjoiTUFDSElORS5NQVRIIFRyaW5vbWlhbCBQb2x5bWF0aCBFdmlkZW5jZSAjMTMiLCJkZXNjcmlwdGlvbiI6IkltbXV0YWJsZSBFUkMtNzIxIGV2aWRlbmNlIHRva2VuIGJvdW5kIHRvIEV0aGljIFZhdWx0IFJUNSBhcnRpZmFjdCAxMyBvbiBFdGhlcmV1bSBTZXBvbGlhLiBUaGUgcmVnaXN0cnkgcHJvdmVzIHRoZSBzdXBwbGllZCBzb3VyY2UtYXJ0aWZhY3QgaGFzaGVzIGFuZCBVUkk7IHRoZSBwdWJsaWMgZGlzcGxheSBpbWFnZSBpcyBhIEdpdC1jb21taXQtcGlubmVkIGRlcml2YXRpdmUgb2YgdGhlIGFuY2hvcmVkIEpQRy4iLCJpbWFnZSI6Imh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9UaGVCbHVDb2cvUmVhY3RvclRoZW9yeS8yNGQyZWUzNjMyNGE2ODg0NWQ1M2U1YjQ2MDMyMWQ3NTIwMTBkYWQxL25mdC9tYWNoaW5lLW1hdGgvTUFDSElORV9NQVRIX1RSSU5PTUlBTF9QT0xZTUFUSF9ORlRfRElTUExBWS5qcGciLCJleHRlcm5hbF91cmwiOiJodHRwczovL2V0aC1zZXBvbGlhLmJsb2Nrc2NvdXQuY29tL3R4LzB4MWE2NDZjMjQwNzNkM2Q3OWU1MWFmY2Y5YjcxYWQ2MmM1YjE4MDk3YWNjYTgyOThlODQzNDQxYTM1YmY0YjkzNCIsImF0dHJpYnV0ZXMiOlt7InRyYWl0X3R5cGUiOiJBcnRpZmFjdCBJRCIsInZhbHVlIjoxMywiZGlzcGxheV90eXBlIjoibnVtYmVyIn0seyJ0cmFpdF90eXBlIjoiQXJ0aWZhY3QgVHlwZSIsInZhbHVlIjoiTUFDSElORS5NQVRILlNQRUMifSx7InRyYWl0X3R5cGUiOiJTeXN0ZW0gSUQiLCJ2YWx1ZSI6Ik1BQ0hJTkUuTUFUSC5UUklOT01JQUxfUE9MWU1BVEgifSx7InRyYWl0X3R5cGUiOiJSaW5nIiwidmFsdWUiOiJMRUZUIn0seyJ0cmFpdF90eXBlIjoiTm9kZSIsInZhbHVlIjoiRFVOUEhZRyJ9LHsidHJhaXRfdHlwZSI6Ik5ldHdvcmsiLCJ2YWx1ZSI6IkV0aGVyZXVtIFNlcG9saWEifSx7InRyYWl0X3R5cGUiOiJSZWdpc3RyeSIsInZhbHVlIjoiUlQ1QXJ0aWZhY3RSZWdpc3RyeSJ9LHsidHJhaXRfdHlwZSI6IkV2aWRlbmNlIFN0YXR1cyIsInZhbHVlIjoiQU5DSE9SRUQifV0sInByb3BlcnRpZXMiOnsiY2hhaW5faWQiOjExMTU1MTExLCJ0b2tlbl9pZCI6MTMsInJlZ2lzdHJ5IjoiMHg3Rjc2OEQ4ODczOTdmMzA1ZjE0NkU1ODUyNjI1RWIyOTA4QmFjM0I5IiwiYXJ0aWZhY3RfaWQiOjEzLCJhbmNob3JfdHJhbnNhY3Rpb24iOiIweDFhNjQ2YzI0MDczZDNkNzllNTFhZmNmOWI3MWFkNjJjNWIxODA5N2FjY2E4Mjk4ZTg0MzQ0MWEzNWJmNGI5MzQiLCJzb3VyY2VfYXJ0aWZhY3QiOnsiZmlsZV9uYW1lIjoiTUFDSElORV9NQVRIX1RSSU5PTUlBTF9QT0xZTUFUSF9TUEVDX0VUSElDVkFVTFQuanBnIiwibWltZV90eXBlIjoiaW1hZ2UvanBlZyIsImJ5dGVzIjo0NjQyNjAsInNoYTI1NiI6Ijk1NTA1NTAyYzYwMGM4MWUyNzYxOTJlMjYxMDhmYWNhYjJiYjQ5NmJmNDExN2VmNWY1MGExMTE2YzA0NTIwMTkiLCJrZWNjYWsyNTYiOiIweDBlY2JlNDYyYmJkZjA1ODMyZWVjNTVkNDA5ODdlNTU3MWQzZWE1M2IwNWE5YTVkZjI5ODI3ODQxZGU5OTI4ZDQiLCJ1cmkiOiJ1cm46ZXRoaWN2YXVsdDpzaGEyNTY6OTU1MDU1MDJjNjAwYzgxZTI3NjE5MmUyNjEwOGZhY2FiMmJiNDk2YmY0MTE3ZWY1ZjUwYTExMTZjMDQ1MjAxOSJ9LCJkaXNwbGF5X2Rlcml2YXRpdmUiOnsiZmlsZV9uYW1lIjoiTUFDSElORV9NQVRIX1RSSU5PTUlBTF9QT0xZTUFUSF9ORlRfRElTUExBWS5qcGciLCJieXRlcyI6NjA1NjYsInNoYTI1NiI6IjFiNjJiYjAxMDE5ZWFhMGVkZDZjYjY5YmVjNGQ2MTc4NDZlZjI5MzVhM2MwYjVlYmI4ZjBlM2FlMmI3YzljOTQiLCJnaXRfY29tbWl0IjoiMjRkMmVlMzYzMjRhNjg4NDVkNTNlNWI0NjAzMjFkNzUyMDEwZGFkMSJ9LCJjbGFpbV9zY29wZSI6IlRoaXMgdG9rZW4gcmVjb3JkcyBwcm92ZW5hbmNlIGFuZCBoYXNoIGJpbmRpbmcgb24gRXRoZXJldW0gU2Vwb2xpYS4gSXQgZG9lcyBub3QgaW5kZXBlbmRlbnRseSB2YWxpZGF0ZSB0aGUgc3Vic3RhbnRpdmUgY2xhaW1zIHdpdGhpbiB0aGUgc291cmNlIGFydGlmYWN0IGFuZCBoYXMgbm8gY29udHJhY3R1YWwgb3IgZmluYW5jaWFsIGF1dGhvcml0eS4ifX0=";

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event EvidenceBound(
        uint256 indexed tokenId,
        address indexed registry,
        uint256 indexed artifactId,
        bytes32 sha256Hash,
        bytes32 keccak256Hash,
        bytes32 anchorTxHash
    );

    error SepoliaOnly();
    error ZeroAddress();
    error NonexistentToken();
    error NotAuthorized();
    error WrongOwner();
    error UnsafeRecipient();
    error SelfApproval();

    constructor() {
        if (block.chainid != 11155111) revert SepoliaOnly();
        _owners[TOKEN_ID] = msg.sender;
        _balances[msg.sender] = 1;
        emit Transfer(address(0), msg.sender, TOKEN_ID);
        emit EvidenceBound(
            TOKEN_ID,
            REGISTRY,
            ARTIFACT_ID,
            SHA256_HASH,
            KECCAK256_HASH,
            ANCHOR_TX_HASH
        );
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 ||
            interfaceId == 0x80ac58cd ||
            interfaceId == 0x5b5e139f;
    }

    function balanceOf(address tokenOwner) external view returns (uint256) {
        if (tokenOwner == address(0)) revert ZeroAddress();
        return _balances[tokenOwner];
    }

    function ownerOf(uint256 tokenId) public view returns (address tokenOwner) {
        tokenOwner = _owners[tokenId];
        if (tokenOwner == address(0)) revert NonexistentToken();
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        ownerOf(tokenId);
        return TOKEN_URI;
    }

    function approve(address approved, uint256 tokenId) external {
        address tokenOwner = ownerOf(tokenId);
        if (approved == tokenOwner) revert SelfApproval();
        if (msg.sender != tokenOwner && !_operatorApprovals[tokenOwner][msg.sender]) {
            revert NotAuthorized();
        }
        _tokenApprovals[tokenId] = approved;
        emit Approval(tokenOwner, approved, tokenId);
    }

    function getApproved(uint256 tokenId) external view returns (address) {
        ownerOf(tokenId);
        return _tokenApprovals[tokenId];
    }

    function setApprovalForAll(address operator, bool approved) external {
        if (operator == address(0)) revert ZeroAddress();
        if (operator == msg.sender) revert SelfApproval();
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function isApprovedForAll(address tokenOwner, address operator) external view returns (bool) {
        return _operatorApprovals[tokenOwner][operator];
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        address tokenOwner = ownerOf(tokenId);
        if (tokenOwner != from) revert WrongOwner();
        if (to == address(0)) revert ZeroAddress();
        if (
            msg.sender != tokenOwner &&
            msg.sender != _tokenApprovals[tokenId] &&
            !_operatorApprovals[tokenOwner][msg.sender]
        ) revert NotAuthorized();

        delete _tokenApprovals[tokenId];
        unchecked {
            _balances[from] -= 1;
            _balances[to] += 1;
        }
        _owners[tokenId] = to;
        emit Transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        _safeTransfer(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external {
        _safeTransfer(from, to, tokenId, data);
    }

    function _safeTransfer(address from, address to, uint256 tokenId, bytes memory data) private {
        transferFrom(from, to, tokenId);
        if (to.code.length != 0) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (
                bytes4 response
            ) {
                if (response != IERC721Receiver.onERC721Received.selector) revert UnsafeRecipient();
            } catch (bytes memory reason) {
                if (reason.length == 0) revert UnsafeRecipient();
                assembly ("memory-safe") {
                    revert(add(reason, 32), mload(reason))
                }
            }
        }
    }
}
