// Find all our documentation at https://docs.near.org
use near_sdk::{log, near};


#[near(serializers = [borsh, json])]
#[derive(Clone)]
enum status {
    Created,
    Staked,
    Resolved
}

#[near(serializers = [borsh, json])]
#[derive(Clone)]
pub struct Bet {
    pub bet_id: u64,
    pub terms: String,
    pub resolution: String,
    pub status: status,
}

#[near(contract_state)]
pub struct BetTermStorage {
    bets: Vector<Bet>,
}

// Define the default, which automatically initializes the contract
impl Default for BetTermStorage {
    fn default() -> Self {
        Self {
            bets: Vector::new(b"b"),
        }
    }
}

// Implement the contract structure
#[near]
impl BetTermStorage {

    pub fn add_bet(&mut self, terms: String) {
        let bet = Bet {
            id: self.bets.len()+1,
            terms: terms,
            resolution: "".to_string(),
            betstatus: status::Created
        };

        self.bets.push(bet);
    }

    // should only be accessible to the AI.
    pub fn request_resolve(self, index: u32) {
        let bet = self.bets.get(index);
        

    }

    // should only be accessible to the AI.
    pub fn update_bet(&mut self, index: u32) {
        let bet = self.bets.get(index);

        

    }

    pub fn get_bet(&self, index: u32) -> Option<Bet> {
       return self.bets.get(index).cloned();
    }

    pub fn get_bets(&self, from_index: Option<U64>, limit: Option<U64>) -> Vec<&Bet> {
        let from = u64::from(from_index.unwrap_or(U64(0)));
        let limit = u64::from(limit.unwrap_or(U64(10)));

        self.bets
            .iter()
            .skip(from as usize)
            .take(limit as usize)
            .collect()
    }

    pub fn total_bets(&self) -> u32 {
        self.bets.len()
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;
    // NEAR env helpers aren’t strictly needed here since we don’t use context-dependent APIs.

    fn make_bet(i: u32) -> (String, String, String, String, String, String, String, String, String) {
        (
            format!("initiator-{i}"),
            format!("opponent-{i}"),
            "chain".to_string(),
            "terms".to_string(),
            "currency".to_string(),
            "amount".to_string(),
            format!("parent-{i}"),
            format!("bet-{i}"),
            "remarks".to_string(),
        )
    }

    #[test]
    fn add_and_get_single_bet() {
        let mut contract = BetStorage::default();

        let (initiator, opponent, chain, terms, currency, amount, parentid, currentid, remarks) = make_bet(0);
        contract.add_bet(
            initiator.clone(),
            opponent.clone(),
            chain.clone(),
            terms.clone(),
            currency.clone(),
            amount.clone(),
            parentid.clone(),
            currentid.clone(),
            remarks.clone(),
        );

        assert_eq!(contract.total_bets(), 1);

        let b = contract.get_bet(0).expect("expected bet at index 0");
        assert_eq!(b.initiator, initiator);
        assert_eq!(b.opponent, opponent);
        assert_eq!(b.currentid, currentid);
        // Prefer pattern-match over deriving PartialEq on enums
        assert!(matches!(b.betstatus, BetStatus::Created));
    }

    #[test]
    fn pagination_works() {
        let mut contract = BetStorage::default();

        for i in 0..15 {
            let (initiator, opponent, chain, terms, currency, amount, parentid, currentid, remarks) = make_bet(i);
            contract.add_bet(initiator, opponent, chain, terms, currency, amount, parentid, currentid, remarks);
        }

        // Get 5 items starting from index 5 -> should be bet-5 .. bet-9
        let page = contract.get_bets(Some(U64(5)), Some(U64(5)));
        assert_eq!(page.len(), 5);
        assert_eq!(page.first().unwrap().currentid, "bet-5");
        assert_eq!(page.last().unwrap().currentid, "bet-9");
    }

    #[test]
    fn get_bet_out_of_bounds_is_none() {
        let contract = BetStorage::default();
        assert!(contract.get_bet(0).is_none());
    }
}

