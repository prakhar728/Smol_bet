import { TappdClient } from '../../utils/tappd';
import 'dotenv/config';
import { contractCall } from '@neardefi/shade-agent-js';

export const dynamic = 'force-dynamic';

const endpoint = process.env.DSTACK_SIMULATOR_ENDPOINT;

export default async function isVerified(req, res) {
    const client = new TappdClient(endpoint);

    // get tcb info from tappd
    const { tcb_info } = await client.getInfo();
    const { app_compose } = JSON.parse(tcb_info);
    // first sha256: match of docker-compose.yaml will be codehash (arrange docker-compose.yaml accordingly)
    let [codehash] = app_compose.match(/sha256:([a-f0-9]*)/gim);

    codehash = codehash.replace('sha256:', '');

    let verified = false;
    try {
        await contractCall({
            methodName: 'is_verified_by_codehash',
            args: {
                codehash,
            },
        });
        verified = true;
    } catch (e) {
        verified = false;
    }

    res.status(200).json({ verified });
}
