import { fetchJson } from "../../utils/utils";
import { ETHERSCAN_API } from "../config";

export async function getTransactionsForAddress(
  address: string,
  chainId: number,
  action: "txlist" | "tokentx" = "txlist"
) {
  try {
    const url = `https://api.etherscan.io/v2/api?chainid=${chainId}` +
      `&module=account&action=${action}&address=${address}` +
      `&startblock=0&endblock=latest&page=1&offset=10&sort=asc&apikey=${ETHERSCAN_API}`;

    const res = await fetchJson(url);
    console.log(res);
    
    const tx = res?.result?.[0];

    if (!tx || tx?.isError === "1" || !tx?.from) return undefined;
    return tx;
  } catch (e) {
    console.log("Error fetching transactions:", e);
    return undefined;
  }
}
