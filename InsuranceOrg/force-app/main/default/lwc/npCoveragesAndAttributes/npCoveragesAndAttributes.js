import { LightningElement, track, api } from "lwc";
import { BaseState } from "vlocity_ins/baseState";
import cardActive from "./npCoveragesAndAttributes.html";
import util from "vlocity_ins/utility";

export default class npCoveragesAndAttribute extends BaseState(LightningElement) {

    @track coverageType;
    @track coverageSpecClass;
    @track rows = [];
    @track _session;

    @api set session(val) {
        this._session = val;
    } get session() {
        return this._session;
    }
    isRenderCallbackActionExecuted = false;

    render() {
        return cardActive;
    }
    /* setting class for the attributes based on coverage type */
    get attrClass() {
        if (this.coverageType.toLowerCase() === 'coveragespec')
            return 'nds-col_bump-left nds-large-size--11-of-12 nds-medium-size--10-of-12 nds-small-size--12-of-12 nds-x-small-size--12-of-12';
        else
            return 'nds-large-size--6-of-12 nds-medium-size--6-of-12 nds-small-size--12-of-12 nds-x-small-size--12-of-12 nds-p-right--small';

    }

    renderedCallback() {
        super.renderedCallback();
        /* setting isRenderCallbackActionExecuted variable only once so that rows are created only once */
        if (this.isRenderCallbackActionExecuted) {
            return;
        }
        if (this.selectedState) {
            this.records = [];
            this.nsPrefix = util.namespace;
            if (this.session && this.session.RecordType) {
                /* Filtering data based on the coverageType provided in session
                 and creating rows from the childProducts */
                this.coverageType = this.session.RecordType.toLowerCase();
                if (this.obj.hasOwnProperty('childProducts') && this.coverageType == "coveragespec") {
                    for (let i = 0; i < this.obj.childProducts.records.length; i++) {
                        if (this.obj.childProducts.records[i][this.nsPrefix + 'RecordTypeName__c'].toLowerCase() === this.coverageType || (this.obj.childProducts.records[i].lineRecordType && this.obj.childProducts.records[i].lineRecordType.toLowerCase() === this.coverageType)) {
                            this.records.push(this.obj.childProducts.records[i]);
                            if (this.records.length === 1) {
                                this.records[this.records.length - 1] = Object.assign({}, this.records[this.records.length - 1]);
                                this.records[this.records.length - 1].groupName = this.obj.Name;
                            }
                        }
                    }
                } else {
                    this.records.push(this.obj);
                }
                if (this.coverageType.toLowerCase() === 'coveragespec') {
                    this.records = this.records.filter(x => x.isSelected === true);
                }
                this.setDataAttrbutes();
            }
            this.rows = [...this.records];

            this.isRenderCallbackActionExecuted = true;
        }
    }

    /* creating attributes for each data  from the attributeCategories record*/
    setDataAttrbutes() {
        for (let m = 0; m < this.records.length; m++) {
            this.records[m] = Object.assign({}, this.records[m]);
            this.records[m].attrs = [];
            if (this.records[m][this.nsPrefix + 'RecordTypeName__c'].toLowerCase() === this.coverageType.toLowerCase()
                || this.records[m].lineRecordType.toLowerCase() === this.coverageType.toLowerCase()) {
                this.coverageSpecClass = 'nds-show';
            } else
                this.coverageSpecClass = 'nds-hide';
            if (this.records[m].attributeCategories && this.records[m].attributeCategories.records) {
                for (let i = 0; i < this.records[m].attributeCategories.records.length; i++) {
                    if (this.records[m].attributeCategories.records[i].nameResult) {
                        for (let j = 0; j < this.records[m].attributeCategories.records[i].nameResult.productAttributes.records.length; j++) {
                            this.records[m].attrs.push(this.records[m].attributeCategories.records[i].nameResult.productAttributes.records[j]);
                        }
                    } else if (!this.records[m].attributeCategories.records[i].nameResult && this.records[m].attributeCategories.records[i].productAttributes) {
                        for (let j = 0; j < this.records[m].attributeCategories.records[i].productAttributes.records.length; j++) {
                            this.records[m].attrs.push(this.records[m].attributeCategories.records[i].productAttributes.records[j]);
                        }
                    }
                }
            }
        }
    }

    /* handling expand/collapse using showMore property of rows */
    showHideData(event) {
        let targetId = event.currentTarget.dataset.attrIndex;
        this.rows[targetId].showMore = !this.rows[targetId].showMore;
    }

}