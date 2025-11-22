// components/ConnectWalletButton.tsx
"use client";
import { Button } from "@/components/ui/button";
import { useWalletSelector } from "@near-wallet-selector/react-hook";

export function ConnectWalletButton() {
  const { signedAccountId, signIn, signOut } = useWalletSelector();
  return signedAccountId ? (
    <Button 
      variant="ghost" 
      className="border border-white/15 text-xs md:text-sm h-9 md:h-10 px-2 md:px-3 min-h-[36px] md:min-h-[40px]" 
      onClick={signOut}
    >
      <span className="hidden sm:inline">{signedAccountId} — </span>
      <span className="sm:hidden max-w-[80px] truncate">{signedAccountId}</span>
      <span className="hidden md:inline">Sign out</span>
      <span className="md:hidden">Out</span>
    </Button>
  ) : (
    <Button 
      className="bg-[#C3F53B] text-black hover:bg-[#C3F53B]/90 text-xs md:text-sm h-9 md:h-10 px-3 md:px-4 min-h-[36px] md:min-h-[40px]" 
      onClick={signIn}
    >
      <span className="hidden sm:inline">Connect Wallet</span>
      <span className="sm:hidden">Connect</span>
    </Button>
  );
}
