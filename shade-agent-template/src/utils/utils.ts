export async function fetchJson<T = any>(
  url: string,
  params: RequestInit = {},
  noWarnings = false
): Promise<T | undefined> {
  try {
    const res = await fetch(url, params);

    if (!res.ok) {
      if (!noWarnings) {
        console.warn("fetchJson error: HTTP", res.status, res.statusText);
        console.warn(await res.text());
      }
      return undefined;
    }

    return (await res.json()) as T;
  } catch (e) {
    if (!noWarnings) {
      console.error("fetchJson exception", e);
    }
    return undefined;
  }
}

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
