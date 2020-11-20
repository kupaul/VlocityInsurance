import { LightningElement, api, track } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
export default class MyCustomLwc extends OmniscriptBaseMixin(LightningElement) {
   @track _insuredItemRecord = "";
   @api set insuredItemRecord(val) {
       console.log('@@@', val);
    if(val) {
      this._insuredItemRecord = val;
    }
   }
   get insuredItemRecord() {
     return this._insuredItemRecord;
   }
   selectRecords(evnt){
    let selectedRecordId = evnt.currentTarget.getAttribute("data-id");
    const eachCardEle = this.template.querySelector('.nds-card__header.selected');
    if(eachCardEle) {
        eachCardEle.classList.remove('selected');
    }
    evnt.currentTarget.classList.add('selected');
    this.omniUpdateDataJson({"selectedInsuredId":selectedRecordId});
   }
   get getSvgStyle() {
      return "fill: #fff;position: relative;z-index: 1;width: 1.4rem;left: -4px;top: 6px;";
    }
  
 
}