# Interaction

This contract stores simple **bets** on NEAR. It exposes one change method and three view methods:

- **change**
  - `add_bet(initiator, opponent, chain, terms, currency, amount, parentid, currentid, remarks)`

- **view**
  - `get_bet(index: u32) -> Option<Bet>`
  - `get_bets(from_index: Option<U64>, limit: Option<U64>) -> Vec<&Bet>`
  - `total_bets() -> u32`

### Types
```rust
#[near(serializers = [borsh, json])]
#[derive(Clone)]
enum BetStatus { Created, Staked, Resolved }

#[near(serializers = [borsh, json])]
#[derive(Clone)]
pub struct Bet {
  pub initiator: String,
  pub opponent: String,
  pub chain: String,
  pub terms: String,
  pub currency: String,
  pub amount: String,
  pub parentid: String,
  pub currentid: String,
  pub remarks: String,
  pub betstatus: BetStatus, // set to Created in add_bet
}
```

### near-cli (testnet) examples

> Replace `<CONTRACT_ID>` with your deployed account (e.g. `bets.your.testnet`) and `<YOUR_ACCOUNT>` with your signer.

**Add a bet (change method):**
```bash
near call <CONTRACT_ID> add_bet '{
  "initiator":"alice.testnet",
  "opponent":"bob.testnet",
  "chain":"NEAR",
  "terms":"Loser buys coffee",
  "currency":"NEAR",
  "amount":"1",
  "parentid":"-",
  "currentid":"bet-1",
  "remarks":"no backsies"
}' --accountId <YOUR_ACCOUNT>
```

**Get a single bet (view):**
```bash
near view <CONTRACT_ID> get_bet '{"index": 0}'
```
Returns either a `Bet` JSON object or `null` if out of bounds.

**Paginate bets (view):**
```bash
# U64 values are passed as strings in JSON
near view <CONTRACT_ID> get_bets '{"from_index":"0","limit":"10"}'
```

**Count bets (view):**
```bash
near view <CONTRACT_ID> total_bets '{}'
```

---

# Deployment

## Prerequisites
- Rust toolchain with `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- Node-based **near-cli**:
  ```bash
  npm i -g near-cli
  ```
- A funded testnet account (e.g. `your.testnet`), logged in:
  ```bash
  near login
  ```

## Build the WASM
```bash
cargo near build
```
WASM artifact: `target/near/<crate_name>.wasm`

## Create a contract account (testnet)
```bash
near create-account <accountId> --useFaucet
```

## Deploy
```bash
near deploy <accountId> <route_to_wasm>
```

You can now run the **Interaction** commands against `bets.your.testnet`.

## Init

```bash
near call nearstorage1.testnet  [<args>] --accountId <accountId>
```
---

## Overview

A minimal NEAR smart contract that stores `Bet` records in a `Vector<Bet>`.

- `add_bet` appends a new bet (status set to `Created`).
- `get_bet` safely returns `Option<Bet>` (serializes to `null` in JSON if index is out of bounds).
- `get_bets` paginates with `(from_index, limit)` using `U64` wrappers.
- `total_bets` returns the current length.

### Storage structure
```rust
#[near(contract_state)]
pub struct BetStorage { bets: Vector<Bet> }
```

---

## Build & Test locally

### Unit tests
```bash
cargo test
```

### Workspaces smoke test (optional)
**Cargo.toml (dev-dependencies)**
```toml
[dev-dependencies]
anyhow = "1"
near-workspaces = "0.10"        # or current
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }
serde_json = "1"
```

**Example**
```rust
let wasm = near_workspaces::compile_project("./").await?;
let sandbox = near_workspaces::sandbox().await?;
let contract = sandbox.dev_deploy(&wasm).await?;
let user = sandbox.dev_create_account().await?;

user.call(contract.id(), "add_bet")
    .args_json(serde_json::json!({
        "initiator":"i","opponent":"o","chain":"NEAR","terms":"t",
        "currency":"NEAR","amount":"1","parentid":"-","currentid":"bet-0","remarks":"r"
    }))
    .transact().await?.into_result()?;

let bet: serde_json::Value = contract.view("get_bet")
    .args_json(serde_json::json!({"index": 0u32}))
    .await?
    .json()?;
assert_eq!(bet["currentid"], "bet-0");
```

---

## Common pitfalls

- **U64 parameters over JSON:** when using near-cli, pass `from_index` and `limit` as **strings** (e.g., `"10"`) because they’re `json_types::U64`.
- **Panics on indexing:** use `get_bet` (which returns `Option`) instead of direct indexing; direct `self.bets[index]` will panic on out-of-bounds.
- **References in `get_bets`:** the current signature returns `Vec<&Bet>`, which is fine for unit tests. If you plan to call `get_bets` over RPC, prefer returning `Vec<Bet>` so it can serialize cleanly.
