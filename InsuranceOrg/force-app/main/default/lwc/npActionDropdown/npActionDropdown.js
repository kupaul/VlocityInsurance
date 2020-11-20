import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npActionDropdown.html";
import { newport, loadStyle } from "vlocity_ins/utility";

export default class npActionDropdown extends BaseState(LightningElement) {
    @track actionSelected;
    render() {
        return cardActive;
    }
    connectedCallback() {
        super.connectedCallback();
        Promise.all([
            loadStyle(
                this,
                newport + "/assets/styles/vlocity-newport-design-system.css"
            )
        ])
            .then(() => {
                //this.isNewport = false;
            })
            .catch(() => { });
    }

    actionSelectedChange(event) {
        let actionIndexSelected = parseInt(event.target.value, 10);
        this.actionSelected = actionIndexSelected !== -1 ? this.actions[actionIndexSelected] : null;
    }

    buttonClick(event){
        event.preventDefault();
    }
}