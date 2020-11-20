import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import template from "./npGlobalOpen.html";

export default class cnpGlobalOpen extends BaseState(LightningElement) {
    
    render() {
        return template;
    }
}