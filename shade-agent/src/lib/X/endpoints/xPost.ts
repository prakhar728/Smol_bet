import { XClients } from '../client';
import { Post } from '../types';

export async function xPost(text: string, replyToId?: string): Promise<Post> {
  const x = XClients.writeClient();
  const res = await x.v2.tweet(text, replyToId ? { reply: { in_reply_to_tweet_id: replyToId } } : {});
  return { id: res.data.id, text: res.data.text };
}
