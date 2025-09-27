import { fetchJson } from "../../utils/utils";
import { ETHERSCAN_API } from "../config";

import * as dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

export async function getTransactionsForAddress(
  address: string,
  chainId: number,  
  action: "txlist" | "tokentx" = "txlist"
) {
  try {

    if (chainId == 1313161555) {
      const base = "https://explorer.testnet.aurora.dev/api/v2";
      if (!base) throw new Error(`Unsupported chainId: ${chainId}`);

      const url = `${base}/addresses/${address}/transactions`;

      const res = await fetchJson(url);
      
      const tx = res?.items?.[0];

      if (!tx || !tx.from?.hash) return undefined;
      return {
        from: tx.from.hash,
      };
    } else {
      const url = `https://api.etherscan.io/v2/api?chainid=${chainId}` +
        `&module=account&action=${action}&address=${address}` +
        `&startblock=0&endblock=latest&page=1&offset=10&sort=asc&apikey=${ETHERSCAN_API}`;

      const res = await fetchJson(url);

      const tx = res?.result?.[0];

      if (!tx || tx?.isError === "1" || !tx?.from) return undefined;
      return tx;
    }

  } catch (e) {
    console.log("Error fetching transactions:", e);
    return undefined;
  }
}
