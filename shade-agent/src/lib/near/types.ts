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

export type TxExecutionStatus = 'NONE' | 'INCLUDED' | 'INCLUDED_FINAL' | 'EXECUTED' | 'FINAL' | 'EXECUTED_OPTIMISTIC';