
export type SupportedChain = "evm"; // Extend later if you add solana, etc.

export interface GenerateAddressParams {
  publicKey: string;          // MPC public key (string/hex/PEM—backend should know how to handle)
  accountId: string;          // Contract/account id that "owns" the path
  path: string;               // Deterministic path for this bet, e.g. `${username}-${tweetId}`
  chain: SupportedChain;      // "evm" for now
}

export interface GenerateAddressResult {
  address: `0x${string}`;     // EVM address
  // you can extend with: derivationPath?: string; chain?: SupportedChain; etc.
}
