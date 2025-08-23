import { POLLING_INTERVAL, BOT_ID, SEARCH_ONLY } from "../config";
import { searchTweetsWithMasa } from "../../utils/social/masa";
import { crosspostReply } from "../../utils/social/crosspost";
import { sleep } from "../../utils/utils";
import {
  pendingReply, pendingSettlement, acknowledgedPosts,
  lastSearchTimestamp, lastSettleBetSeachTimestamp,
  setLastSearchTimestamp, setLastSettleTimestamp,
} from "../state";

export async function searchTwitter(): Promise<void> {
  // --- New bet discovery ---
  const betTweets = await searchTweetsWithMasa(`@funnyorfud "bet"`, 100).catch(() => []);
  let latest = lastSearchTimestamp;

  for (const t of betTweets ?? []) {
    const post = {
      id: t.ExternalID,
      text: t.Content,
      author_username: t.Metadata.username ?? "unknown_user",
      conversation_id: t.Metadata.conversation_id,
      created_at: t.Metadata.created_at,
      replyAttempt: 0,
    };
    const ts = post.created_at ? Date.parse(post.created_at)/1000 : Math.floor(Date.now()/1000);
    if (ts <= lastSearchTimestamp) continue;
    if (acknowledgedPosts.has(post.id) || t.Metadata.user_id == BOT_ID) continue;

    acknowledgedPosts.add(post.id);
    if (!SEARCH_ONLY) pendingReply.push(post);
    if (ts > latest) latest = ts;
  }
  setLastSearchTimestamp(latest);

  // --- Settlement discovery ---
  await sleep(60_000); // keep your original gap
  const settleTweets = await searchTweetsWithMasa(`@funnyorfud "settle"`, 100).catch(() => []);
  for (const t of settleTweets ?? []) {
    const post = {
      id: t.ExternalID,
      text: t.Content,
      author_username: t.Metadata.username ?? "unknown_user",
      conversation_id: t.Metadata.conversation_id,
      created_at: t.Metadata.created_at,
    };
    const ts = post.created_at ? Date.parse(post.created_at)/1000 : Math.floor(Date.now()/1000);
    if (ts <= lastSettleBetSeachTimestamp) continue;
    if (acknowledgedPosts.has(post.id) || t.Metadata.user_id == BOT_ID) continue;

    acknowledgedPosts.add(post.id);

    // attach to most recent active bet for this user
    const idx = pendingSettlement.findIndex(
      b => b.creatorUsername === post.author_username || b.opponentUsername === post.author_username
    );
    if (idx >= 0) {
      const bet = pendingSettlement[idx];
      bet.settlementTweet = post as any;
      bet.settlementAttempt = 0;
      // move to front so settlements loop picks it next
      pendingSettlement.splice(idx, 1);
      pendingSettlement.unshift(bet);
    } else if (!SEARCH_ONLY) {
      await crosspostReply(
        `Sorry @${post.author_username}, I couldn’t find an active bet to settle.`,
        post as any,
        false
      );
    }
    if (ts > lastSettleBetSeachTimestamp) setLastSettleTimestamp(ts);
  }

  setTimeout(searchTwitter, POLLING_INTERVAL);
}

export function startSearchLoop() { searchTwitter(); }
