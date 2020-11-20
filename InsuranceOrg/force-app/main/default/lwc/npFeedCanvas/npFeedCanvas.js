import { BaseLayout } from "vlocity_ins/baseLayout";
import { LightningElement, api, track } from "lwc";
import template from "./npFeedCanvas.html";
import { newport, loadStyle, debounce } from "vlocity_ins/utility";
import { cloneDeep, findIndex } from "vlocity_ins/lodash";

export default class npFeedCanvas extends BaseLayout(LightningElement) {
    @track privateChildrenRecord = [];
    @track noRecords = false;
    @track hideShowmore = true;
    @api theme;
    sessionLimit;
    remainingStates = 0;
    allRecordsRendered = false;

    connectedCallback() {
        super.connectedCallback();
        if(this.session.limit){
        this.sessionLimit = parseInt(this.session.limit);
        }
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
        if (this.theme === "nds") {
            return ndsTemplate;
        }
        return template;
    }

    renderedCallback() {
        super.renderedCallback();
        if (this.allRecordsRendered) {
            return;
        }
    }
    get readBorder() {
        let classes = typeof this.session.border !== 'undefined' && this.session.border.length && this.session.border == 'false'
            ? 'nds-canvas nds-m-top--medium'
            : 'nds-canvas nds-card__border nds-m-top--medium';
        return classes;
    }
    setLimit() {
        this.sessionLimit = parseInt(this.sessionLimit) + parseInt(this.session.limit);
        this.remainingStates = 0;
        if (this.privateChildrenRecord.length > this.sessionLimit) {
            for (let i = 0; i < this.sessionLimit; i++) {
                this.privateChildrenRecord[i].callbacks.setShowState(false);
                if (i === this.sessionLimit - 1) {
                    this.privateChildrenRecord[i].callbacks.setShowState(true, true);
                }
                else {
                    this.privateChildrenRecord[i].callbacks.setShowState(true);
                }
                this.remainingStates++;
            }
        }
        else {
            for (let i = this.privateChildrenRecord.length - 1; i >= this.remainingStates; i--) {
                this.privateChildrenRecord[i].callbacks.setShowState(false);
                this.privateChildrenRecord[i].callbacks.setShowState(true);
            }
            this.hideShowmore = false;
            this.allRecordsRendered = true;
        }

    }
    //cardSearch
    manipulateData() {
        //overriding the records
        let records = cloneDeep(this.records);
        let filter = this.session.orderBy;
        let sortedRecords = [];
        if (records && records.length > 0 && this.session.orderBy) {
            sortedRecords.push(records.sort((a, b) => new Date(b[filter]).getTime() - new Date(a[filter]).getTime()));
        } else {
            this.sortedRecords = cloneDeep(this.records);
        }
        this.records = sortedRecords[0];
          this.sessionLimit = this.sessionLimit ? this.sessionLimit : parseInt(this.session.limit);
        if (this.records == '') {
            this.hideShowmore = false;
        }
        else if (this.records && this.records.length === 0) {
            this.hideShowmore = false;
        } else if (this.records && this.sessionLimit >= this.records.length) {
            this.hideShowmore = false;
        } else {
            this.hideShowmore = true;
        }
    }

    handleChildRegister(event) {
        event.stopPropagation();
        const item = event.detail;
        this.privateChildrenRecord.push(item);
        this.sessionLimit = this.sessionLimit ? this.sessionLimit : parseInt(this.session.limit);
        if (this.privateChildrenRecord.length <= this.sessionLimit) {
            if (this.privateChildrenRecord.length === parseInt(this.sessionLimit, 10)) {
                this.privateChildrenRecord[this.privateChildrenRecord.length - 1].callbacks.setShowState(true, true);
            }
            else {
                this.privateChildrenRecord[this.privateChildrenRecord.length - 1].callbacks.setShowState(true);
            }
        }
    }
}