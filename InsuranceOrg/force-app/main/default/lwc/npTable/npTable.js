import { LightningElement } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npTable.html";

export default class npTable extends BaseState(LightningElement) {

    isRenderCallbackActionExecuted = false;

    render() {
        return cardActive;
    }

    renderedCallback() {
        if (this.isRenderCallbackActionExecuted) {
            return;
        }
        if (this.selectedState) {
            const selectedEvent = new CustomEvent('list_header', { detail: { card: this.card, actions: this.actions }, bubbles: true, composed: true });
            this.dispatchEvent(selectedEvent);
            this.isRenderCallbackActionExecuted = true;
        }
    }

    get showactions(){
        if(this.actions && this.actions.length>0){
        return true;
        }
        return false;
    }
}