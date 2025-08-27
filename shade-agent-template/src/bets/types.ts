export type PostID = string;
export type Username = string;

export interface Post {
  id: PostID;
  text: string;
  author_username: Username;
  conversation_id?: string;
  created_at?: string;
  replyAttempt?: number;
}

export interface Bet {
  id: string;
  conversationId: string;
  creatorUsername: Username;
  opponentUsername: Username;
  stake: bigint;
  description: string;
  mostRecentTweetId: string;
  authorBetPath: string;
  authorDepositAddress: string;
  opponentBetPath: string;
  opponentDepositAddress: string;
  winner?: string;
  settlementTx?: string;
  resolverAddress?: string;
  betPath?: string;
  betId?: number;
  totalDeposited?: boolean;
  creatorAddress?: string;
  opponentAddress?: string;
  settlementTweet?: Post;
  settlementAttempt?: number;
  addressRequestAttempt?: number;
  depositAttempt: number;
  timestamp: number;
}
