import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { dispatchOmniEvent } from 'vlocity_ins/omniscriptUtils';
import { api, LightningElement } from 'lwc';

export default class BrainTreeIframe extends OmniscriptBaseMixin(
    LightningElement
) {
    get brainTreeUrl() {
        let path;
        if (this.omniJsonDef) path = this.omniGetMergeField(this.omniJsonDef.propSetMap.formulaPath);
        return `https://vlocity-braintree-demo.herokuapp.com?${(path)? path: ''}`
    }
    
    @api height = '400';
    @api width = '100%';
    @api params;

    connectedCallback() {
        window.addEventListener('message', this.handleBraintreeResponse.bind(this), false);
    }

    handleBraintreeResponse(evt) {
        if (evt.data.name === 'VlocityCreditCardTransaction') {
            const transaction = evt.data.transaction;
            const nonce = evt.data.nonce;
            const input = {};
            input['Braintree'] = {};
            input.Braintree['transaction'] = transaction.transaction;  
            input['CreditCard'] = {};
            input.CreditCard['noncetest'] = nonce;
            input.CreditCard['paymentNonce'] = nonce;

            const detail = {
                apiResponse: input,
            };
            dispatchOmniEvent(this, detail, 'omniactionbtn');
        }
    } 
}