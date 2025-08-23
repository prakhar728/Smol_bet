import { TwitterApi } from 'twitter-api-v2';

function reqEnv(name: string) {
  const v = process.env[name];
  
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export class XClients {
  /** Read/search/stream (v2) — app-only bearer */
  static readClient() {
    return new TwitterApi(reqEnv('X_BEARER'));
  }

  /** Write as bot account — OAuth 1.0a user context (stable & simple) */
  static writeClient() {
    return new TwitterApi({
      appKey: reqEnv('X_API_KEY'),
      appSecret: reqEnv('X_API_SECRET'),
      accessToken: reqEnv('X_ACCESS_TOKEN'),
      accessSecret: reqEnv('X_ACCESS_SECRET'),
    });
  }
}
