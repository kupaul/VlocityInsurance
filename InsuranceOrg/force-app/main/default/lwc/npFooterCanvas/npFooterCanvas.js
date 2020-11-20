import { LightningElement } from 'lwc';

import template from "./npFooterCanvas.html";
import { newport, loadStyle } from "vlocity_ins/utility";
import { BaseLayout } from "vlocity_ins/baseLayout";

export default class npFooterCanvas extends BaseLayout(LightningElement) {
    constructor() {
        super();
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
}