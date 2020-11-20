import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npActions.html";
import { newport, loadStyle } from "vlocity_ins/utility";

export default class cnpActions extends BaseState(LightningElement) {
    render() {
        return cardActive;
    }
    connectedCallback() {
        super.connectedCallback();
    }
   
}