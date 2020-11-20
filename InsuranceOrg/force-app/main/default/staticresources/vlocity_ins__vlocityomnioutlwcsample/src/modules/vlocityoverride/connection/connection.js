import { OmniscriptConnection } from 'c/omniscriptConnection';
import jsforce from 'jsforce';

class CustomConnection extends OmniscriptConnection {
    oauth2;

    loginUrl = process.env.SF_LOGIN_URL;
    redirectUri = process.env.SF_OAUTH_CALLBACK_URL;
    clientId = process.env.SF_OAUTH_CLIENT_ID;
    clientSecret = process.env.SF_OAUTH_CLIENT_SECRET;
    proxyUrl = process.env.SF_PROXY_URL;

    constructor() {
        super();

        // Update the values in the session storage
        this.namespace = process.env.SF_ORG_NAMESPACE;
        window.sessionStorage.setItem('sf.namespace', this.namespace);
        window.sessionStorage.setItem('sf.proxy-url', this.proxyUrl);
        window.sessionStorage.setItem('sf.client-id', this.clientId);
        window.sessionStorage.setItem('sf.client-secret', this.clientSecret);
        window.sessionStorage.setItem('sf.login-url', this.loginUrl);
        window.sessionStorage.setItem('sf.redirect-uri', this.redirectUri);

    }


    get authUrl() {
        return new jsforce.OAuth2({
            loginUrl: this.loginUrl,
            clientId: this.clientId,
            clientSecret: this.clientSecret,
            redirectUri: this.redirectUri,
            proxyUrl: this.proxyUrl,
        }).getAuthorizationUrl({ scope: 'api id web refresh_token' });
    }

    authorize(authCode) {
        return new Promise((resolve, reject) => {

            // Create the connection
            const connection = new jsforce.Connection({
                loginUrl: this.loginUrl,
                proxyUrl: this.proxyUrl,
                clientId: this.clientId,
                clientSecret: this.clientSecret,
                redirectUri: this.redirectUri,
                logLevel: 'DEBUG',
            });

            connection.authorize(authCode, async (err, userInfo) => {
                if (err) {
                    reject(err);
                    return;
                }

                window.sessionStorage.setItem('sf.access-token', connection.accessToken);
                window.sessionStorage.setItem('sf.refresh-token', connection.refreshToken);
                window.sessionStorage.setItem('sf.instance-url', connection.instanceUrl);

                console.log('connection created');
                resolve();
            });
        });
    }

    logout() {
        return new Promise((resolve, reject) => {
            // Clear session
            window.sessionStorage.removeItem('sf.access-token');
            window.sessionStorage.removeItem('sf.refresh-token');
            window.sessionStorage.removeItem('sf.proxy-url');
            window.sessionStorage.removeItem('sf.instance-url');
            window.sessionStorage.removeItem('sf.login-url');
            window.sessionStorage.removeItem('sf.client-id');
            window.sessionStorage.removeItem('sf.client-secret');
            window.sessionStorage.removeItem('sf.redirect-uri');
            window.sessionStorage.removeItem('sf.namespace');
            resolve();
        });
    }
}

export { CustomConnection }