import { XClients } from '../client';
import { Post } from '../types';

export async function searchRecent(query: string, sinceId?: string, startTime?: string): Promise<Post[]> {
  const x = XClients.readClient();

  const res = await x.v2.search(query, {
    max_results: 25,
    since_id: sinceId,
    start_time: startTime,
    'tweet.fields': ['author_id', 'conversation_id', 'created_at', 'referenced_tweets'],
    expansions: ["author_id"],
    "user.fields": ["id", "name", "username"],
  });

  // Build author map from includes
  const usersById = new Map(
    (res.includes?.users ?? []).map(u => [u.id, u])
  );

  return res.tweets.map(t => {
    const u = usersById.get(t.author_id!);
    return {
      id: t.id,
      text: t.text,
      author_id: t.author_id!,
      author_username: u?.username,     // <- added
      author_name: u?.name,             // <- optional; remove if not needed
      created_at: t.created_at,
      conversation_id: t.conversation_id,
      referenced_tweets: t.referenced_tweets as any,
    } as Post;
  });
}
