import { masterLayout } from "vlocity_ins/masterLayout";                                import { LightningElement, api, track } from "lwc";                                import data from "./definition";export default class cfDiegoTest extends masterLayout(LightningElement) {@api recordId;@api theme;@api debug;connectedCallback() {                            super.connectedCallback();                            this.definition = data;}}