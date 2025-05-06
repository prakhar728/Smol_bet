import { networkId, generateAddress } from '@neardefi/shade-agent-js';
import { evm } from '../../utils/evm';
import { ethers } from 'ethers';
import { resolveBetWithAI } from './lib/intent-parser';

// Helper sleep function to add delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default async function testBet(req, res) {
    try {
        // Define test parameters
        const creator = '0xa9190336A4D79bAFc65a6575236f62b6f15370e9';
        const opponent = '0xFF6fBBe67630260A49a95674AF4Be968C01dE1DC';
        const description = "Lucknow Super Giants will beat Punjab kings on May4th, 2025.";
        const stake = ethers.parseEther('0.001'); // 0.01 ETH stake
        
        // Generate a unique path for this test
        const createPath = `testbet-create-${Date.now()}`;
        
        // Generate deposit address that will act as resolver
        const { address: resolverAddress } = await generateAddress({
            publicKey:
                networkId === 'testnet'
                    ? process.env.MPC_PUBLIC_KEY_TESTNET
                    : process.env.MPC_PUBLIC_KEY_MAINNET,
            accountId: process.env.NEXT_PUBLIC_contractId || 'shadeagent.near',
            path: createPath,
            chain: 'evm',
        });
        
        console.log('Generated resolver address:', resolverAddress);
        

        await sleep(30000);

        // Step 1: Create the bet
        console.log('Creating bet...');
        const createResult = await evm.createBetTx({
            description,
            creator,
            opponent,
            resolver: resolverAddress,
            stake, // This is the total stake amount
            path: createPath,
        });

        console.log("Create result", createResult);
        
        
        if (!createResult.success) {
            return res.status(500).json({
                success: false,
                message: 'Failed to create bet',
                error: createResult.error
            });
        }
        
        console.log('Bet creation transaction sent, waiting for it to be mined...');
        console.log('Transaction hash:', createResult.hash);
        
        // Wait for 5 seconds to allow transaction to propagate
        await sleep(5000);
        
        // Get the transaction receipt
        const provider = await evm.getProvider();
        const receipt = await provider.getTransactionReceipt(createResult.hash);
        
        console.log(receipt);
        
        if (!receipt) {
            console.log('Transaction still pending, continuing with estimated bet ID');
        } else {
            console.log('Transaction mined in block:', receipt.blockNumber);
        }
        
        // For testing purposes, we'll assume the bet ID is 1
        // In production, you would extract this from event logs
        const betId = await evm.getBetCount() - 1; // Placeholder - extract from event logs in production
        
        console.log('Using bet ID:', betId);
        
        // Wait another 5 seconds before resolving the bet
        console.log('Waiting 5 seconds before resolving bet...');
        await sleep(5000);

        const resolution = await resolveBetWithAI(description);

        console.log(resolution);
        console.log(resolution.toLowerCase());
        
        let winner = '';
        if ((resolution.toLowerCase()).includes("true"))
            winner = creator;
        else
            winner = opponent;
        

        // Generate a new path for resolution
        const resolvePath = createPath;
        
        // Step 2: Resolve the bet (creator always wins in this test)
        console.log('Resolving bet...');
        const resolveResult = await evm.resolveBetTx({
            betId,
            winner: winner, // Creator always wins in this test
            resolverAddress,
            path: resolvePath,
        });
        
        // Wait for 3 seconds to allow resolution transaction to propagate
        await sleep(3000);
        
        return res.status(200).json({
            success: true,
            createTransaction: createResult,
            resolveTransaction: resolveResult,
            betId,
            description,
            creator,
            opponent,
            resolver: resolverAddress,
            testTime: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error in test bet:', error);
        return res.status(500).json({
            success: false,
            message: 'Test bet failed',
            error: error.message
        });
    }
}