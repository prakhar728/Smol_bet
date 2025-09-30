// ResolveAllBets.ts
import { resolveBetWithAI } from "../bets/lib/nearai";
import { callFunction, viewFunction } from "../lib/near/functions";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.development.local" });

// Matches your Rust struct
type Bet = {
  bet_id: number; // u64 but small; OK as number here
  terms: string;
  resolution: string; // "" or one of "TRUE" | "FALSE" | "INVALID"
};

// ── config ────────────────────────────────────────────────────────────────────
const CONTRACT_ID = "test-campaign.near";
if (!CONTRACT_ID) throw new Error("Set CONTRACT_ID");

// Swap this with your real oracle/agent decision.
async function decideResolution(bet: Bet) {
  // Demo placeholder logic
  const resolution = await resolveBetWithAI(bet.terms);
  
  if (resolution.includes("TRUE")) return "TRUE";
  if (resolution.includes("FALSE")) return "FALSE";
  return "INVALID";
}

async function runAll() {
  console.log("Smol Bet — Resolve All Bets (sequential)\n");

  // 1) total_bets() -> u32
  console.log("1) total_bets");
  const total = await viewFunction<number>({
    contractId: CONTRACT_ID,
    methodName: "total_bets",
  });
  console.log("   total:", total);

  if (!total || total <= 0) {
    console.log("\nNo bets to process. ✅");
    return;
  }

  // 2) Iterate 0..total-1 and resolve each one
  for (let index = 0; index < total; index++) {
    console.log(`\n[${index + 1}/${total}] get_bet(index=${index})`);
    const bet = await viewFunction<Bet | null>({
      contractId: CONTRACT_ID,
      methodName: "get_bet",
      args: { index },
    });

    console.log(bet);

    if (!bet) {
      console.log("   • no bet at this index — skipping");
      continue;
    }

    // Already resolved? skip
    if (bet.resolution && bet.resolution.length > 0) {
      console.log(`   • already resolved: ${bet.resolution} — skipping`);
      continue;
    }

    console.log("   • terms:", bet.terms);

    // 3) request_resolve(index: u32)
    console.log(`   • request_resolve(index=${index})`);
    await callFunction({
      contractId: CONTRACT_ID,
      methodName: "request_resolve",
      args: { index },
      gasTGas: 15,
      waitUntil: "FINAL",
    });
    console.log("     ✓ resolve event emitted (check logs/indexer)");

    
    // 4) decide outcome (replace with your oracle/agent)
    const resolution = await decideResolution(bet);
    console.log("   • decided resolution:", resolution);

    // 5) update_bet(index: u32, resolution: String)
    console.log(`   • update_bet(index=${index}, resolution="${resolution}")`);
    await callFunction({
      contractId: CONTRACT_ID,
      methodName: "update_bet",
      args: { index, resolution },
      gasTGas: 30,
      waitUntil: "FINAL",
    });
    console.log("     ✓ bet updated on-chain");

    // 6) verify
    const after = await viewFunction<Bet | null>({
      contractId: CONTRACT_ID,
      methodName: "get_bet",
      args: { index },
    });
    console.log("   • verify:", after);
  }

  console.log("\n✅ Done. All bets processed.");
}

runAll().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
