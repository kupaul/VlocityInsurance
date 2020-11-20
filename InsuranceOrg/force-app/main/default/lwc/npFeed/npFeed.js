import { LightningElement, track, api } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npFeed.html";
import { fieldTrackingObj, initInteraction } from "vlocity_ins/utility";
import { get } from "vlocity_ins/lodash";

export default class npfeed extends BaseState(LightningElement) {
    @track getClass = 'nds-hide';
    @api setShowState = (value, lastElementToShow) => {
        if (value)
            this.getClass = lastElementToShow ? 'nds-show lastShowEle' : 'nds-show';
        else
            this.getClass = 'nds-hide'; 
    }
    connectedCallback() {
        if (this.obj) {
            const itemregister = new CustomEvent('privateitemregister', {
                bubbles: true,
                detail: {
                    callbacks: {
                        setShowState: this.setShowState
                    }
                }
            });

            this.dispatchEvent(itemregister);
        }
    }
    get firstField() {
        if (this.state && this.state.fields && this.state.fields.length > 0) {
            return this.state.fields[0];
        }
        return [];
    }
    get secondField() {
        if (this.state && this.state.fields && this.state.fields.length > 1) {
            return this.state.fields[1];
        }
        return [];
    }
    get thirdField() {
        if (this.state && this.state.fields && this.state.fields.length > 1) {
            return this.state.fields[2];
        }
        return [];
    }

    get restField() {
        if (this.state && this.state.fields && this.state.fields.length > 2) {
            let fields = [...this.state.fields];
            return fields.splice(2, this.state.fields.length);
        }
        return [];
    }

    // eslint-disable-next-line consistent-return
    render() {
        return cardActive;
    }
}