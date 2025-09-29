import { evm } from "../../utils/evm";
import { networkId } from "@neardefi/shade-agent-js";

export async function createBetInContract(bet: {
  description: string;
  creatorAddress: string;
  opponentAddress: string;
  resolverAddress: string;
  stake: bigint;
  betPath: string;
  chain: string;
}) {
  try {
    const createResult = await evm.createBetTx({
      description: bet.description,
      creator: bet.creatorAddress,
      opponent: bet.opponentAddress,
      resolver: bet.resolverAddress,
      stake: bet.stake * 2n,
      path: bet.betPath,
      chain: bet.chain
    });
    
    if (!createResult.success)
      return { success: false as const, error: createResult.error };

    await new Promise((r) => setTimeout(r, 5000));
    const betId = (await evm.getBetCount(bet.chain)) - 1;

    const explorerBase =
      networkId === "testnet"
        ? "https://sepolia.basescan.org/tx/"
        : "https://basescan.org/tx/";
    return { success: true as const, betId, explorerLink: explorerBase + createResult.hash };
  } catch (e: any) {
    return { success: false as const, error: e?.message ?? "create_error" };
  }
}

export async function resolveBetInContract(betId: number, winner: string, resolverAddress: string, betPath: string) {
  try {
    const result = await evm.resolveBetTx({ betId, winner, resolverAddress, path: betPath });
    if (!result.success) return { success: false as const, error: result.error };
    await new Promise((r) => setTimeout(r, 3000));
    const explorerBase =
      networkId === "testnet"
        ? "https://sepolia.basescan.org/tx/"
        : "https://basescan.org/tx/";
    return { success: true as const, explorerLink: explorerBase + result.hash };
  } catch (e: any) {
    return { success: false as const, error: e?.message ?? "resolve_error" };
  }
}
