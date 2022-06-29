import { clientConfig } from '../config';
const platformClient = require('purecloud-platform-client-v2/dist/node/purecloud-platform-client-v2.js');
const client = platformClient.ApiClient.instance;
const { clientId, redirectUri } = clientConfig;

export function authenticate() {
    return client.loginImplicitGrant(clientId, redirectUri, { state: 'state' })
        .then((data: any) => {
            return data;
        })
        .catch((err: any) => {
            console.error(err);
        });
}

