/* eslint-disable no-console */
import { Evm } from "../chain-adapters/ethereum";
import { GenerateAddressParams, GenerateAddressResult } from "./types";

/**
 * Network id exported for callers
 * - Respects NEXT_PUBLIC_networkId with fallback to "testnet"
 */
export const networkId: "testnet" | "mainnet" =
  (process.env.NEXT_PUBLIC_networkId === "mainnet" ? "mainnet" : "testnet");

/**
 * Core address generation.
 *
 * If SHADE_AGENT_API_URL is set, we POST to:
 *    POST {SHADE_AGENT_API_URL}/addresses/generate
 *    body: { publicKey, accountId, path, chain, networkId }
 *    response: { address: "0x..." }
 *
 * Otherwise we fallback to a deterministic dev-only pseudo address so your
 * app can keep moving during local development.
 */
export async function generateAddress(
  params: GenerateAddressParams
): Promise<GenerateAddressResult> {
  const { accountId, path, chain } = params;

  if (chain !== "evm") {
    throw new Error(`Unsupported chain "${chain}". Supported: "evm"`);
  }
  let data = {
    address: ""
  };

  if (chain == "evm") {
    const { address } = await Evm.deriveAddressAndPublicKey(
      accountId,
      path
    );

    data = {
      address
    };
  }

  // normalize to lowercase to avoid mixed-case surprises; callers can checksum as needed
  return { address: data.address as `0x${string}` };
};


export default {
  generateAddress,
  networkId,
};
