use near_sdk::{env, log};
use near_sdk::serde::Serialize;
use near_sdk::serde_json::{json, Value};

#[derive(Serialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AgentData<'a> {
    pub message: &'a str,
    pub agent: &'a str,
    pub env_vars: Option<&'a str>,
    pub request_id: Option<&'a str>,
    pub max_iterations: Option<u8>,
    pub thread_id: Option<&'a str>,
    pub signer_id: &'a str,
    pub referral_id: Option<&'a str>,

    // If you need to handle balances later, add:
    // #[serde(with = "crate::events::option_u128_dec_format")]
    // pub amount: Option<u128>,
}

pub fn log_event<T: Serialize>(event: &str, data: T) {
    let event = json!({
        "standard": "nearai",
        "version": "0.1.19",
        "event": event,
        "data": [data],
    });

    log!("EVENT_JSON:{}", event.to_string());
}

pub fn run_agent(message: &str, agent: &str) {
    log_event(
        "run_agent",
        AgentData {
            message,
            agent,
            env_vars: None,
            request_id: None,
            max_iterations: None,
            thread_id: None,
            signer_id: &env::predecessor_account_id().to_string(),
            referral_id: None,
        },
    );
}

/// Optional helper for serializing Option<u128> as decimal strings
pub mod option_u128_dec_format {
    use near_sdk::serde::Serializer;
    pub fn serialize<S>(num: &Option<u128>, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&num.unwrap_or_default().to_string())
    }
}
