import { LightningElement, api, track } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import sldsTemplate from "./cardHorizOpenLwc.html";

export default class ccardHorizOpenLwc extends BaseState(LightningElement) {
    
     get firstAction() {
        if (this.actions && this.actions.length > 0) {
            return this.actions[0];
        }
        return undefined;
    }
    render() {
        return sldsTemplate;
    }
}