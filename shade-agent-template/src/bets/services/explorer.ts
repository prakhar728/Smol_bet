import { networkId } from "@neardefi/shade-agent-js";
import { BASESCAN_API } from "../config";
import { fetchJson } from "../../utils/utils";

export async function getTransactionsForAddress(
  address: string,
  action: "txlist" | "tokentx" = "txlist"
) {
  try {
    const url = `${BASESCAN_API(networkId)}?module=account&action=${action}&address=${address}` +
      `&startblock=0&endblock=latest&page=1&offset=10&sort=asc&apikey=${process.env.BASE_API_KEY}`;
    const res = await fetchJson(url);
    const tx = res?.result?.[0];
    if (!tx || tx?.isError === "1" || !tx?.from) return undefined;
    return tx;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}
