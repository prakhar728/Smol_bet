import { registerWorker } from '@neardefi/shade-agent-js';

export const dynamic = 'force-dynamic';

export default async function register(req, res) {
    // running locally with/without tappd simulator
    if (process.env.NEXT_PUBLIC_accountId !== undefined) {
        // cannot register worker with simulator attestation quote
        console.log('cannot register while running tappd simulator:', endpoint);
        return;
    }

    const registered = await registerWorker();

    res.status(200).json({ registered });
}
