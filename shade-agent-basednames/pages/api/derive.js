import { networkId, deriveWorkerAccount } from '@neardefi/shade-agent-js';

export const dynamic = 'force-dynamic';

export default async function derive(req, res) {
    console.log('networkId', networkId);
    console.log('NEXT_PUBLIC_contractId', process.env.NEXT_PUBLIC_contractId);
    // use dev account when running locally
    if (process.env.NEXT_PUBLIC_accountId !== undefined) {
        res.status(200).json({
            accountId: process.env.NEXT_PUBLIC_accountId,
        });
        return;
    }

    const accountId = await deriveWorkerAccount();

    res.status(200).json({
        accountId,
    });
}
