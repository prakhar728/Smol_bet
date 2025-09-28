export interface GenerateAddressParams {
  accountId: string;          // Contract/account id that "owns" the path
  path: string;               // Deterministic path for this bet, e.g. `${username}-${tweetId}`
  chain: string;
}

export interface GenerateAddressResult {
  address: `0x${string}`;     // EVM address
  // you can extend with: derivationPath?: string; chain?: SupportedChain; etc.
}

export interface GetBalanceParams {
  address: `0x${string}`;
  chain: string;
}

export interface TransferDepositsToResolverParams {
  creatorDepositAddress: string;
  opponentDepositAddress: string,
  resolverAddress: string,
  creatorBetPath: string,
  opponentBetPath: string,
  individualStake: bigint
}