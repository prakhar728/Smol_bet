import { createThread, fetchThreadState, runAgent } from "./near-ai-api.js";

const AUTH = process.env.NEAR_SIGNED_AUTH;

export const parsePostToBet = async (message) => {
  if (!AUTH) {
    console.log("Couldn't find AUTH for Near-AI");
    return;
  }

  const newThread = await createThread(AUTH);
  const agentId = "ai-creator.near/bet-parser/latest";

  if (!newThread || !newThread.id) {
    console.log("Couldn't create a new thread");
    return;
  }

  const threadId = newThread.id;

  await runAgent(AUTH, agentId, threadId, message);

  const threadState = await fetchThreadState(AUTH, threadId);

  return threadState.data[0].content[0].text.value;
};
