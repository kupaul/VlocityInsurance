import { LightningElement } from "lwc";
    import insRecordEditor from "vlocity_ins/insRecordEditor";
    import template from "./autoInsuranceRecordEditorExtended.html"
    export default class autoInsuranceRecordEditorExtended extends insRecordEditor{
        // your properties and methods here
        
        render()
          {
            return template;
          }
    }