import { masterLayout } from "vlocity_ins/masterLayout";                                import { LightningElement, api, track } from "lwc";                                import data from "./definition";import { OmniscriptBaseMixin } from "vlocity_ins/omniscriptBaseMixin";                                export default class cfNpActionDropdownLwc extends OmniscriptBaseMixin(masterLayout(LightningElement)) {@api recordId;@api theme;@api debug;connectedCallback() {                            super.connectedCallback();                            this.definition = data;/* Call omniUpdateDataJson to update the omniscript                                 this.omniUpdateDataJson({"key":"value"});*/}}