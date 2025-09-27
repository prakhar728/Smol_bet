import { contracts, chainAdapters } from "chainsig.js";
import { createPublicClient, http, PublicClient } from "viem";
import { baseSepolia } from "viem/chains";

export const baseSepoliaRpcUrl = "https://base-sepolia-rpc.publicnode.com";

// Set up a chain signature contract instance
const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: `testnet`,
  contractId: `v1.signer-prod.testnet`,
});

// Set up a public client for the Base Sepolia network
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(baseSepoliaRpcUrl),
});

// Set up a chain signatures chain adapter for the Base Sepolia network
export const BaseSepolia = new chainAdapters.evm.EVM({
  publicClient: publicClient as PublicClient,
  contract: MPC_CONTRACT,
}) as any;
