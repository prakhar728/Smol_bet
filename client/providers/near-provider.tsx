"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSelector } from "@/lib/near/selector";

type Ctx = {
  accountId: string | null;
  ready: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};
const NearCtx = createContext<Ctx | null>(null);

export function NearProvider({ children }: { children: React.ReactNode }) {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const selector = await getSelector();
      const acc = selector.store.getState().accounts[0]?.accountId ?? null;
      setAccountId(acc);
      selector.store.observable.subscribe((s) => {
        const next = s.accounts[0]?.accountId ?? null;
        setAccountId(next);
      });
      setReady(true);
    })();
  }, []);

  const value = useMemo<Ctx>(() => ({
    accountId,
    ready,
    signIn: async () => (await (await getSelector()).show()),
    signOut: async () => {
      const wallet = await (await getSelector()).wallet();
      await wallet.signOut();
    },
  }), [accountId, ready]);

  return <NearCtx.Provider value={value}>{children}</NearCtx.Provider>;
}

export function useNear() {
  const ctx = useContext(NearCtx);
  if (!ctx) throw new Error("useNear must be used within NearProvider");
  return ctx;
}
