import { BaseLayout } from "vlocity_ins/baseLayout";
import { LightningElement, track } from "lwc";
import template from "./storyCardCanvasInteraction.html";
import { cloneDeep, findIndex } from "vlocity_ins/lodash";

export default class storyCardCanvasInteraction extends BaseLayout(LightningElement) {
  @track menu = [];
  @track noRecords = false;

  _menuItemObj = [];

  connectedCallback() {
    super.connectedCallback();
    if (this.session && this.session.actions) {
      this._menuItemObj = this.session.actions.split(",");
    }
    this.setMenuItem();
  }

  setMenuItem() {
    this.menu = [];
    this._menuItemObj.forEach((objName, index) => {
      let objSplit = objName.split(":");
      this.menu.push({
        id: index,
        value: objSplit[0].trim(),
        label: objSplit[1] ? objSplit[1].trim() : objSplit[0].trim(),
        url: `/lightning/o/${objSplit[0].trim()}/new`
      });
    });
  }

  render() {
    return template;
  }

  /*Generic method that gets called before layout sets records to cards*/
  manipulateData() {
    //overriding the records
    let records = cloneDeep(this.records);
    if (records && records.length > 0) {
      if (records[0].actionFields && records[0].actionFields.length > 0) {
        this._menuItemObj = records[0].actionFields;
        this.setMenuItem();
      }
      if (records[0].onGoing) {
        records[0].showTitle = true;
      }
      let index = findIndex(records, { onGoing: false });
      if (index !== -1 && records[index].onGoing === false) {
        records[index].showTitle = true;
      }
    } else {
      this.noRecords = true;
    }
    this.records = records;
  }
}