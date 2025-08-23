export type PostID = string;
export type UserID = string;

export interface Post {
  id: PostID;
  text: string;
  author_id?: UserID;
  created_at?: string;
  conversation_id?: string;
  referenced_tweets?: { type: 'replied_to'|'quoted'|'retweeted'; id: PostID }[];
}
