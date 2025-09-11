/* eslint-disable no-console */
import { GenerateAddressParams, GenerateAddressResult } from "./types";

/**
 * Network id exported for callers
 * - Respects NEXT_PUBLIC_networkId with fallback to "testnet"
 */
export const networkId: "testnet" | "mainnet" =
  (process.env.NEXT_PUBLIC_networkId === "mainnet" ? "mainnet" : "testnet");

/**
 * Simple exponential backoff retry helper
 */
async function withRetries<T>(
  fn: () => Promise<T>,
  opts: { retries?: number; baseDelayMs?: number } = {}
): Promise<T> {
  const retries = opts.retries ?? 2;
  const base = opts.baseDelayMs ?? 300;
  let attempt = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= retries) throw err;
      const jitter = Math.floor(Math.random() * 100);
      const delay = base * Math.pow(2, attempt) + jitter;
      await new Promise((r) => setTimeout(r, delay));
      attempt++;
    }
  }
}

/**
 * DEV-ONLY fallback: makes a deterministic pseudo EVM address from inputs.
 * This is NOT a real, controlled wallet address—only for local/testing when no backend is set.
 */
function devOnlyDeterministicAddress(seed: string): `0x${string}` {
  // Use SHA-256 (available everywhere) just to derive 32 bytes; last 20 bytes become the "address".
  // This is intentionally NOT keccak/EIP-55 to make it obvious this is a stub.
  const cryptoObj: typeof import("crypto") | undefined = (() => {
    try { return require("crypto"); } catch { return undefined; }
  })();

  const hex = cryptoObj
    ? cryptoObj.createHash("sha256").update(seed).digest("hex")
    : // Minimal browser fallback (not crypto-secure; okay for stub)
      Array.from(seed)
        .reduce((acc, ch, i) => acc + ((seed.charCodeAt(i) * 2654435761) >>> 0).toString(16), "")
        .slice(0, 64)
        .padEnd(64, "0");

  // Take last 40 hex chars (20 bytes) as address body
  const body = hex.slice(-40).padStart(40, "0").toLowerCase();
  return `0x${body}`;
}

/**
 * Core address generation.
 *
 * If SHADE_AGENT_API_URL is set, we POST to:
 *    POST {SHADE_AGENT_API_URL}/addresses/generate
 *    body: { publicKey, accountId, path, chain, networkId }
 *    response: { address: "0x..." }
 *
 * Otherwise we fallback to a deterministic dev-only pseudo address so your
 * app can keep moving during local development.
 */
export async function generateAddress(
  params: GenerateAddressParams
): Promise<GenerateAddressResult> {
  const { publicKey, accountId, path, chain } = params;

  if (chain !== "evm") {
    throw new Error(`Unsupported chain "${chain}". Supported: "evm"`);
  }

  const baseUrl = process.env.SHADE_AGENT_API_URL?.replace(/\/+$/, "");
  if (!baseUrl) {
    // DEV fallback
    if (process.env.NODE_ENV !== "production") {
      const seed = JSON.stringify({ publicKey, accountId, path, chain, networkId });
      const address = devOnlyDeterministicAddress(seed);
      if (process.env.SHADE_AGENT_DEBUG) {
        console.warn("[shade-agent-js] Using DEV fallback address (no backend configured):", address);
      }
      return { address };
    }
    throw new Error(
      "SHADE_AGENT_API_URL is not set. In production you must configure the backend address generation endpoint."
    );
  }

  const url = `${baseUrl}/addresses/generate`;

  const doRequest = async (): Promise<GenerateAddressResult> => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        publicKey,
        accountId,
        path,
        chain,
        networkId,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Address generation failed (${res.status} ${res.statusText}). ${text || ""}`.trim()
      );
    }

    const data = (await res.json()) as Partial<GenerateAddressResult>;
    if (!data?.address || !/^0x[0-9a-fA-F]{40}$/.test(data.address)) {
      throw new Error("Backend did not return a valid EVM address.");
    }

    // normalize to lowercase to avoid mixed-case surprises; callers can checksum as needed
    return { address: data.address as `0x${string}` };
  };

  return withRetries(doRequest, { retries: 2, baseDelayMs: 300 });
}

export default {
  generateAddress,
  networkId,
};
