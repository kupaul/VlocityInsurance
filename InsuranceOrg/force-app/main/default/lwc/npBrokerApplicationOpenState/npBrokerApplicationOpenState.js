import { LightningElement, api, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import template from "./npBrokerApplicationOpenState.html";
export default class cnpBrokerApplicationOpenState extends BaseState(LightningElement)
{
    @api set card(val) {
        this._card = val;
        if (this._card) {
            const selectedEvent = new CustomEvent('brokerCard',
                { detail: { card: this.card, openState: true }, bubbles: true, composed: true });
            this.dispatchEvent(selectedEvent);
        }
    } get card() {
        return this._card;
    };

    @track _card;

    render() {
        return template;
    }
}