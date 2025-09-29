// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IBetEscrow
 * @dev Interface for the BetEscrow contract
 */
interface IBetEscrow {
    // === Structs ===
    struct Bet {
        address creator;
        address opponent;
        uint256 stake;
        string description;
        uint256 createdAt;
        bool accepted;
        bool resolved;
        address winner;
        address resolver; // optional arbiter
    }
    
    // === Events ===
    event BetCreated(
        uint256 indexed betId,
        address indexed creator,
        address indexed opponent,
        uint256 stake,
        string description,
        address resolver
    );
    
    event BetResolved(
        uint256 indexed betId,
        address indexed winner,
        address indexed resolver
    );
    
    // === Functions ===
    
    /**
     * @dev Creates a new bet between creator and opponent
     * @param description The description of the bet
     * @param creator The address of the creator
     * @param opponent The address of the opponent
     * @param resolver Optional address of a third-party resolver
     * @return betId The ID of the created bet
     */
    function createBet(
        string calldata description,
        address creator,
        address opponent,
        address resolver
    ) external payable returns (uint256 betId);
    
    /**
     * @dev Resolves a bet, can be called by resolver or participants when in agreement
     * @param betId The ID of the bet to resolve
     * @param winner The address of the winner
     */
    function resolveBet(uint256 betId, address winner) external;
    
    /**
     * @dev Handles mutual agreement on bet resolution by both parties
     * @param betId The ID of the bet to resolve
     * @param winner The address of the winner
     * @param creatorSignature Signature from creator
     * @param opponentSignature Signature from opponent
     */
    function resolveByMutualAgreement(
        uint256 betId,
        address winner,
        bytes calldata creatorSignature,
        bytes calldata opponentSignature
    ) external;
    
    /**
     * @dev Returns all information about a specific bet
     * @param betId The ID of the bet
     * @return Full bet struct
     */
    function getBet(uint256 betId) external view returns (Bet memory);
    
    /**
     * @dev Returns the total number of bets created
     * @return Total number of bets
     */
    function getTotalBets() external view returns (uint256);
    
    /**
     * @dev Returns the current balance of the contract
     * @return The contract's balance in wei
     */
    function getContractBalance() external view returns (uint256);
}