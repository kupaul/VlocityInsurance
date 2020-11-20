import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npHeader.html";
import { newport, loadStyle } from "vlocity_ins/utility";

export default class npHeader extends BaseState(LightningElement) {
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
    get thirdField() {
        if (this.state && this.state.fields && this.state.fields.length > 0) {
            return this.state.fields[2];
        }
        return [];
    }

    get firstAction() {
        if (this.actions && this.actions.length > 0) {
            return this.actions[0];
        }
    }

    get restField() {
        if (this.state && this.state.fields && this.state.fields.length > 2) {
            let fields = [...this.state.fields];
            return fields.splice(3, this.state.fields.length);
        }
        return [];
    }

}