// components/ConnectWalletButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

export function ConnectWalletButton() {
  const { signedAccountId, signIn, signOut } = useWalletSelector();
  return signedAccountId ? (
    <Button variant="ghost" className="border border-white/15" onClick={signOut}>
      {signedAccountId} — Sign out
    </Button>
  ) : (
    <Button className="bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90" onClick={signIn}>
      Connect Wallet
    </Button>
  );
}
