import { LightningElement, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npSummary.html";
import { fieldTrackingObj, initInteraction } from "vlocity_ins/utility";
import { get } from "vlocity_ins/lodash";

export default class npSummary extends BaseState(LightningElement) {

    get firstField() {
        if (this.state && this.state.fields && this.state.fields.length > 0) {
            return this.state.fields[0];
        }
        return [];
    }

    get getImageSrc() {
        if (this.session && this.session.img) {
            return '/' + window.location.pathname.split('/')[1] + this.session.img;
        }
        return '';
    }
    get restField() {
        if (this.state && this.state.fields && this.state.fields.length > 1) {
            let fields = [...this.state.fields];
            return fields.splice(1, this.state.fields.length);
        }
        return [];
    }

    // eslint-disable-next-line consistent-return
    render() {
        return cardActive;
    }
}