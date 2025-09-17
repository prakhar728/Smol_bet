import { POLLING_INTERVAL, BOT_ID, SEARCH_ONLY, BOT_NAME } from "../config";
import { sleep } from "../../utils/utils";
import {
  pendingReply, pendingSettlement, acknowledgedPosts,
  lastSearchTimestamp, lastSettleBetSeachTimestamp,
  setLastSearchTimestamp, setLastSettleTimestamp,
} from "../state";
import { searchRecent } from "../../lib/X/endpoints/xSearchRecent";
import { xPost } from "../../lib/X/endpoints/xPost";
import { log } from "../lib/log";

export async function searchTwitter(): Promise<void> {

  log.info("Starting searching X posts", SEARCH_ONLY);


  // --- New bet discovery ---
  const startTime = new Date(lastSearchTimestamp * 1000).toISOString();
  const betPosts = await searchRecent(`@${BOT_NAME} "bet"`, undefined, startTime);
  let latest = lastSearchTimestamp;

  log.info(`Found ${betPosts.length} posts for creating bet`);

  for (const p of betPosts ?? []) {
    if (p.author_username == BOT_NAME)
      continue;

    const post = {
      id: p.id,
      text: p.text,
      author_username: p.author_username ?? "unknown_user",
      author_id: p.author_id,
      conversation_id: p.conversation_id,
      created_at: p.created_at,
      replyAttempt: 0,
    };

    const ts = post.created_at ? Date.parse(post.created_at) / 1000 : Math.floor(Date.now() / 1000);

    if (ts <= lastSearchTimestamp)
      continue;

    if (acknowledgedPosts.has(post.id) || p.author_id == BOT_ID)
      continue;

    acknowledgedPosts.add(post.id);

    if (!SEARCH_ONLY)
      pendingReply.push(post);

    if (ts > latest)
      latest = ts;
  }
  setLastSearchTimestamp(latest);

  // --- Settlement discovery ---
  await sleep(60_000); // keep your original gap

  const settlePosts = await searchRecent(`@${BOT_NAME} "settle"`, undefined, startTime);

  for (const p of settlePosts ?? []) {

    const post = {
      id: p.id,
      text: p.text,
      author_username: p.author_name ?? "unknown_user",
      author_id: p.author_id,
      conversation_id: p.conversation_id,
      created_at: p.created_at,
    };

    console.log(post);

    const ts = post.created_at ? Date.parse(post.created_at) / 1000 : Math.floor(Date.now() / 1000);

    if (ts <= lastSettleBetSeachTimestamp)
      continue;

    if (acknowledgedPosts.has(post.id) || p.author_id == BOT_ID)
      continue;

    acknowledgedPosts.add(post.id);

    // attach to most recent active bet for this user
    const idx = pendingSettlement.findIndex(
      b => b.creatorUsername === post.author_username || b.opponentUsername === post.author_username
    );

    console.log("The post that needs to be settled is", pendingSettlement.findIndex(
      b => b.conversationId === post.conversation_id
    ));
    

    console.log("Idx is", idx);
    

    if (idx >= 0) {
      const bet = pendingSettlement[idx];

      bet.settlementTweet = post as any;

      bet.settlementAttempt = 0;

      // move to front so settlements loop picks it next
      pendingSettlement.splice(idx, 1);
      pendingSettlement.unshift(bet);

    } else if (!SEARCH_ONLY) {
      await xPost(
        `Sorry @${post.author_username}, I couldn’t find an active bet to settle.`,
        post.id,
      );
    }
    if (ts > lastSettleBetSeachTimestamp) setLastSettleTimestamp(ts);
  }

  setTimeout(searchTwitter, POLLING_INTERVAL);
}

export function startSearchLoop() { searchTwitter(); }
