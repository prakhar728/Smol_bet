export type NearBearer = string; // "near_xxx..." token in Authorization: Bearer <token>

export interface ThreadMessage {
  id: string;
  role: "user" | "assistant" | string;
  content: object;
  created_at?: string;
  metadata?: Record<string, any>;
}

export interface Thread {
  id: string;
  messages?: ThreadMessage[];
  metadata?: Record<string, any>;
}

export interface RunResponse {
  run_id: string;
  thread_id: string;
  status?: "queued" | "running" | "succeeded" | "failed";
  output_message_id?: string;
  [k: string]: any;
}
