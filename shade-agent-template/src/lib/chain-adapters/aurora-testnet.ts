import { contracts, chainAdapters } from "chainsig.js";
import { createPublicClient, http, PublicClient } from "viem";
import { auroraTestnet } from "viem/chains";

export const auroraTestNetRpcUrl = "https://base-sepolia-rpc.publicnode.com";

// Set up a chain signature contract instance
const MPC_CONTRACT = new contracts.ChainSignatureContract({
  networkId: `testnet`,
  contractId: `v1.signer-prod.testnet`,
});

// Set up a public client for the Aurora Testnet network
export const publicClient = createPublicClient({
  chain: auroraTestnet,
  transport: http(auroraTestNetRpcUrl),
});

// Set up a chain signatures chain adapter for the Aurora Testnet network
export const AuroraTestnet = new chainAdapters.evm.EVM({
  publicClient: publicClient as PublicClient,
  contract: MPC_CONTRACT,
}) as any;
