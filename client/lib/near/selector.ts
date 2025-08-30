"use client";

import { setupWalletSelector, WalletSelector } from "@near-wallet-selector/core";
import { setupModal } from "@near-wallet-selector/modal-ui";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { setupLedger } from "@near-wallet-selector/ledger";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import { setupNightly } from "@near-wallet-selector/nightly";
import { CONTRACT_ID, CREATE_ACCESS_KEY_FOR, NETWORK } from "./config";

let _selector: WalletSelector | null = null;

export async function getSelector() {
  if (_selector) return _selector;

  _selector = await setupWalletSelector({
    network: NETWORK as "testnet" | "mainnet",
    debug: false,
    optimizeWalletOrder: true,
    modules: [setupMeteorWallet(), setupLedger(), setupNightly()],
  });

  setupModal(_selector, { contractId: CONTRACT_ID });

  if (CREATE_ACCESS_KEY_FOR) {
    // Wallets handle this flag internally on sign-in; no extra code needed here.
  }
  return _selector;
}
