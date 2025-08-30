## Creating the deployment

### Create a new account
```bash
ACCOUNT_NAME=test-campaign-8.testnet
near create-account $ACCOUNT_NAME  --useFaucet
```

### Deploy

```bash
near deploy $ACCOUNT_NAME  ./target/near/test_campaign.wasm
```

### Example logs for test-campaign

```bash
{
    "data": [
        {
            "agent": "ai-creator.near/term-resolver/latest",
            "env_vars": null,
            "max_iterations": null,
            "message": "{"index":0,"terms":"Bitcoin is above 60,
            000 USD on August 28,
            2025"}",
            "referral_id": null,
            "request_id": null,
            "signer_id": "ai-creator.near",
            "thread_id": null
        }
    ],
    "event": "run_agent",
    "standard": "nearai",
    "version": "0.1.0"
}
```

## According to Nearai

```bash
{
  "standard": "nearai",
  "version": "0.1.0",
  "event": "run_agent",
  "data": [
    {
      "message": "Transformer",
      "agent": "zavodil.near/what-beats-rock/latest",
      "max_iterations": null,
      "thread_id": null,
      "env_vars": null,
      "signer_id": "v01.ai-is-near.near",
      "referral_id": null,
      "amount": "0"
    }
  ]
}
```