// scripts/bets-run.ts
import "dotenv/config";
import { callFunction, viewFunction } from "../lib/near/functions";
import { Bet } from "../lib/near/types";

const CONTRACT_ID = process.env.CONTRACT_ID!;
if (!CONTRACT_ID) throw new Error("Set CONTRACT_ID in .env");

// quick helper to make a unique id for demo runs
const suffix = Date.now().toString();
const demoBet = {
  initiator: "alice",
  opponent: "bob",
  chain: "near",
  terms: "friendly wager",
  currency: "NEAR",
  amount: "1",
  parentid: "root",
  currentid: `bet-${suffix}`,
  remarks: "created by bets-run.ts",
};

async function runAll() {
  console.log("1) add_bet ->", demoBet.currentid);
  await callFunction({
    contractId: CONTRACT_ID,
    methodName: "add_bet",
    args: demoBet,
    gasTGas: 50,        // simple write
    waitUntil: "FINAL",
  });
  console.log("   ✓ bet added");

  console.log("\n2) total_bets");
  const total = await viewFunction<number>({
    contractId: CONTRACT_ID,
    methodName: "total_bets",
  });
  console.log("   total:", total);

  const lastIndex = Math.max(0, total - 1);
  console.log(`\n3) get_bet(index=${lastIndex})`);
  const lastBet = await viewFunction<Bet | null>({
    contractId: CONTRACT_ID,
    methodName: "get_bet",
    args: { index: lastIndex },
  });
  console.log("   bet:", JSON.stringify(lastBet, null, 2));

  const from = Math.max(0, total - 5);
  const limit = 5;
  console.log(`\n4) get_bets(from=${from}, limit=${limit})`);
  // U64 in JSON must be strings
  const page = await viewFunction<Bet[]>({
    contractId: CONTRACT_ID,
    methodName: "get_bets",
    args: { from_index: String(from), limit: String(limit) },
  });
  console.log("   page:", JSON.stringify(page, null, 2));

  console.log("\n✅ Done.");
}

runAll().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
