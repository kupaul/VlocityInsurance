import { BaseCard } from "vlocity_ins/baseCard";                    import { LightningElement, api, track } from "lwc";                    import data from "./definition";                    export default class cfNpSubnavHomeownersLwc_1_vlocityDev extends BaseCard(LightningElement) {                        connectedCallback() {                            this.setDefinition(data);                        }                    }