## Creating the deployment

### Create a new account
```bash
ACCOUNT_NAME=test-campaign.testnet
near create-account $ACCOUNT_NAME  --useFaucet
```

### Deploy

```bash
near deploy $ACCOUNT_NAME  ./target/near/test-campaign.wasm
