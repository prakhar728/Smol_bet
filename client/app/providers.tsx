"use client";

import "@near-wallet-selector/modal-ui/styles.css";
import { WalletSelectorProvider } from "@near-wallet-selector/react-hook";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { NETWORK } from "@/lib/near/config";
import { NetworkId } from "@near-wallet-selector/core";


const walletSelectorConfig = {
  network: NETWORK as NetworkId, // or process.env.NEXT_PUBLIC_NEAR_NETWORK
  modules: [setupMeteorWallet()],
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletSelectorProvider config={walletSelectorConfig}>
      {children}
    </WalletSelectorProvider>
  );
}
