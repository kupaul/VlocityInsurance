import { BaseLayout } from "vlocity_ins/baseLayout";
import { LightningElement, api, track } from "lwc";
import template from "./npBrokerApplicationLayout.html";
import { newport, loadStyle } from "vlocity_ins/utility";
export default class npBrokerApplicationLayout extends BaseLayout(LightningElement) {
    @track tabs = [];
    constructor() {
        super();
        this.template.addEventListener('brokerCard', this.handleSelect.bind(this));

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

        if (this.tabs && this.tabs.length > 0) {
            this.selectObjects();
        }
    }
    handleSelect(event) {
        if (this.tabs) {
            let index = this.tabs.findIndex(x => x.cardTitle.toLowerCase() === event.detail.card.title.toLowerCase())
            if (index !== -1) {
                if (!event.detail.openState)
                    this.tabs[index].no = this.tabs[index].no + 1;
            }
            else {
                let obj = {
                    label: event.detail.card.filter["['Status']"],
                    isActive: false,
                    cardTitle: event.detail.card.title,
                    no: (event.detail.openState ? 0 : 1)
                };
                if (event.detail.card.sessionVars && event.detail.card.sessionVars.length > 1) {
                    let spriteIndex = event.detail.card.sessionVars.findIndex(x => x.name.toLowerCase() === 'sprite');
                    let iconIndex = event.detail.card.sessionVars.findIndex(x => x.name.toLowerCase() === 'icon');
                    if (spriteIndex != -1 && iconIndex != -1) {
                        obj.iconName = (event.detail.card.sessionVars[spriteIndex].val.toLowerCase() + ':' + event.detail.card.sessionVars[iconIndex].val.toLowerCase());
                    }
                }

                if (this.tabs.length === 0) {
                    obj.isActive = true;
                    obj.iconClass = 'nds-color__fill_gray-1';
                }
                let extraClass = obj.isActive == true ? 'active-tab' : '';
                obj.class = 'nds-border--top nds-border--bottom nds-border--left nds-p-horizontal--small nds-p-vertical--xx-small  vloc-broker-tabs ' + extraClass;

                this.tabs.push(obj);
            }
        }

    }
    render() {
        if (this.theme === "nds") {
            return ndsTemplate;
        }
        return template;
    }

    switchTab(event) {
        let targetId = event.currentTarget.dataset.index;
        this.tabs.forEach(tab => {
            tab.isActive = false;
            tab.class = 'nds-border--top nds-border--bottom nds-border--left nds-p-horizontal--small nds-p-vertical--xx-small  vloc-broker-tabs';
            tab.iconClass = '';
        });
        this.tabs[targetId].isActive = true;
        this.tabs[targetId].iconClass = 'nds-color__fill_gray-1';

        this.tabs[targetId].class = 'nds-border--top nds-border--bottom nds-border--left nds-p-horizontal--small nds-p-vertical--xx-small  vloc-broker-tabs active-tab';
    }

    selectObjects() {
        for (let i = 0; i < this._definition.Cards.length; i++) {
            let cardvisible = this.querySelector('c-cf-' + this._definition.Cards[i].replace(/([A-Z])/g, "-$1").toLowerCase());
          
            if (cardvisible) {
                  cardvisible.classList.remove('slds-show', 'nds-show', 'slds-hide', 'nds-hide');
                if (this.tabs[i] && this.tabs[i].isActive) {
                    cardvisible.classList.add('slds-show', 'nds-show');
                }
                else {
                    cardvisible.classList.add('slds-hide', 'nds-hide');
                }
            }
        }
    }
}