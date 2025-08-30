## Creating the deployment

### Create a new account
```bash
ACCOUNT_NAME=test-campaign-6.testnet
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
      "agent": "Test bet at 2025-08-29T21:32:59.388Z",
      "env_vars": null,
      "max_iterations": null,
      "message": "ai-creator.near/term-resolver/latest",
      "referral_id": null,
      "request_id": null,
      "signer_id": "test-account3.testnet",
      "thread_id": null
    }
  ],
  "event": "run_agent",
  "standard": "nearai",
  "version": "0.1.0"
}
```