import Navigo from 'navigo';
import { LightningElement, track, api } from 'lwc';
import { getConnection } from 'c/omniscriptConnection';

export default class App extends LightningElement {
    router = new Navigo(location.origin, true);

    @api layout = "slds";
    @track view;
    @track authUrl;
    @track authenticated = false;

    constructor() {
        super();

        // Connect using access token
        if (window.sessionStorage.getItem('sf.access-token')) {
            getConnection().useSessionStorage();
            this.authenticated = true;
        }

        this.setup();

    }

    setup() {
        this.router.on({
            '/view': async () => {
                if (!this.authenticated) {
                    this.router.navigate('/auth');
                    return;
                }
                const { default: OmniscriptView } = await import('view/omniscript');
                this.setView(OmniscriptView);
            },
            '/auth': async () => {
                if (this.authenticated) {
                    this.router.navigate('/view');
                    return;
                }
                const { default: OmniscriptView } = await import('view/auth');
                this.setView(OmniscriptView);
            },
            '/error': async () => {
                const { default: OmniscriptView } = await import('view/error');
                this.setView(OmniscriptView);
            },
            '/callback': async () => {

                // Get the auth code
                const authCode = this.getUrlParamValue('code');
                getConnection().authorize(authCode)
                    .then(() => {
                        this.authenticated = true;
                        window.location.href = window.location.origin + window.location.pathname + '#/view';
                    })
                    .catch(() => {
                        this.router.navigate('/error');
                        this.authenticated = false;
                    });
            }
        });

        const navigateToDefault = () => {
            this.router.navigate('/auth');
        };

        this.router.notFound(navigateToDefault);
        this.router.on(navigateToDefault);

        this.router.resolve();
    }

    setView(component, props = {}) {
        this.view = {
            component,
            props,
        };
    }

    handleNavigateEvent(event) {
        const { path } = event.detail;
        this.router.navigate(path);
    }

    getUrlParamValue(key) {
        return new URL(window.location.href).searchParams.get(key);
    }

    logout() {
        getConnection().logout()
            .then(() => {
                window.location.reload();
            });
    }
}
