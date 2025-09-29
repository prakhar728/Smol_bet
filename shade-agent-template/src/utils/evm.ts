import { ethers } from "ethers";
import BET_ESCROW_CONTRACT from "../assets/BetEscrow.json";
import { networkId } from "../lib/chain-signatures";
import { Evm } from "../lib/chain-adapters/ethereum";
import { requestSignature, contractCall } from "@neardefi/shade-agent-js";
import { utils } from "chainsig.js";
import { AuroraTestnet, BaseSepolia, chainAnnotationToRpc } from "../lib/chain-adapters";
const { toRSV, uint8ArrayToHex } = utils.cryptography;

// BetEscrow contract address
const BET_ESCROW_ADDRESS = {
  "BS": "0xFd5152d481CB46Ea91AA317782e5963eDc45a609", // Replace with your testnet contract address
  "AT": "0x402BB0aD0B394EB38ebAA0a5c271eE01341e2AF0"
};

// ABI for BetEscrow contract
const BET_ESCROW_ABI = BET_ESCROW_CONTRACT.abi;

const getProvider = (chain: string) => {
  return new ethers.JsonRpcProvider(
    chainAnnotationToRpc[chain]
  );
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Interface for transfer parameters
 */
interface TransferFromAndToParams {
  fromAddresses: string[];
  toAddress: string;
  paths: string[];
  amounts: bigint[];
  gasLimit?: bigint;
  chain: string;
}

/**
 * Interface for individual transfer result
 */
interface TransferResult {
  success: boolean;
  from: string;
  hash?: string;
  explorerLink?: string;
  amount?: bigint;
  error?: string;
}

/**
 * Interface for overall transfer operation result
 */
interface TransferOperationResult {
  success: boolean;
  transfers: TransferResult[];
}

/**
 * Interface for deposit transfer parameters
 */
interface TransferDepositsToResolverParams {
  creatorDepositAddress: string;
  opponentDepositAddress: string;
  resolverAddress: string;
  creatorBetPath: string;
  opponentBetPath: string;
  individualStake: bigint;
  chain: string;
}

export const evm = {
  name: "Base",
  chainId: networkId === "testnet" ? 84532 : 8453,
  currency: "ETH",
  explorer:
    networkId === "testnet"
      ? "https://sepolia.basescan.org"
      : "https://basescan.org",

  // Get the BetEscrow contract instance
  getBankrContract: async (chain: string) => {
    const provider = getProvider(chain);
    return new ethers.Contract(
      BET_ESCROW_ADDRESS[chain],
      BET_ESCROW_ABI,
      provider
    );
  },

  getChainAdapter: (chain: string) => {
    if (chain == "AT") {
      return AuroraTestnet;
    } else if (chain == "BS") {
      return BaseSepolia;
    }
  },

  getProvider: getProvider,

  // Get the deployer account (fee collector)
  getBankrDeployer: async () => {
    // This should return the account that can collect fees or otherwise
    // manage the BetEscrow contract. Could be modified based on your needs.
    return { address: BET_ESCROW_ADDRESS[networkId] };
  },

  // Create a bet in the BetEscrow contract
  createBetTx: async ({
    description,
    creator,
    opponent,
    resolver,
    stake,
    path,
    chain
  }) => {
    try {
      // Create contract interface
      const betEscrowInterface = new ethers.Interface(BET_ESCROW_ABI);

      // Get provider and prepare transaction
      console.log("Creating bet with creator", creator);

      // Encode function call - note the stake is passed as value, not a parameter
      const data = betEscrowInterface.encodeFunctionData("createBet", [
        description,
        creator,
        opponent,
        resolver || ethers.ZeroAddress,
      ]);

      console.log("resolverAddress", resolver);
      console.log("resolver path", path);

      const adapter = evm.getChainAdapter(chain);

      const { transaction, hashesToSign } = await adapter.prepareTransactionForSigning({
        from: resolver,
        to: BET_ESCROW_ADDRESS[chain],
        value: stake,
        data,
      });

      // Call the agent contract to get a signature for the payload
      const signRes = await requestSignature({
        path: path,
        payload: uint8ArrayToHex(hashesToSign[0]),
      });

      // Reconstruct the signed transaction
      const signedTransaction = adapter.finalizeTransactionSigning({
        transaction,
        rsvSignatures: [toRSV(signRes)],
      });

      // Broadcast the signed transaction
      const txHash = await adapter.broadcastTx(signedTransaction);

      // Send back both the txHash and the new price optimistically
      return {
        success: true,
        hash: txHash.hash,
        explorerLink: `${evm.explorer}/tx/${txHash.hash}`,
      };

    } catch (error) {
      console.error("Error in creating bet:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Resolve a bet in the BetEscrow contract
  resolveBetTx: async ({ betId, winner, resolverAddress, path, chain }) => {
    try {
      // Create contract interface
      const betEscrowInterface = new ethers.Interface(BET_ESCROW_ABI);

      // Encode function call
      const data = betEscrowInterface.encodeFunctionData("resolveBet", [
        betId,
        winner,
      ]);

      const adapter = evm.getChainAdapter(chain);

      const { transaction, hashesToSign } = await adapter.prepareTransactionForSigning({
        to: BET_ESCROW_ADDRESS[chain],
        value: 0,
        data,
        from: resolverAddress as `0x${string}`,
        account: resolverAddress as `0x${string}`
      });

      // Call the agent contract to get a signature for the payload
      const signRes = await requestSignature({
        path: path,
        payload: uint8ArrayToHex(hashesToSign[0]),
      });

      // Reconstruct the signed transaction
      const signedTransaction = adapter.finalizeTransactionSigning({
        transaction,
        rsvSignatures: [toRSV(signRes)],
      });

      // Broadcast the signed transaction
      const txHash = await adapter.broadcastTx(signedTransaction);

      // Send back both the txHash and the new price optimistically
      return {
        success: true,
        hash: txHash.hash,
        explorerLink: `${evm.explorer}/tx/${txHash.hash}`,
      };
    } catch (error) {
      console.error("Error in resolving bet:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  getBetCount: async (chain: string) => {
    try {
      const contract = await evm.getBankrContract(chain);
      const bets = await contract.getTotalBets();

      return parseInt(bets);
    } catch (error) {
      console.error("Error getting bet details:", error);
      return null;
    }
  },

  // Get bet details
  getBetDetails: async (betId) => {
    try {
      const contract = await evm.getBankrContract();
      const bet = await contract.getBet(betId);
      return {
        creator: bet.creator,
        opponent: bet.opponent,
        stake: bet.stake,
        description: bet.description,
        accepted: bet.accepted,
        resolved: bet.resolved,
        winner: bet.winner,
        createdAt: bet.createdAt,
        resolver: bet.resolver,
      };
    } catch (error) {
      console.error("Error getting bet details:", error);
      return null;
    }
  },

  getGasPrice: async (chain: string) => getProvider(chain).getFeeData(),
  getBalance: ({ address, chain }) => getProvider(chain).getBalance(address),
  formatBalance: (balance) => ethers.formatEther(balance),

  transferFromAndTo: async ({
    fromAddresses,
    toAddress,
    paths,
    amounts,
    chain,
  }: TransferFromAndToParams): Promise<TransferOperationResult> => {
    if (!fromAddresses || !Array.isArray(fromAddresses) || !toAddress) {
      console.error("Must provide fromAddresses array and toAddress");
      return { success: false, transfers: [] };
    }

    if (
      !paths ||
      !Array.isArray(paths) ||
      paths.length !== fromAddresses.length
    ) {
      console.error("Must provide a path for each fromAddress");
      return { success: false, transfers: [] };
    }

    if (
      !amounts ||
      !Array.isArray(amounts) ||
      amounts.length !== fromAddresses.length
    ) {
      console.error("Must provide an amount for each fromAddress");
      return { success: false, transfers: [] };
    }

    const provider = getProvider(chain);
    const results: TransferResult[] = [];

    // Process each transfer sequentially
    for (let i = 0; i < fromAddresses.length; i++) {
      const from = fromAddresses[i];
      const path = paths[i];
      const amount = amounts[i];

      try {
        // Check balance
        const balance = await provider.getBalance(from);
        console.log(`Balance of ${from}: ${ethers.formatEther(balance)} ETH`);

        const adapter = evm.getChainAdapter(chain);

        const valueToSend = amount;

        if (valueToSend <= 0n) {
          console.log(
            `Insufficient balance in ${from} to cover gas costs and transfer`
          );
          results.push({
            success: false,
            from,
            error: "Insufficient balance",
          });
          continue;
        }

        const { transaction, hashesToSign } = await adapter.prepareTransactionForSigning({
          from: from,
          to: toAddress,
          value: valueToSend,
          data: "0x",
        });

        const signRes = await requestSignature({
          path: path,
          payload: uint8ArrayToHex(hashesToSign[0]),
        });

        const signedTransaction = adapter.finalizeTransactionSigning({
          transaction,
          rsvSignatures: [toRSV(signRes)],
        });


        const txHash = await adapter.broadcastTx(signedTransaction);

        if (txHash) {
          results.push({
            success: true,
            from: from,
            hash: txHash,
          })
        }

        // Add a small delay between transactions
        await sleep(2000);
      } catch (error) {
        console.error(`Error transferring from ${from}:`, error);
        results.push({
          success: false,
          from,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return {
      success: results.every((r) => r.success),
      transfers: results,
    };
  },

  transferDepositsToResolver: async ({
    creatorDepositAddress,
    opponentDepositAddress,
    resolverAddress,
    creatorBetPath,
    opponentBetPath,
    individualStake,
    chain,
  }: TransferDepositsToResolverParams): Promise<TransferOperationResult> => {
    if (!creatorDepositAddress || !opponentDepositAddress || !resolverAddress) {
      console.error("Missing required addresses");
      return { success: false, transfers: [] };
    }

    if (!creatorBetPath || !opponentBetPath) {
      console.error("Missing required paths");
      return { success: false, transfers: [] };
    }

    // Use 0n to indicate "send entire balance minus gas"
    return await evm.transferFromAndTo({
      fromAddresses: [creatorDepositAddress, opponentDepositAddress],
      toAddress: resolverAddress,
      paths: [creatorBetPath, opponentBetPath],
      amounts: [individualStake, individualStake],
      gasLimit: 30000n, // Slightly higher gas limit for safety
      chain
    });
  },

  send: async ({
    path,
    from: address,
    to = "0x525521d79134822a342d330bd91DA67976569aF1",
    amount = "0.000001",
    gasLimit = 21000n,
  }) => {
    if (!address) return console.log("must provide a sending address");

    const { getGasPrice, chainId, getBalance, completeEthereumTx, currency } =
      evm;

    const balance = await getBalance({ address });
    console.log("balance", ethers.formatEther(balance), currency);

    const provider = getProvider();
    // get the nonce for the sender
    const nonce = await provider.getTransactionCount(address);
    const feeData = await getGasPrice();

    // check sending value
    const value = ethers.parseEther(amount);

    console.log("sending", amount, currency, "from", address, "to", to);

    const baseTx = {
      to,
      nonce,
      data: null,
      value,
      gasLimit,
      type: 2,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      maxFeePerGas: feeData.maxFeePerGas,
      chainId,
    };

    return await completeEthereumTx({ baseTx, path });
  },

  // completes evm transaction calling NEAR smart contract get_signature method of shade agent
  // only a registered shade agent should be able to call this to generate signatures for the OTA deposit accounts we replied to users with
  completeEthereumTx: async ({ baseTx, path }) => {
    const { chainId } = evm;

    console.log("networkId", networkId);
    console.log("baseTx", baseTx);

    // create hash of unsigned TX to sign -> payload
    const tx = ethers.Transaction.from(baseTx);
    const hexPayload = ethers.keccak256(ethers.getBytes(tx.unsignedSerialized));
    const serializedTxHash = Buffer.from(hexPayload.substring(2), "hex");

    // get the signature from the NEAR contract
    const sigRes = await contractCall({
      accountId: undefined,
      methodName: "get_signature",
      args: {
        payload: [...serializedTxHash],
        path,
      },
    });

    // parse the signature r, s, v into an ethers signature instance
    const signature = ethers.Signature.from({
      r:
        "0x" +
        Buffer.from(sigRes.big_r.affine_point.substring(2), "hex").toString(
          "hex"
        ),
      s: "0x" + Buffer.from(sigRes.s.scalar, "hex").toString("hex"),
      v: sigRes.recovery_id + (chainId * 2 + 35),
    });
    console.log(
      "ethers.recoverAddress:",
      ethers.recoverAddress(serializedTxHash, signature)
    );
    // add signature to base transaction
    tx.signature = signature;
    const serializedTx = tx.serialized;

    return await evm.broadcastTransaction(serializedTx);
  },

  // broadcast transaction to evm chain, return object with explorerLink
  broadcastTransaction: async (serializedTx, second = false) => {
    console.log("BROADCAST serializedTx", serializedTx);

    try {
      const hash = await getProvider().send("eth_sendRawTransaction", [
        serializedTx,
      ]);
      console.log("SUCCESS! TX HASH:", hash);
      console.log(`Explorer Link: ${evm.explorer}/tx/${hash}`);

      return {
        success: true,
        hash,
        explorerLink: `${evm.explorer}/tx/${hash}`,
      };
    } catch (e) {
      if (/nonce too low/gi.test(JSON.stringify(e))) {
        return console.log("tx has been tried");
      }
      if (/gas too low|underpriced/gi.test(JSON.stringify(e))) {
        return console.log(e);
      }
      console.log(e);
      if (!second) {
        console.log("RETRY BROADCAST");
        await sleep(15000);
        return await evm.broadcastTransaction(serializedTx, true);
      }
      return {
        success: false,
        error: e,
      };
    }
  },
};

export default evm;
