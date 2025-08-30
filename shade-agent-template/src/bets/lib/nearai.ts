import {
  createThread,
  runAgent,
  fetchThreadState,
  runAgentAndWait,
} from "../../lib/nearai/index";
import type { NearBearer, ThreadMessage } from "../../lib/nearai/types";
import { NEAR_SIGNED_AUTH } from "../config";

const AUTH = NEAR_SIGNED_AUTH.trim() as NearBearer;

function pickAssistantText(messages: ThreadMessage[] | undefined): string | undefined {
  if (!messages?.length) return undefined;
  // Newest-first is what your fetchThreadState returns; confirm and fall back if needed.
  const assistantMsg =
    messages.find((m) => m.role === "assistant" && m.content?.[0]?.text?.value) ??
    messages[0];

  return assistantMsg?.content?.[0]?.text?.value || undefined;
}

async function getAssistantReplyText(
  auth: NearBearer,
  agentId: string,
  userMessage: string,
  opts?: { timeoutMs?: number; pollEveryMs?: number; metadata?: Record<string, unknown> }
): Promise<string | undefined> {
  // 1) Create a thread (optionally seed with a hello + metadata like the demo)
  const thread = await createThread(auth, "Hello NearAI 👋", {
    origin: "smol-bet",
    ...(opts?.metadata ?? {}),
  });

  if (!thread?.id) {
    console.log("Couldn't create a new thread");
    return;
  }

  const threadId = thread.id;

  // 2) Kick off the run and poll until an assistant reply (best effort)
  const { reply } = await runAgentAndWait({
    auth,
    agentId,
    threadId,
    message: userMessage,
    timeoutMs: opts?.timeoutMs ?? 25_000,
    pollEveryMs: opts?.pollEveryMs ?? 1_000,
  });

  if (reply?.role === "assistant") {
    return reply.content?.[0]?.text?.value;
  }

  // 3) Fallback: fetch latest thread state and grab the newest assistant message
  const state = await fetchThreadState(auth, threadId, 50);
  return pickAssistantText(state?.data);
}

export const parsePostToBet = async (message: string): Promise<string | undefined> => {
  if (!AUTH) {
    console.log("Couldn't find AUTH for Near-AI");
    return;
  }

  const agentId = "ai-creator.near/bet-parser/latest";
  try {
    return await getAssistantReplyText(AUTH, agentId, message, {
      metadata: { task: "parsePostToBet", traceId: crypto.randomUUID?.() ?? Date.now().toString() },
    });
  } catch (e) {
    console.error("parsePostToBet failed:", e);
    return;
  }
};

export const resolveBetWithAI = async (message: string): Promise<string | undefined> => {
  if (!AUTH) {
    console.log("Couldn't find AUTH for Near-AI");
    return;
  }

  const agentId = "ai-creator.near/Bet_Resolver/latest";
  try {
    return await getAssistantReplyText(AUTH, agentId, message, {
      metadata: { task: "resolveBetWithAI", traceId: crypto.randomUUID?.() ?? Date.now().toString() },
    });
  } catch (e) {
    console.error("resolveBetWithAI failed:", e);
    return;
  }
};
