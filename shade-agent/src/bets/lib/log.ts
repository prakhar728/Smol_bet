import { createLogger } from "./logger";

export const log = createLogger({
  scope: "app",       // top-level scope
  timestamp: true,    // ISO timestamps
  // level: "info",   // optional; can also set LOG_LEVEL env
});
