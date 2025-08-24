import { XClients } from '../client';
import { Post } from '../types';

export async function searchRecent(query: string, sinceId?: string, startTime?: string): Promise<Post[]> {
  const x = XClients.readClient();
  const res = await x.v2.search(query, {
    max_results: 25,
    since_id: sinceId,
    start_time: startTime,
    'tweet.fields': ['author_id','conversation_id','created_at','referenced_tweets'],
  });
  return res.tweets.map(t => ({
    id: t.id, text: t.text, author_id: t.author_id!, created_at: t.created_at,
    conversation_id: t.conversation_id, referenced_tweets: t.referenced_tweets as any,
  }));
}
