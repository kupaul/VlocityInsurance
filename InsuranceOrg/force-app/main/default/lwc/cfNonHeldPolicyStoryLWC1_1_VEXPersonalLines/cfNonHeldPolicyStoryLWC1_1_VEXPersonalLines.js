import { BaseCard } from "vlocity_ins/baseCard";                    import { LightningElement, api, track } from "lwc";                    import data from "./definition";                    export default class cfNonHeldPolicyStoryLWC1_1_VEXPersonalLines extends BaseCard(LightningElement) {                        connectedCallback() {                            this.setDefinition(data);                        }                    }