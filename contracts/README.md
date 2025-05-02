# BetEscrow Protocol

A decentralized, peer-to-peer betting protocol where users can wager against each other based on publicly verifiable outcomes.

## Key Features

- 🔒 **Permissionless Bet Creation**: Anyone can create bets with escrowed funds
- 💰 **Secure Fund Management**: Stakes are locked in the contract until the bet is resolved
- ⚖️ **Multiple Resolution Methods**: 
  - Third-party arbitration via "resolver" addresses (e.g., Shade Agents)
  - Mutual agreement between participants
- ⏰ **Timeout Protection**: Bet creators can cancel and reclaim funds if opponents don't join within the timeout period

## Project Structure

```
├── src/
│   └── BetEscrow.sol        # Main contract
├── test/
│   └── BetEscrow.t.sol      # Contract tests
├── script/
│   └── DeployBetEscrow.s.sol # Deployment script
└── foundry.toml             # Foundry configuration
```

## Getting Started

### Prerequisites

- [Git](https://git-scm.com/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Installation

1. Clone the repo and navigate to the project directory
```bash
git clone <your-repo-url>
cd BetEscrow
```

2. Install dependencies
```bash
forge install
```

3. Compile the contracts
```bash
forge build
```

### Testing

Run the test suite with:
```bash
forge test -vvv
```

## Deployment

### Setup Environment Variables

Create a `.env` file in the root directory with:
```
PRIVATE_KEY=your_private_key_here
BASESCAN_API_KEY=your_basescan_api_key_here
```

Then load the environment variables:
```bash
source .env
```

### Deploy to Base Sepolia Testnet

```bash
forge script script/DeployBetEscrow.s.sol:DeployBetEscrow --rpc-url base_sepolia --broadcast --verify
```

## Contract Usage

### Creating a Bet

```solidity
function createBet(string calldata description, address opponent, address resolver) external payable returns (uint256 betId)
```
- `description`: A text description of the bet conditions
- `opponent`: The address of the user you're betting against
- `resolver`: Optional address of a third-party that can resolve the bet (can be address(0))

### Joining a Bet

```solidity
function joinBet(uint256 betId) external payable
```
- `betId`: ID of the bet to join
- Must send exactly the same stake amount as the creator

### Resolving a Bet

By resolver or participant:
```solidity
function resolveBet(uint256 betId, address winner) external
```

By mutual agreement (with signatures):
```solidity
function resolveByMutualAgreement(uint256 betId, address winner, bytes calldata creatorSignature, bytes calldata opponentSignature) external
```

### Claiming Winnings

```solidity
function claimWinnings(uint256 betId) external
```

### Cancelling a Bet

```solidity
function cancelBet(uint256 betId) external
```
- Can only be called by creator
- Can only be called if bet hasn't been accepted
- Can only be called after the timeout period (7 days by default)

## Base Testnet Resources

- RPC: `https://sepolia.base.org`
- Faucet: [Base Sepolia Faucet](https://www.coinbase.com/developer/faucets/base-sepolia-faucet)
- Explorer: [Base Sepolia Explorer](https://sepolia.basescan.org/)

## Security Considerations

- The contract includes a reentrancy guard to prevent attacks during fund transfers
- All state changes happen before external calls
- Signatures for mutual agreement resolution use Ethereum's standard signing format
- Timeout protection prevents funds from being locked indefinitely

## License

This project is licensed under the MIT License.

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
