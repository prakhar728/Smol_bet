// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/BetEscrow.sol";

contract DeployBetEscrow is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        BetEscrow betEscrow = new BetEscrow();
        
        vm.stopBroadcast();
        
        console.log("BetEscrow deployed to:", address(betEscrow));
    }
}