import { BaseCard } from "vlocity_ins/baseCard";                    import { LightningElement, api, track } from "lwc";                    import data from "./definition";                    export default class cfVPLIntPolicyBOP_1_VlocityIBO extends BaseCard(LightningElement) {                        connectedCallback() {                            this.setDefinition(data);                        }                    }