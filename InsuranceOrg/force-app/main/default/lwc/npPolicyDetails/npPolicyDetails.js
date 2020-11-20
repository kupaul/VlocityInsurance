import { LightningElement, track } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npPolicyDetails.html";
import { get } from "vlocity_ins/lodash";
// import data from "./def";
export default class cnpPolicyDetailsPlus extends BaseState(LightningElement)
{
    @track showMore;
    render() {
        return cardActive;
    }
    connectedCallback() {
        this.showMore = false;
    }
    get firstField() {
    if (this.state && this.state.fields && this.state.fields.length > 0) {
      return this.state.fields[0];
    }
    return [];
  }
    get defaultField() {
        if (this.state && this.state.fields && this.state.fields.length > 1) {
            let fields = [...this.state.fields];
            return fields.splice(1, 4);
        }
        return [];
    }

    get restField() {
        if (this.state && this.state.fields && this.state.fields.length > 1) {
            let fields = [...this.state.fields];
            return fields.splice(5, this.state.fields.length);
        }
        return [];
    }
    get defaultActions() {
    if (this.actions && this.actions.length > 0) {
        let action = [...this.actions];
        return action.splice(0, 4);
    //  return this.actions[0];
    }
    return [];
  }

  get restActions() {
    if (this.actions && this.actions.length > 1) {
      let action= [...this.actions];
      return action.splice(4, action.length);
    }
    return [];
  }
    showToggle() {
        this.showMore = !this.showMore;
    }
}