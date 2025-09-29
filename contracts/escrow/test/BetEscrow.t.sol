// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/BetEscrow.sol";

contract BetEscrowTest is Test {
    BetEscrow public betEscrow;

    address public participant1; // Address 1 (bet creator)
    address public participant2; // Address 2 (bet opponent)
    address public mediator; // Address 3 (creates bet on behalf of participants)
    address public resolver; // Resolver who decides the outcome
    address public feeCollector; // Address that collects fees

    uint256 public betAmount = 1 ether;

    function setUp() public {
        // Set up fee collector
        feeCollector = address(this);

        // Deploy the contract with this test contract as the fee collector
        vm.prank(feeCollector);
        betEscrow = new BetEscrow();

        // Set up test addresses
        participant1 = makeAddr("participant1");
        participant2 = makeAddr("participant2");
        mediator = makeAddr("mediator");
        resolver = makeAddr("resolver");

        // Fund the mediator
        vm.deal(mediator, 10 ether);

        // Make participant addresses payable
        vm.etch(participant1, hex"00");
        vm.etch(participant2, hex"00");
        vm.etch(feeCollector, hex"00");
    }

    function testBetWithMediatorAndResolver() public {
        // 1. Mediator creates the bet on behalf of participant1 and participant2
        vm.startPrank(mediator);

        uint256 betId = betEscrow.createBet{value: betAmount}(
            "If the weather is sunny tomorrow, participant1 wins, otherwise participant2 wins",
            participant1, // creator
            participant2, // opponent
            resolver // resolver
        );

        vm.stopPrank();

        // Verify bet was created correctly
        IBetEscrow.Bet memory bet = betEscrow.getBet(betId);
        assertEq(bet.creator, participant1);
        assertEq(bet.opponent, participant2);
        assertEq(bet.stake, betAmount);
        assertEq(bet.resolver, resolver);
        assertTrue(bet.accepted);
        assertFalse(bet.resolved);

        // Check contract balance
        assertEq(address(betEscrow).balance, betAmount);

        // Record balances before resolution
        uint256 participant1BalanceBefore = address(participant1).balance;
        uint256 feeCollectorBalanceBefore = address(feeCollector).balance;

        // 2. Resolver declares participant1 as the winner
        vm.startPrank(resolver);
        betEscrow.resolveBet(betId, participant1);
        vm.stopPrank();

        // Verify bet is resolved
        bet = betEscrow.getBet(betId);
        assertTrue(bet.resolved);
        assertEq(bet.winner, participant1);

        // Calculate expected amounts
        uint256 totalAmount = betAmount * 2; // There would be 2 times the bet amount if we had both sides betting
        uint256 fee = (totalAmount * 1) / 100; // 1% fee
        uint256 winnings = totalAmount - fee;

        // Verify participant1 received the correct winnings
        assertEq(
            address(participant1).balance,
            participant1BalanceBefore + winnings
        );

        // Verify fee collector received the fee
        assertEq(
            address(feeCollector).balance,
            feeCollectorBalanceBefore + fee
        );

        // Verify contract balance is now 0
        assertEq(address(betEscrow).balance, 0);
    }

    function testContractBalanceAndFeesWithdrawal() public {
        // 1. Check initial contract balance
        assertEq(betEscrow.getContractBalance(), 0);

        // 2. Create a bet
        vm.startPrank(mediator);
        uint256 betId = betEscrow.createBet{value: betAmount}(
            "If the weather is sunny tomorrow, participant1 wins, otherwise participant2 wins",
            participant1,
            participant2,
            resolver
        );
        vm.stopPrank();

        // 3. Verify contract balance after bet creation
        assertEq(betEscrow.getContractBalance(), betAmount);

        // 4. Resolve the bet
        vm.startPrank(resolver);
        betEscrow.resolveBet(betId, participant1);
        vm.stopPrank();

        // 5. Verify contract balance after resolution (should be 0)
        assertEq(betEscrow.getContractBalance(), 0);
    }

    function testFeePercentage() public {
        // Create and resolve multiple bets to check fee calculations

        uint256 testAmount = 100 ether; // Use a large amount to make fee calculation clear
        vm.deal(mediator, testAmount * 2);

        // Create bet
        vm.startPrank(mediator);
        uint256 betId = betEscrow.createBet{value: testAmount}(
            "Test bet for fee calculation",
            participant1,
            participant2,
            resolver
        );
        vm.stopPrank();

        // Record balances before resolution
        uint256 feeCollectorBalanceBefore = address(feeCollector).balance;

        // Resolve bet
        vm.startPrank(resolver);
        betEscrow.resolveBet(betId, participant1);
        vm.stopPrank();

        // Calculate expected fee (1% of total amount)
        uint256 totalAmount = testAmount * 2; // Would be 2x if both sides bet
        uint256 expectedFee = (totalAmount * 1) / 100;

        // Verify fee collector received exactly 1%
        assertEq(
            address(feeCollector).balance - feeCollectorBalanceBefore,
            expectedFee
        );
    }

    function testChangeFeeCollector() public {
        // Current fee collector is this contract
        assertEq(address(betEscrow.feeCollector()), feeCollector);

        // Create a new fee collector
        address newFeeCollector = makeAddr("newFeeCollector");
        vm.etch(newFeeCollector, hex"00");

        // Only current fee collector can change the collector
        vm.startPrank(feeCollector);
        betEscrow.setFeeCollector(newFeeCollector);
        vm.stopPrank();

        // Verify the fee collector was changed
        assertEq(address(betEscrow.feeCollector()), newFeeCollector);

        // Create and resolve a bet to verify fees go to new collector
        vm.startPrank(mediator);
        uint256 betId = betEscrow.createBet{value: betAmount}(
            "Test bet for new fee collector",
            participant1,
            participant2,
            resolver
        );
        vm.stopPrank();

        uint256 newFeeCollectorBalanceBefore = address(newFeeCollector).balance;

        vm.startPrank(resolver);
        betEscrow.resolveBet(betId, participant1);
        vm.stopPrank();

        // Calculate expected fee
        uint256 totalAmount = betAmount * 2;
        uint256 expectedFee = (totalAmount * 1) / 100;

        // Verify new fee collector received the fee
        assertEq(
            address(newFeeCollector).balance - newFeeCollectorBalanceBefore,
            expectedFee
        );
    }

    function testWithdrawFees() public {
        // Create a bet to generate fees
        vm.startPrank(mediator);
        uint256 betId = betEscrow.createBet{value: betAmount}(
            "Test bet for fee withdrawal",
            participant1,
            participant2,
            resolver
        );
        vm.stopPrank();

        // Manually send some ETH to the contract to simulate accumulated fees
        vm.deal(address(betEscrow), 0.5 ether);

        uint256 contractBalanceBefore = address(betEscrow).balance;
        uint256 feeCollectorBalanceBefore = address(feeCollector).balance;

        // Only fee collector can withdraw
        vm.startPrank(feeCollector);
        betEscrow.withdrawFees(0.5 ether);
        vm.stopPrank();

        // Verify balances after withdrawal
        assertEq(address(betEscrow).balance, contractBalanceBefore - 0.5 ether);
        assertEq(
            address(feeCollector).balance,
            feeCollectorBalanceBefore + 0.5 ether
        );
    }
}
