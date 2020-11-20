import { LightningElement, api, track } from 'lwc';
import ndsTemplate from "./npBannerCanvas.html";
import { newport, loadStyle } from "vlocity_ins/utility";
import { BaseLayout } from "vlocity_ins/baseLayout";

export default class cnpBannerCanvas extends BaseLayout(LightningElement) {
    @track privateChildrenRecord = [];
    @track showCarouselButton = false;
    @api theme = 'nds';
    @track currentIndex = 0;
    isRenderCallbackActionExecuted = false;
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
    renderedCallback() {
        super.renderedCallback(); 
        if (this.isRenderCallbackActionExecuted) {
            return;
        }
        this.isRenderCallbackActionExecuted = true;

        if (this.privateChildrenRecord && this.privateChildrenRecord.length > 1) {
            this.showCarouselButton = true;
            this.setTimer();
        }
    }

    render() {
        //  if (this.theme === "nds") {
        return ndsTemplate;
        // }
    }
    get readBorder() {
        let classes = typeof this.session.border !== 'undefined' && this.session.border.length && this.session.border == 'true'
            ? 'nds-canvas nds-card__border'
            : 'nds-canvas';
        return classes;
    }

    handleChildRegister(event) {
        // Suppress event if it’s not part of the public API
        event.stopPropagation();
        const item = event.detail;
        // const guid = item.guid;

        //  this.privateChildrenRecord[guid] = item;
        this.privateChildrenRecord.push(item);
        if (this.privateChildrenRecord && this.privateChildrenRecord.length === 1) {
            this.privateChildrenRecord[this.currentIndex].active = true;
            this.privateChildrenRecord[this.currentIndex].callbacks.setShowState(true);
        }

    }

    setTimer() {
        window.setInterval(() => {
            if (this.currentIndex >= this.privateChildrenRecord.length - 1) {
                this.currentIndex = -1;
            }
            this.currentIndex++;
            for (let i = 0; i < this.privateChildrenRecord.length; i++) {
                if (i === this.currentIndex) {
                    this.privateChildrenRecord[this.currentIndex].active = true;
                    this.privateChildrenRecord[this.currentIndex].callbacks.setShowState(true);
                }
                else {
                    this.privateChildrenRecord[i].active = false;
                    this.privateChildrenRecord[i].callbacks.setShowState(false);

                }
            }
        }, 5000);
    }
}