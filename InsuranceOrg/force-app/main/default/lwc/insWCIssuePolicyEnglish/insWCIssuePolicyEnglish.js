import { api, track } from 'lwc';
import OmniscriptHeader from 'vlocity_ins/omniscriptHeader';
import { allCustomLabels } from 'vlocity_ins/omniscriptCustomLabels';
import { OMNIDEF } from './insWCIssuePolicyEnglish_def.js';
import tmpl from './insWCIssuePolicyEnglish.html';
import tmpl_nds from './insWCIssuePolicyEnglish_nds.html';

/**
 *  IMPORTANT! Generated class DO NOT MODIFY
 */
export default class insWCIssuePolicyEnglish extends OmniscriptHeader {
    @track jsonDef = {};
    @track resume = false;
    @api get inline() {
        return this._inline;
    }
    set inline(value) {
        this._inline = String(value) === 'true';
    }
    _inline = false;
    @api inlineLabel;
    @api inlineVariant;
    @api layout;
    @api recordId;

    connectedCallback() {
        // We don't need the full JSON def if we are opening a save for later
        this.jsonDef = this.instanceId ?
                        {
                            sOmniScriptId: OMNIDEF.sOmniScriptId,
                            lwcId: OMNIDEF.lwcId,
                            labelMap: OMNIDEF.labelMap,
                            propSetMap: OMNIDEF.propSetMap,
                            bpType: OMNIDEF.bpType,
                            bpSubType: OMNIDEF.bpSubType,
                            bpLang: OMNIDEF.bpLang
                        } :
                        JSON.parse(JSON.stringify(OMNIDEF));
        this.resume = !!this.instanceId;
        super.connectedCallback();
    }

    handleContinueInvalidSfl() {
        this.jsonDef = JSON.parse(JSON.stringify(OMNIDEF));
        super.handleContinueInvalidSfl();
    }

    render() {
        return this.layout === 'newport' ? tmpl_nds : tmpl;
    }
}