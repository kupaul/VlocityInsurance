import { LightningElement, track } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./cardHorizActiveLwc.html";
import { get } from "vlocity_ins/lodash";
    
export default class cpcardHorizActiveLwc extends BaseState(LightningElement) {
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
   get firstAction() {
        if (this.actions && this.actions.length > 0) {
            return this.actions[0];
        }
   }
  render() {
      return cardActive;
    }
    }