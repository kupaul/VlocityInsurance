import { LightningElement, api } from 'lwc';
import { formatCurrency } from "vlocity_ins/utility";

export default class outputProductAttributes extends LightningElement {
    @api attribute;
    connectedCallback() {
    }

    get fieldValue() {
        if (this.attribute.dataType.toLowerCase() === 'currency') {
            return this.formatCurrency(this.attribute.userValues);
        }
        else {
            return this.attribute.userValues;
        }
    }
    formatCurrency(amount) {
        try {
            let value = formatCurrency(amount, {
                anlocale: "en-US",
                money: "USD"
            });
            return value;
        } catch (e) {
            // handle error
        }
    }
}