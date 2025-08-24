import { NearBearer, Thread, RunResponse, ThreadMessage } from "./types";

const BASE_URL = process.env.NEAR_AI_BASE_URL ?? "https://api.near.ai";

type Json = Record<string, any>;

const headers = (auth: NearBearer) => ({
  Accept: "application/json",
  Authorization: `Bearer ${auth}`,
  "Content-Type": "application/json",
});

async function http<T = Json>(
  path: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const { timeoutMs = 30_000, ...rest } = init;
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...rest, signal: ctrl.signal });
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`NEAR AI ${res.status} ${res.statusText} :: ${text}`);
    }
    return text ? (JSON.parse(text) as T) : ({} as T);
  } finally {
    clearTimeout(tid);
  }
}

/** Create a new thread with an optional initial message. */
export async function createThread(
  auth: NearBearer,
  initialMessage?: string,
  metadata: Record<string, any> = {}
): Promise<Thread> {
  const body = {
    messages: initialMessage
      ? [{ content: initialMessage, role: "user", metadata }]
      : [],
  };
  return http<Thread>("/v1/threads", {
    method: "POST",
    headers: headers(auth),
    body: JSON.stringify(body),
  });
}

/** Run an agent on a thread with a new message. */
export async function runAgent(
  auth: NearBearer,
  agentId: string,
  threadId: string,
  message: string,
  opts?: {
    max_iterations?: number;
    record_run?: boolean;
    tool_resources?: Record<string, any>;
    user_env_vars?: Record<string, string>;
  }
): Promise<RunResponse> {
  const body = {
    agent_id: agentId,
    thread_id: threadId,
    new_message: message,
    max_iterations: opts?.max_iterations ?? 1,
    record_run: opts?.record_run ?? true,
    tool_resources: opts?.tool_resources ?? {},
    user_env_vars: opts?.user_env_vars ?? {},
  };
  return http<RunResponse>("/v1/agent/runs", {
    method: "POST",
    headers: headers(auth),
    body: JSON.stringify(body),
  });
}

/** Fetch latest messages in a thread (newest first). */
export async function fetchThreadState(
  auth: NearBearer,
  threadId: string,
  limit = 50
): Promise<{ data: ThreadMessage[] }> {
  const qs = new URLSearchParams({ order: "desc", limit: String(limit) });
  return http<{ data: ThreadMessage[] }>(
    `/v1/threads/${threadId}/messages?${qs.toString()}`,
    { method: "GET", headers: headers(auth) }
  );
}

/** Helper: run agent then poll until an assistant reply appears (or timeout). */
export async function runAgentAndWait(opts: {
  auth: NearBearer;
  agentId: string;
  threadId: string;
  message: string;
  timeoutMs?: number;
  pollEveryMs?: number;
}): Promise<{ reply?: ThreadMessage; run: RunResponse }> {
  const { auth, agentId, threadId, message, timeoutMs = 25_000, pollEveryMs = 1_000 } =
    opts;

  const run = await runAgent(auth, agentId, threadId, message);

  console.log(run);
  
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    const { data } = await fetchThreadState(auth, threadId, 20);

    const reply = data.find((m) => m.metadata?.message_type !== "system:output_file");
    
    if (reply) return { reply, run };
    await new Promise((r) => setTimeout(r, pollEveryMs));
  }
  return { reply: undefined, run };
}
