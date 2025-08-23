import * as dotenv from "dotenv";
import { XClients } from '../lib/X/client';
import { Post } from '../lib/X/types';

dotenv.config({path: ".env.development.local"});

async function main() {
  // --- 1) Post a simple message ---
  const writer = XClients.writeClient();
  const postText = "Hello X 👋 #SmolBet";
  const postRes = await writer.v2.tweet(postText);

  console.log("Posted:", postRes.data);

  // --- 2) Search recent posts by query ---
  const reader = XClients.readClient();
  const query = "@smol_bet";
  const searchRes = await reader.v2.search(query, {
    max_results: 10,
    "tweet.fields": ["author_id", "conversation_id", "created_at", "referenced_tweets"],
  });

  const posts: Post[] = searchRes.tweets.map((t) => ({
    id: t.id,
    text: t.text,
    author_id: t.author_id!,
    created_at: t.created_at,
    conversation_id: t.conversation_id,
    referenced_posts: t.referenced_tweets as any, // normalizing
  }));

  console.log("Recent posts:", posts);
}

main().catch(console.error);
