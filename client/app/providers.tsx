"use client";

import "@near-wallet-selector/modal-ui/styles.css";
import { WalletSelectorProvider } from "@near-wallet-selector/react-hook";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";

const walletSelectorConfig = {
  network: "testnet" as const, // or process.env.NEXT_PUBLIC_NEAR_NETWORK
  modules: [setupMeteorWallet()],
};

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WalletSelectorProvider config={walletSelectorConfig}>
      {children}
    </WalletSelectorProvider>
  );
}
