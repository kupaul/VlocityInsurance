import { LightningElement, track } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npClaimToast.html";
export default class npClaimToast extends BaseState(LightningElement) {
    @track toastOpen = true;
    render() {
        return cardActive;
    }
    get firstField() {
        if (this.state && this.state.fields && this.state.fields.length > 0) {
            return this.state.fields[0];
        }
        return [];
    }
    get secondField() {
        if (this.state && this.state.fields && this.state.fields.length > 0) {
            return this.state.fields[1];
        }
        return [];
    }

    removeToast() {
        this.toastOpen = false;
    }
}