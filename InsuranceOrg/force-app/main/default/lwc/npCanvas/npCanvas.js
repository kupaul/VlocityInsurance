import { BaseLayout } from "vlocity_ins/baseLayout";
import { LightningElement, api } from "lwc";
import template from "./npCanvas.html";
import { newport, loadStyle, debounce } from "vlocity_ins/utility";
export default class cnpCanvas extends BaseLayout(LightningElement) {
  @api theme = 'nds';

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
      .catch(() => {});
  }
  

  render() {
    return template;
  }
 get readBorder() {
     let classes = typeof this.session.border !== 'undefined' && this.session.border.length && this.session.border == 'false'
        ? 'nds-canvas nds-m-top--medium'
        : 'nds-canvas nds-card__border nds-m-top--medium';
    return classes;
  }
  searchCard = debounce(target => {
    const searchKey = target.value;
    this.setSearchParam(searchKey);
  }, 500);

  //cardSearch
  setSearchParam(search) {
    this.allRecords = this.allRecords ? this.allRecords : this.records;
    if (this.allRecords) {
      if (search) {
        let data = [...this.allRecords];
        let filteredRecords = [];
        data.forEach(element => {
          for (let key in element) {
            if (element.hasOwnProperty(key)) {
              let val = element[key];
              if (typeof val == "string" && val.indexOf(search) !== -1) {
                filteredRecords.push(element);
              }
            }
          }
        });
        this.records = filteredRecords;
      } else {
        this.records = [...this.allRecords];
      }
      this.setCardsRecords();
    }
  }
}