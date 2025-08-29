import { callFunction, viewFunction } from "../lib/near/functions";
import * as dotenv from "dotenv";


dotenv.config({ path: ".env.development.local" });

// Matches your Rust struct
type Bet = {
  bet_id: number;     // u64 but small; OK as number here
  terms: string;
  resolution: string;
};

const CONTRACT_ID = "test-campaign.testnet";
if (!CONTRACT_ID) throw new Error("Set CONTRACT_ID in .env");

async function runAll() {
  // 1) add_bet(terms: String)
  const terms = `Test bet at ${new Date().toISOString()}`;
  console.log("1) add_bet ->", terms);
  await callFunction({
    contractId: CONTRACT_ID,
    methodName: "add_bet",
    args: { terms },
    gasTGas: 30,
    waitUntil: "FINAL",
  });
  console.log("   ✓ bet added");

  // 2) total_bets() -> u32
  console.log("\n2) total_bets");
  const total = await viewFunction<number>({
    contractId: CONTRACT_ID,
    methodName: "total_bets",
  });
  console.log("   total:", total);

  const lastIndex = Math.max(0, total - 1);

  // 3) get_bet(index: u32) -> Option<Bet>
  console.log(`\n3) get_bet(index=${lastIndex})`);
  const lastBet = await viewFunction<Bet | null>({
    contractId: CONTRACT_ID,
    methodName: "get_bet",
    args: { index: lastIndex },
  });
  console.log("   bet:", lastBet);

  // 4) get_bets(from_index: Option<U64>, limit: Option<U64>) -> Vec<Bet>
  //    U64s must be sent as strings in JSON.
  const from = Math.max(0, total - 5);
  const limit = 5;
  console.log(`\n4) get_bets(from=${from}, limit=${limit})`);
  const page = await viewFunction<Bet[]>({
    contractId: CONTRACT_ID,
    methodName: "get_bets",
    args: { from_index: String(from), limit: String(limit) },
  });
  console.log("   page:", page);

  // 5) request_resolve(index: u32)
  //    This emits a JSON log event your off-chain agent will consume.
  console.log(`\n5) request_resolve(index=${lastIndex})`);
  await callFunction({
    contractId: CONTRACT_ID,
    methodName: "request_resolve",
    args: { index: lastIndex },
    gasTGas: 15,
    waitUntil: "FINAL",
  });
  console.log(`✓ resolve event emitted (check logs/indexer)}`);

  // 6) update_bet(index: u32, resolution: String)
  console.log(`\n6) update_bet(index=${lastIndex}, resolution="TRUE")`);
  await callFunction({
    contractId: CONTRACT_ID,
    methodName: "update_bet",
    args: { index: lastIndex, resolution: "TRUE" },
    gasTGas: 30,
    waitUntil: "FINAL",
  });
  console.log("   ✓ bet updated");

  // 7) verify update
  const updated = await viewFunction<Bet | null>({
    contractId: CONTRACT_ID,
    methodName: "get_bet",
    args: { index: lastIndex },
  });
  console.log("\n7) verify:", updated);

  console.log("\n✅ Done.");
}

runAll().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
