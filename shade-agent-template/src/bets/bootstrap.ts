import { startRepliesLoop } from "./handlers/replies";
import { startDepositsLoop } from "./handlers/deposits";
import { startSettlementsLoop } from "./handlers/settlements";
import { startSearchLoop } from "./services/search";

export function startAll() {
  startRepliesLoop();
  startDepositsLoop();
  startSettlementsLoop();
  startSearchLoop();
}
