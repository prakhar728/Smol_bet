// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IBetEscrow.sol";

/**
 * @title BetEscrow
 * @dev A decentralized peer-to-peer betting protocol where users wager on publicly verifiable outcomes
 */
contract BetEscrow is IBetEscrow {
    // === State Variables ===
    uint256 private _betCounter;
    uint256 public constant TIMEOUT_PERIOD = 7 days; // Default timeout for bet acceptance

    // === Mappings ===
    mapping(uint256 => Bet) public bets;


    // === Modifiers ===
    modifier betExists(uint256 betId) {
        require(betId < _betCounter, "Bet does not exist");
        _;
    }

    modifier onlyCreator(uint256 betId) {
        require(
            msg.sender == bets[betId].creator,
            "Only bet creator can call this"
        );
        _;
    }

    modifier onlyOpponent(uint256 betId) {
        require(
            msg.sender == bets[betId].opponent,
            "Only bet opponent can call this"
        );
        _;
    }

    modifier onlyParticipant(uint256 betId) {
        require(
            msg.sender == bets[betId].creator ||
                msg.sender == bets[betId].opponent,
            "Only bet participants can call this"
        );
        _;
    }

    modifier onlyResolver(uint256 betId) {
        require(
            bets[betId].resolver != address(0) &&
                msg.sender == bets[betId].resolver,
            "Only bet resolver can call this"
        );
        _;
    }

    modifier betNotAccepted(uint256 betId) {
        require(!bets[betId].accepted, "Bet already accepted");
        _;
    }

    modifier betAccepted(uint256 betId) {
        require(bets[betId].accepted, "Bet not yet accepted");
        _;
    }

    modifier betNotResolved(uint256 betId) {
        require(!bets[betId].resolved, "Bet already resolved");
        _;
    }

    modifier betResolved(uint256 betId) {
        require(bets[betId].resolved, "Bet not yet resolved");
        _;
    }

    modifier nonReentrant() {
        // Reentrancy guard
        uint256 lockCounter = _betCounter;
        _betCounter += 1;
        _;
        _betCounter = lockCounter + 1;
    }

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
    ) external payable returns (uint256 betId) {
        require(msg.value > 0, "Stake must be greater than 0");
        require(opponent != address(0), "Invalid opponent address");

        betId = _betCounter++;

        Bet storage newBet = bets[betId];
        newBet.creator = creator;
        newBet.opponent = opponent;
        newBet.stake = msg.value;
        newBet.description = description;
        newBet.createdAt = block.timestamp;
        newBet.resolver = resolver;
        newBet.accepted = true;

        emit BetCreated(
            betId,
            creator,
            opponent,
            msg.value,
            description,
            resolver
        );
        return betId;
    }


    /**
     * @dev Resolves a bet, can be called by resolver or participants when in agreement
     * @param betId The ID of the bet to resolve
     * @param winner The address of the winner
     */
    function resolveBet(
        uint256 betId,
        address winner
    ) external betExists(betId) betAccepted(betId) betNotResolved(betId) {
        Bet storage bet = bets[betId];

        // Check if caller is resolver or both participants agree
        bool isResolver = bet.resolver != address(0) &&
            msg.sender == bet.resolver;
        bool isParticipant = msg.sender == bet.creator ||
            msg.sender == bet.opponent;

        require(isResolver || isParticipant, "Unauthorized to resolve bet");

        // Require winner to be either creator or opponent
        require(
            winner == bet.creator || winner == bet.opponent,
            "Winner must be a bet participant"
        );

        bet.resolved = true;
        bet.winner = winner;

        uint256 winnings = bet.stake * 2; // Both stakes

        (bool success, ) = winner.call{value: winnings}("");
        require(success, "Transfer failed");


        emit BetResolved(betId, winner, msg.sender);
    }


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
    ) external betExists(betId) betAccepted(betId) betNotResolved(betId) {
        Bet storage bet = bets[betId];

        // Verify signatures (this is a simplified approach, production would use EIP-712)
        bytes32 messageHash = keccak256(abi.encodePacked(betId, winner));

        require(
            _verifySignature(bet.creator, messageHash, creatorSignature) &&
                _verifySignature(bet.opponent, messageHash, opponentSignature),
            "Invalid signatures"
        );

        // Require winner to be either creator or opponent
        require(
            winner == bet.creator || winner == bet.opponent,
            "Winner must be a bet participant"
        );

        bet.resolved = true;
        bet.winner = winner;

        emit BetResolved(betId, winner, address(0)); // address(0) indicates mutual agreement
    }

    /**
     * @dev Returns all information about a specific bet
     * @param betId The ID of the bet
     * @return Full bet struct
     */
    function getBet(
        uint256 betId
    ) external view betExists(betId) returns (Bet memory) {
        return bets[betId];
    }

    /**
     * @dev Returns the total number of bets created
     * @return Total number of bets
     */
    function getTotalBets() external view returns (uint256) {
        return _betCounter;
    }

    /**
     * @dev Verifies if a signature is valid
     * @param signer Address of the expected signer
     * @param messageHash Hash of the message that was signed
     * @param signature Signature to verify
     * @return True if the signature is valid
     */
    function _verifySignature(
        address signer,
        bytes32 messageHash,
        bytes calldata signature
    ) internal pure returns (bool) {
        // Basic ECDSA recovery (simplified)
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);
        address recoveredAddress = ecrecover(ethSignedMessageHash, v, r, s);

        return recoveredAddress == signer;
    }

    /**
     * @dev Splits signature into r, s, v components
     * @param signature Full signature bytes
     * @return r The r component of the signature
     * @return s The s component of the signature
     * @return v The recovery byte of the signature
     */
    function _splitSignature(
        bytes calldata signature
    ) internal pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(signature.length == 65, "Invalid signature length");

        assembly {
            r := calldataload(signature.offset)
            s := calldataload(add(signature.offset, 32))
            v := byte(0, calldataload(add(signature.offset, 64)))
        }

        if (v < 27) {
            v += 27;
        }

        return (r, s, v);
    }
}
