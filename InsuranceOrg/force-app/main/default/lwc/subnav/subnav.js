import { LightningElement, track, api } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import sldsTemplate from "./subnav.html";

export default class subNav extends BaseState(LightningElement) {
    @track active = false;
    @api setActiveState = (value) => {
        let ActiveCardNodes = this.template.querySelectorAll('.nds-subnav__tabSelected');
        if (ActiveCardNodes && ActiveCardNodes.length > 0) {
            ActiveCardNodes[0].classList.remove('nds-subnav__tabSelected');
        }
        if (value)
            this.active = this.active ? false : this.active;
        else
            this.active = false;
    }
    get cardState() {
        let states = this.obj.Id;
        return states;
    }
    get firstAction() {
        if (this.actions && this.actions.length > 0) {
            return this.actions[0];
        }
        return undefined;
    }
    get imageUrl() {
        if (this.session && this.session.BIcon) {
            return '/' + window.location.pathname.split('/')[1] + this.session.BIcon;
        }
        return '';
    }

    get restAction() {
        if (this.actions && this.actions.length > 1) {
            let actions = [...this.actions];
            return actions.splice(1, actions.length);
        }
        return [];
    }
    connectedCallback() {
        const itemregister = new CustomEvent('privateitemregister', {
            bubbles: true,
            detail: {
                callbacks: {
                    setActiveState: this.setActiveState
                },
                template: this.template
            }
        });

        this.dispatchEvent(itemregister);
    }
    selectSubNav(e) {
        if (e && e.currentTarget) {
            this.active = true;
            const deleteOtherSelectedTab = new CustomEvent('updateslottabs', {
                bubbles: true,
                composed:true
            });
            this.dispatchEvent(deleteOtherSelectedTab);
            e.currentTarget.parentNode.classList.add('nds-subnav__tabSelected');
        }
    }
    // eslint-disable-next-line consistent-return
    render() {
        return sldsTemplate;
    }
}