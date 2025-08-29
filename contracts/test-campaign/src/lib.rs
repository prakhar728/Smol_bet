// Find all our documentation at https://docs.near.org
use near_sdk::{near};
use near_sdk::store::Vector;
use near_sdk::json_types::U64;
// use near_sdk::test_utils::{VMContextBuilder, get_logs};
mod events;
 use crate::events::run_agent;

#[near(serializers = [borsh, json])]
#[derive(Clone)]
pub struct Bet {
    pub bet_id: u64,
    pub terms: String,
    pub resolution: String,
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

    /// Add a new bet with only `terms`.
    /// - Sets resolution to empty string
    pub fn add_bet(&mut self, terms: String) {
        let bet = Bet {
            bet_id: self.bets.len() as u64 + 1,
            terms: terms,
            resolution: "".to_string(),
        };

        self.bets.push(bet);
    }

    /// User-facing function to trigger resolution.
    /// This does NOT resolve on-chain, but instead emits a JSON log event
    /// which can be picked up by an off-chain AI agent.
    pub fn request_resolve(self, index: u32) {
        let bet = self.bets.get(index);

        run_agent(
            &bet.unwrap().terms, // message
            &"ai-creator.near/term-resolver/latest".to_string(), // agent  
        );
    }

    /// Restricted: should only be called by the AI agent.
    /// Updates a bet with the given `resolution` and marks it as resolved.
    pub fn update_bet(&mut self, index: u32, resolution: String) {
        let mut bet = self.bets.get(index).expect("No bet at index").clone();
        bet.resolution = resolution;
        self.bets.replace(index, bet);
    }

    /// Retrieve a single bet by index
    pub fn get_bet(&self, index: u32) -> Option<Bet> {
       return self.bets.get(index).cloned();
    }

    /// Paginated fetch of multiple bets
    /// - `from_index`: starting index (default 0)
    /// - `limit`: number of bets to return (default 10)
    pub fn get_bets(&self, from_index: Option<U64>, limit: Option<U64>) -> Vec<&Bet> {
        let from = u64::from(from_index.unwrap_or(U64(0)));
        let limit = u64::from(limit.unwrap_or(U64(10)));

        self.bets
            .iter()
            .skip(from as usize)
            .take(limit as usize)
            .collect()
    }

     /// Returns the total number of bets stored
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
    
    // Example helper for creating mock bet data
    fn make_bet(i: u32) -> String {
        format!("terms-{i}")
    }

    #[test]
    fn add_and_get_single_bet() {
        let mut contract = BetTermStorage::default();

        // Add a bet
        let terms = make_bet(0);
        contract.add_bet(terms.clone());

        assert_eq!(contract.total_bets(), 1);

        // Verify bet was stored correctly
        let b = contract.get_bet(0).expect("expected bet at index 0");
        assert_eq!(b.terms, terms);
    }

    #[test]
    fn pagination_works() {
        let mut contract = BetTermStorage::default();

        // Add 15 bets
        for i in 0..15 {
            contract.add_bet(make_bet(i));
        }

        // Get 5 bets starting from index 5 -> should be terms-5 .. terms-9
        let page = contract.get_bets(Some(U64(5)), Some(U64(5)));
        assert_eq!(page.len(), 5);
        assert_eq!(page.first().unwrap().terms, "terms-5");
        assert_eq!(page.last().unwrap().terms, "terms-9");
    }

    #[test]
    fn get_bet_out_of_bounds_is_none() {
        let contract = BetTermStorage::default();
        assert!(contract.get_bet(0).is_none());
    }

    #[test]
    fn update_bet_sets_resolution() {
        let mut contract = BetTermStorage::default();

        // Arrange
        let terms = make_bet(1);
        contract.add_bet(terms.clone());
        assert_eq!(contract.total_bets(), 1);

        // Act
        contract.update_bet(0, "TRUE".to_string());

        // Assert
        let b = contract.get_bet(0).expect("bet should exist");
        assert_eq!(b.resolution, "TRUE");
    }

    #[test]
    fn request_resolve_emits_event() {
        // Arrange: set predecessor so the contract can include it in the event
        let mut ctx = VMContextBuilder::new();
        ctx.predecessor_account_id("alice.near".parse().unwrap());
        testing_env!(ctx.build());

        let mut contract = BetTermStorage::default();
        let terms = "Kolkata Night Riders vs Rajasthan Royals results 4th May".to_string();
        contract.add_bet(terms.clone());

        // Act
        contract.request_resolve(0);

        // Assert: exactly one log with the expected shape and fields
        let logs = get_logs();
        assert_eq!(logs.len(), 1, "expected exactly one event log");

        let v: serde_json::Value = serde_json::from_str(&logs[0]).expect("valid JSON log");
        assert_eq!(v["standard"], "nearai");
        assert_eq!(v["version"], "0.1.0");
        assert_eq!(v["event"], "run_agent");

        // data[0]
        let d0 = &v["data"][0];
        assert_eq!(d0["message"], terms);
        assert_eq!(d0["agent"], "ai-creator.near/term-resolver/latest");
        assert_eq!(d0["signer_id"], "alice.near");
        assert_eq!(d0["amount"], "0");
    }
}

