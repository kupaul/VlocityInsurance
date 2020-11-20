import { LightningElement } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npPolicyPremium.html";
import { get } from "vlocity_ins/lodash";

export default class npPolicyPremium extends BaseState(LightningElement) {
  get firstField() {
    if (this.state && this.state.fields && this.state.fields.length > 0) {
      return this.state.fields[0];
    }
    return [];
  }
  get restField() {
    if (this.state && this.state.fields && this.state.fields.length > 1) {
      let fields = [...this.state.fields];
      return fields.splice(1, this.state.fields.length);
    }
    return [];
  }
  render() {
    return cardActive;
  }
}