"use client";

import { Button } from "@/components/ui/button";
import { useNear } from "@/lib/near/providers";

export function ConnectWalletButton() {
  const { accountId, ready, signIn, signOut } = useNear();
  if (!ready) return <Button disabled>Loading…</Button>;
  return accountId ? (
    <Button variant="ghost" className="border border-white/15" onClick={signOut}>
      {accountId} — Sign out
    </Button>
  ) : (
    <Button className="bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90" onClick={signIn}>
      Connect Wallet
    </Button>
  );
}
