// bets/bootstrap.ts
import { startRepliesLoop } from "./handlers/replies";
import { startDepositsLoop } from "./handlers/deposits";
import { startSettlementsLoop } from "./handlers/settlements";
import { startSearchLoop } from "./services/search";
import { isLoopRunning, setLoopRunning } from "./state";
import { log } from "./lib/log";

/**
 * Starts all loops exactly once.
 * Returns { started: true } on the first call, { started: false } if already running.
 */
export function startAll(): { started: boolean } {
  if (isLoopRunning) {
    return { started: false };
  }

  try {
    setLoopRunning(true);

    log.debugger("Starting the loop!");
    
    // kick off your long-running loops/intervals
    startRepliesLoop();
    startDepositsLoop();
    startSettlementsLoop();
    startSearchLoop();

    return { started: true };
  } catch (err) {
    // if anything throws synchronously, reset the flag so we can try again later
    setLoopRunning(false);
    throw err;
  }
}
