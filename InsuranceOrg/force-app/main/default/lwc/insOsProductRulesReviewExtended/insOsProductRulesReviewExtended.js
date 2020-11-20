import { LightningElement, api } from 'lwc';

import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';

export default class insOsProductRulesReviewExtended extends OmniscriptBaseMixin(LightningElement) {
    @api
    get rules() {
        return this._rules;
    }

    set rules(data) {
        this._rules = data;
    }

    //Returns the list of rules given omniJsonDef structure'
    get rulesList() {
        console.log('this.rules', this.rules);
        let queue = [];
        if (this.rules) {
            let count = 1;
            for (let instanceKey in this.rules) {
                if (this.rules[instanceKey]) {
                    this.rules[instanceKey].forEach((detail, index) => {
                        let rule = JSON.parse(JSON.stringify(detail.ruleDetails));
                        rule.requirementName = detail.ruleDetails['requirement name'];
                        rule.count = count;
                        rule.uniqueKey = rule.requirementName + '_' + index + '_' + Math.random();
                        queue.push(rule);
                        count++;
                    });
                }
            }
        }
        console.log('queue', queue);
        return queue;
    }
}