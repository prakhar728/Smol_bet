import { Hono } from "hono";
import { agentAccountId, agent } from "@neardefi/shade-agent-js";
import evm from "../utils/evm";

const app = new Hono();

app.get("/", async (c) => {
    try {

        const result = await evm.resolveBetTx({ 
            betId: "23", 
            winner: "0x90f6797C18dF84b5D0cFA110F57D4eCB4Afa37Ed", 
            resolverAddress: "0xC36836075F161891Abf4E2D737513D2Af9B141a5", 
            path: "ethereum-2" 
        });

        return c.json(result);
    } catch (error) {
        console.log("Error getting agent account:", error);
        return c.json({ error: "Failed to get agent account " + error }, 500);
    }
});

export default app;
