import { BaseCard } from "vlocity_ins/baseCard";                    import { LightningElement, api, track } from "lwc";                    import data from "./definition";                    export default class cfNpAccountFeedLwc_1_Vlocity extends BaseCard(LightningElement) {                        connectedCallback() {                            this.setDefinition(data);                        }                    }