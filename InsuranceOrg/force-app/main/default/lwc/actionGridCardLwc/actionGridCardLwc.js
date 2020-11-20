import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./actionGridCardLwc.html";
import { newport, loadStyle } from "vlocity_ins/utility";

export default class cactionGridCardLwc extends BaseState(LightningElement) {
    render() {
        return cardActive;
    }
    connectedCallback() {
        super.connectedCallback();
    }
   
}