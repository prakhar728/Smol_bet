/* eslint-disable no-console */
import { AuroraTestnet, BaseSepolia } from "../chain-adapters";
import { GenerateAddressParams, GenerateAddressResult } from "./types";

export const networkId: "testnet" | "mainnet" =
  (process.env.NEXT_PUBLIC_networkId === "mainnet" ? "mainnet" : "testnet");

export const supportChains = [
  "AT",  // Aurora Testnet
  "BS" // Base Sepolia
];

export async function generateAddress(
  params: GenerateAddressParams
): Promise<GenerateAddressResult> {
  const { accountId, path, chain } = params;

  if (!supportChains.includes(chain)) {
    throw new Error(`Unsupported chain "${chain}". Supported chains are: ${supportChains.toString()}`);
  }

  let data = {
    address: ""
  };

  if (chain == "AT") {
    const { address } = await AuroraTestnet.deriveAddressAndPublicKey(
      accountId,
      path
    );

    data = {
      address
    };
  } else if(chain == "BS"){
    const { address } = await BaseSepolia.deriveAddressAndPublicKey(
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
