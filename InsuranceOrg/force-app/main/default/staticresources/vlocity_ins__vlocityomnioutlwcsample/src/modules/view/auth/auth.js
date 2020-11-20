import { LightningElement, api } from 'lwc';
import { getConnection } from 'c/omniscriptConnection';

export default class AuthView extends LightningElement {

    constructor() {
        super();
    }

    authenticate() {
        window.location = getConnection().authUrl;
    }
}