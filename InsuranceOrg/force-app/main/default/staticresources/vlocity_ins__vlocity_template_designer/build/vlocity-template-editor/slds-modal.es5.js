/*! Built with http://stenciljs.com */
VlocityTemplateEditor.loadBundle("slds-modal",["exports","./chunk-655d8ce7.js"],function(e,t){var l,s=window.VlocityTemplateEditor.h;!function(e){e.close="esc"}(l||(l={}));var o=function(){function e(){this.size="",this.enableClose=!0,this.sizeClass=[],this.modalId=this.modalId||"modal-"+Date.now(),(new t.ShortcutKeys).bindGlobal(l.close,this.removeModal,this),this.sizeClass[""]="",this.sizeClass.medium="slds-modal_medium",this.sizeClass.large="slds-modal_large"}return e.prototype.removeModal=function(){var e=document.querySelector("#"+this.modalId).parentElement;e.parentNode.removeChild(e)},e.prototype.componentDidUnload=function(){},e.prototype.componentDidLoad=function(){var e=document.createElement("div");e.classList.add("slds-backdrop"),e.classList.add("slds-backdrop--open"),document.querySelector("#"+this.modalId).parentElement.appendChild(e),this.modalRendered.emit()},e.prototype.render=function(){var e=this;return s("div",{class:"slds-modal slds-fade-in-open "+this.sizeClass[this.size],id:this.modalId},s("div",{class:"slds-modal__container"},s("div",{class:"slds-modal__header"},s("h2",{class:"slds-text-heading--medium"},this.title)),s("div",{class:"slds-modal__content slds-grid slds-grid--vertical"},s("div",{class:"slds-p-horizontal_x-large slds-scrollable model-content"},s("div",{id:"modalError",class:"slds-text-color--error"}),s("div",{class:"",role:"alert"},s("slot",{name:"modal-content"})))),s("div",{class:"slds-modal__footer"},s("slot",{name:"modal-footer"}),s("button",{type:"button",class:"slds-button slds-button--neutral "+(this.enableClose?"":"slds-hide"),onClick:function(){return e.removeModal()}},"Close"))))},Object.defineProperty(e,"is",{get:function(){return"slds-modal"},enumerable:!0,configurable:!0}),Object.defineProperty(e,"properties",{get:function(){return{enableClose:{type:Boolean,attr:"enable-close"},modalId:{type:String,attr:"modal-id"},size:{type:String,attr:"size"},title:{type:String,attr:"title"}}},enumerable:!0,configurable:!0}),Object.defineProperty(e,"events",{get:function(){return[{name:"modalRendered",method:"modalRendered",bubbles:!0,cancelable:!0,composed:!0}]},enumerable:!0,configurable:!0}),Object.defineProperty(e,"style",{get:function(){return".template-search-box{position:fixed;width:100%;background:#fff;left:0;margin-top:24px;z-index:99}.template-selector{cursor:pointer;border-bottom:1px solid rgba(128,128,128,.17)}.template-selector:hover{color:#0f75d4}.custom-tab{position:fixed;width:100%;left:0;z-index:99;background:#fff}.template-list{margin-top:70px}.new-template-content{margin-top:35px}.model-content{height:100%}"},enumerable:!0,configurable:!0}),e}();e.SldsModal=o,Object.defineProperty(e,"__esModule",{value:!0})});