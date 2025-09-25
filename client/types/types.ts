export type Bet = {
  bet_id: number
  terms: string
  initiator?: string | null
  opponent?: string | null
  amount?: string | null
  currency?: string | null
  chain?: string | null
  betstatus?: string | null
  currentid?: string | null
  parentid?: string | null
  remarks?: string | null
  resolution?: string | null
}
