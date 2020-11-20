import { LightningElement, track, api } from 'lwc';
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npBanner.html";

export default class cnpBanner extends BaseState(LightningElement) {
    @track getClass = 'nds-hide';
    @track imageSrc;
    @track imageUrl;
    @api setShowState = (value) => {
        if (value)
            this.getClass = 'nds-show';
        else
            this.getClass = 'nds-hide';

    }
    isRenderCallbackActionExecuted = false;

    render() {
        return cardActive;

    }

    connectedCallback() {
        this.imageSrc = this.getImageUrl();
        this.imageUrl = 'background-image: url(' + this.imageSrc + ')';
        const itemregister = new CustomEvent('privateitemregister', {
            bubbles: true,
            detail: {
                callbacks: {
                    setShowState: this.setShowState
                },
                template: this.template,
                active: false
            }
        });

        this.dispatchEvent(itemregister);
    }

    getImageUrl() {
        let imageId = null;
        if (this.obj && this.obj.attachment) {
            Object.keys(this.obj.attachment).forEach((key) => {
                if (!imageId) {
                    imageId = this.obj.attachment[key];
                }
            });
            return '/servlet/servlet.FileDownload?file=' + imageId;
        }
        return '';
    }
}