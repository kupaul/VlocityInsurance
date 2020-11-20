import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npFindAgent.html";

export default class cnpFindAgent extends BaseState(LightningElement) {
    @track zipCode = '';
    @track validation;
    render() {
        return cardActive;

    }
    connectedCallback() {

    }

    // get getValidation() {
    //     let input = this.template.querySelector('input[name="zipCode"]');
    //     if (input === null || input.validity.valueMissing) return false;
    //     else return true;
    // }

    zipcodeChange(event) {
        this.zipCode = event.target.value;
        if (this.zipCode.length === 0)
            this.validation = true;
    }

    submitForm(ev) {
        ev.preventDefault();
        let form = this.template.querySelector('form[name="quoteForm"]');
        if (form.checkValidity()) {
            let action = ev.currentTarget;
            action.triggerAction();
        }
    }
}