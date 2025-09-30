import { Hono } from "hono";
import { startAll } from "../bets/bootstrap";
import { getStateSnapshot } from "../bets/state";

const app = new Hono();

app.get("/", (c) => {
  try {
    const { started } = startAll();

    const message = started ? "Started reading bets" : "Already running";
    const state = getStateSnapshot();

    return c.json({ message, ...state });
  } catch (error) {
    console.error("Error starting loops:", error);
    return c.json({ error: "Failed to start loops: " + (error as Error).message }, 500);
  }
});

export default app;
