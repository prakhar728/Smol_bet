use serde_json::json;

#[tokio::test]
async fn test_contract_is_operational() -> anyhow::Result<()> {
    let wasm = near_workspaces::compile_project("./").await?;
    let sandbox = near_workspaces::sandbox().await?;
    let contract = sandbox.dev_deploy(&wasm).await?;
    let user = sandbox.dev_create_account().await?;

    // call: add_bet
    let outcome = user
        .call(contract.id(), "add_bet")
        .args_json(json!({
            "initiator":"i","opponent":"o","chain":"c","terms":"t",
            "currency":"usd","amount":"1","parentid":"p","currentid":"bet-0","remarks":"r"
        }))
        .transact().await?;
    assert!(outcome.is_success(), "{:#?}", outcome.into_result().unwrap_err());

    // view: get_bet (index should be u64 in your contract)
    let res = contract.view("get_bet").args_json(json!({"index": 0u64})).await?;
    let v: serde_json::Value = res.json()?;
    assert_eq!(v["currentid"].as_str().unwrap(), "bet-0");

    Ok(())
}
