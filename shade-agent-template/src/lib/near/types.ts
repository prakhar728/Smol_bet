export type BetStatus = "Created" | "Staked" | "Resolved";

export interface Bet {
  initiator: string;
  opponent: string;
  chain: string;
  terms: string;
  currency: string;
  amount: string;
  parentid: string;
  currentid: string;
  remarks: string;
  betstatus: BetStatus;
}
