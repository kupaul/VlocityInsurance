import { LightningElement, track } from "lwc";
import { BaseLayout } from "vlocity_ins/baseLayout";
import temp from "./subnavCanvas.html";
import { newport, loadStyle } from "vlocity_ins/utility";
export default class subnavCanvas extends BaseLayout(LightningElement) {
    @track privateChildrenRecord = [];
     connectedCallback() {
        super.connectedCallback();
        Promise.all([
            loadStyle(
                this,
                newport + "/assets/styles/vlocity-newport-design-system.css"
            )
        ])
            .then(() => {
                this.isNewport = false;
            })
            .catch(() => { });
        this.template.addEventListener('updateslottabs', this.updateSlotTabs.bind(this));
    }
    get overviewHref() {
        return '/' + window.location.pathname.split('/')[1] + '/' + window.location.pathname.split('/')[2] + '/';
    }
    get imageUrl() {
        return '/' + window.location.pathname.split('/')[1] + '/' + 'resource/vlocity_ins__newport/assets/images/VPL/speedometer.svg';
    }
    
    goToOverview(e) {
        if (e && e.currentTarget) {
            e.currentTarget.parentNode.classList.add('nds-subnav__tabSelected');
        }
        for (let i = 0; i < this.privateChildrenRecord.length; i++) {
            this.privateChildrenRecord[i].callbacks.setActiveState(false);
        }
    }
    render() {
        return temp;
    }

    updateSlotTabs(data) {
        let activeCards = this.template.querySelector('.nds-subnav__wrapper');
        let ActiveCardNodes = activeCards.querySelectorAll('.nds-subnav__tabSelected');
        if (ActiveCardNodes && ActiveCardNodes.length > 0) {
            ActiveCardNodes[0].classList.remove('nds-subnav__tabSelected');
        }
        for (let i = 0; i < this.privateChildrenRecord.length; i++) {
            this.privateChildrenRecord[i].callbacks.setActiveState(true);
        }
    }
    handleChildRegister(event) {
        // Suppress event if it’s not part of the public API
        event.stopPropagation();
        const item = event.detail;
        this.privateChildrenRecord.push(item);
    }
}