import { auroraTestNetRpcUrl } from './aurora-testnet';
import { baseSepoliaRpcUrl } from './base-sepolia';

export { AuroraTestnet } from './aurora-testnet';
export { BaseSepolia } from './base-sepolia';


export const chainAnnotationToRpc = {
    "AT": auroraTestNetRpcUrl,
    "BS": baseSepoliaRpcUrl
}

export const chainAnnotationToExplorer = {
    "AT": "https://explorer.testnet.aurora.dev",
    "BS": "https://explorer.testnet.aurora.dev"
}