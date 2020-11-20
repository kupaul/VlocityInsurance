/*! Built with http://stenciljs.com */
const{h:t}=window.VlocityTemplateEditor;class s{constructor(){}showLookup(t,s){console.log(t);let e=t.target;s?e.parentElement.parentElement.classList.add("slds-is-open"):e.parentElement.parentElement.classList.remove("slds-is-open")}selectValue(t){this.value=t}filterOptions(t){let s=t.target;this.value=s.value,this.options="string"==typeof this.options?this.options.split(","):this.options,this.filteredOptions=this.options.filter(t=>t.toLowerCase().includes(s.value.toLowerCase()))}componentDidUnload(){}componentDidLoad(){this.comboid=this.comboid?this.comboid:"text"+Date.now(),this.type=this.type?this.type:"text",this.value=this.value?this.value:"",this.placeholder=this.placeholder?this.placeholder:"",this.required=!!this.required&&this.required}render(){return this.filteredOptions=this.filteredOptions?this.filteredOptions:"string"==typeof this.options?this.options.split(","):this.options,t("div",null,t("div",{class:"slds-form-element"},t("label",{class:"slds-form-element__label",htmlFor:"combobox-id-1"},this.required?t("abbr",{class:"slds-required",title:"required"},"* "):"",this.label),t("div",{class:"slds-form-element__control"},t("div",{class:"slds-combobox_container"},t("div",{class:"slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click","aria-expanded":"false","aria-haspopup":"listbox",role:"combobox"},t("div",{class:"slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right",role:"none"},t("input",{type:"text",class:"slds-input slds-combobox__input",id:this.comboid,"aria-autocomplete":"list",value:this.value,"aria-controls":"listbox-id-1",autocomplete:"off",role:"textbox",placeholder:this.placeholder,onInput:t=>this.filterOptions(t),onFocus:()=>this.showLookup(event,!0),onBlur:()=>this.showLookup(event,!1)}),t("span",{class:"slds-icon_container slds-icon-utility-search slds-input__icon slds-input__icon_right"},t("svg",{class:"slds-icon slds-icon slds-icon_x-small slds-icon-text-default","aria-hidden":"true"}))),this.filteredOptions.length>0?t("div",{id:"listbox-id-1",class:"slds-dropdown slds-dropdown_length-with-icon-7 slds-dropdown_fluid",role:"listbox"},t("ul",{class:"slds-listbox slds-listbox_vertical",role:"presentation"},this.filteredOptions.map(s=>t("li",{role:"presentation",class:"slds-listbox__item",onMouseDown:()=>this.selectValue(s)},t("div",{class:"slds-media slds-listbox__option slds-listbox__option_entity slds-listbox__option_has-meta",role:"option"},t("span",{class:"slds-media__body"},t("span",{class:"slds-listbox__option-text slds-listbox__option-text_entity"},s))))))):"")))))}static get is(){return"slds-combobox"}static get properties(){return{comboid:{type:String,attr:"comboid",mutable:!0},filteredOptions:{state:!0},label:{type:String,attr:"label",mutable:!0},options:{type:"Any",attr:"options",mutable:!0},placeholder:{type:String,attr:"placeholder",mutable:!0},required:{type:Boolean,attr:"required",mutable:!0},type:{type:String,attr:"type",mutable:!0},value:{type:String,attr:"value",mutable:!0}}}static get style(){return""}}export{s as SldsCombobox};