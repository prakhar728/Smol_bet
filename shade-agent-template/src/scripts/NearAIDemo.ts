// ./usage.ts
import {
  createThread,
  runAgentAndWait,
} from "../lib/nearai"; // adjust path
import { NearBearer } from "../lib/nearai/types";
import * as dotenv from "dotenv";


dotenv.config({ path: ".env.development.local" });

/**
 * Make sure you have:
 *   export NEAR_SIGNED_AUTH="nearai_live_..."  (or put in .env and load with dotenv)
 *   export NEAR_AI_BASE_URL="https://api.near.ai" (optional; defaults to this)
 */
async function demo1() {
  const auth = (process.env.NEAR_SIGNED_AUTH || "").trim() as NearBearer;
  if (!auth) {
    throw new Error("Set NEAR_SIGNED_AUTH env var to your NEAR AI Hub bearer token.");
  }

  const agentId = process.env.NEAR_AI_AGENT_ID || "ai-creator.near/bet-parser/latest"; // <- set me
  const userQuestion = "@funnyorfud I bet @_fiatisabubble .000001 ETH the Warriors will win game 2 of the Western Conference semi-finals on Thursday May 8th";

  // 1) Create a thread with an initial message (optional metadata)
  const thread = await createThread(auth, "Hello NearAI 👋", {
    origin: "demo-script", 
    traceId: crypto.randomUUID?.() ?? String(Date.now()),
  });

  console.log("Created thread:", thread.id);

  // 2) Run the agent on the thread with a new message, and wait for the first assistant reply
  const { reply, run } = await runAgentAndWait({
    auth,
    agentId,
    threadId: thread.id,
    message: userQuestion,
    timeoutMs: 25_000,   // you can bump this if your tools take longer
    pollEveryMs: 1_000,  // polling cadence
  });

  console.log("Run status:", run?.status ?? "unknown");
  if (reply) {
    console.log("\nAssistant replied:");
    console.log(`- role: ${reply.role}`);
    console.log(`- content:\n${reply.content[0]?.text?.value}`);
  } else {
    // No assistant msg in time; you can still fetch the thread to inspect messages
    console.warn("No assistant reply yet. Checking thread state…");
  }

  demo2();
}

/**
 * Make sure you have:
 *   export NEAR_SIGNED_AUTH="nearai_live_..."  (or put in .env and load with dotenv)
 *   export NEAR_AI_BASE_URL="https://api.near.ai" (optional; defaults to this)
 */
async function demo2() {
  const auth = (process.env.NEAR_SIGNED_AUTH || "").trim() as NearBearer;
  if (!auth) {
    throw new Error("Set NEAR_SIGNED_AUTH env var to your NEAR AI Hub bearer token.");
  }

  const agentId = process.env.NEAR_AI_AGENT_ID || "ai-creator.near/Bet_Resolver/latest"; // <- set me
  const userQuestion = " the Warriors will win game 2 of the Western Conference semi-finals on Thursday May 8th, 2025";

  // 1) Create a thread with an initial message (optional metadata)
  const thread = await createThread(auth, "Hello NearAI 👋", {
    origin: "demo-script", 
    traceId: crypto.randomUUID?.() ?? String(Date.now()),
  });

  console.log("Created thread:", thread.id);

  // 2) Run the agent on the thread with a new message, and wait for the first assistant reply
  const { reply, run } = await runAgentAndWait({
    auth,
    agentId,
    threadId: thread.id,
    message: userQuestion,
    timeoutMs: 25_000,   // you can bump this if your tools take longer
    pollEveryMs: 1_000,  // polling cadence
  });

  console.log("Run status:", run?.status ?? "unknown");
  if (reply) {
    console.log("\nAssistant replied:");
    console.log(`- role: ${reply.role}`);
    console.log(`- content:\n${reply.content[0]?.text?.value}`);
  } else {
    // No assistant msg in time; you can still fetch the thread to inspect messages
    console.warn("No assistant reply yet. Checking thread state…");
  }
}

demo1().catch((e) => {
  console.error("Demo failed:", e);
  process.exitCode = 1;
});
