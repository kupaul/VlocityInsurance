import { LightningElement, track } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npBrokerApplicationTabs.html";
import { get } from "vlocity_ins/lodash";
// import data from "./def";
export default class npBrokerApplicationTabs extends BaseState(LightningElement)
{
    @track showMore;
    isRenderCallbackActionExecuted = false;
    render() {
        return cardActive;
    }
    connectedCallback() {
        this.showMore = false;
    }
    renderedCallback() {
        if (this.isRenderCallbackActionExecuted) {
            return;
        }
        if (this.selectedState) {
            const selectedEvent = new CustomEvent('brokerCard', {
                detail:
                    { card: this.card, openState: false }, bubbles: true, composed: true
            });
            this.dispatchEvent(selectedEvent);
            this.isRenderCallbackActionExecuted = true;
        }
    }
    get firstThreeField() {
        if (this.state && this.state.fields && this.state.fields.length > 0) {
            let fields = [...this.state.fields];
            return fields.splice(0, 3);
        }
        return [];
    }

    get restField() {
        if (this.state && this.state.fields && this.state.fields.length > 1) {
            let fields = [...this.state.fields];
            return fields.splice(3, this.state.fields.length);
        }
        return [];
    }
    showToggle() {
        this.showMore = !this.showMore;
    }
}