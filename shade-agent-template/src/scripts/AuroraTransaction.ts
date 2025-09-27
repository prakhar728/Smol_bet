import { getTransactionsForAddress } from "../bets/services/explorer";
import * as dotenv from "dotenv";


dotenv.config({ path: ".env.development.local" });

// Aurora explorers (Blockscout instances)
const AURORA_API: Record<number, string> = {
    1313161554: "https://explorer.mainnet.aurora.dev/api/v2", // mainnet
    1313161555: "https://explorer.testnet.aurora.dev/api/v2", // testnet
};

export async function fetchJson(url: string) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

export async function getAuroraTransactionsForAddress(
    address: string,
    chainId: number,
) {
    try {
        const base = AURORA_API[chainId];
        if (!base) throw new Error(`Unsupported chainId: ${chainId}`);

        const url = `${base}/addresses/${address}/transactions`;

        const res = await fetchJson(url);
        const tx = res?.items?.[0];

        if (!tx || !tx.from?.hash) return undefined;
        return tx;
    } catch (e) {
        console.log("Error fetching Aurora transactions:", e);
        return undefined;
    }
}



async function main() {
    const address = "0x325E5Bd3d7d12cA076D0A8f9f5Be7d1De1dd4c83"; // sample testnet address
    const chainId = 1313161555; // Aurora testnet

    console.log("🔹 Fetching Aurora transactions...");
    let tx = await getTransactionsForAddress(address, chainId);
    console.log("First transaction:", tx);

    console.log("🔹 Fetching Base transactions...");
    tx = await getTransactionsForAddress(address, 84532);
    console.log("First transaction:", tx);

}

main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
