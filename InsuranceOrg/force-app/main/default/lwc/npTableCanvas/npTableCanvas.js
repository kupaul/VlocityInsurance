import { LightningElement, api, track } from 'lwc';
import ndsTemplate from "./npTableCanvas.html";
import { newport, loadStyle } from "vlocity_ins/utility";
import { BaseLayout } from "vlocity_ins/baseLayout";

export default class npTableCanvas extends BaseLayout(LightningElement) {
    @track cardFields = [];
    @track stateActions=[];
    constructor() {
        super();
        this.template.addEventListener('list_header', this.getHeaders.bind(this));
    }

    connectedCallback() {
        super.connectedCallback();
        Promise.all([
            loadStyle(
                this,
                newport + "/assets/styles/vlocity-newport-design-system.css"
            )
        ])
            .then(() => {
                //this.isNewport = false;
            })
            .catch(() => { });
    }


    render() {
        //  if (this.theme === "nds") {
        return ndsTemplate;
        // }
    }
    get readBorder() {
        let classes = typeof this.session.border !== 'undefined' && this.session.border.length && this.session.border == 'false'
            ? 'nds-canvas'
            : 'nds-canvas nds-card__border';
        return classes;
    }

    getHeaders(event) {
        if (this.cardFields.length === 0) {
            this.cardFields = [...event.detail.card.states[0].fields];
        }
        if (this.stateActions && this.stateActions.length === 0) {
            this.stateActions = event.detail.actions;

        }
    }

     get showactions(){
        if(this.stateActions && this.stateActions.length>0){
        return true;
        }
        return false;
    }

}