import { LightningElement,api } from "lwc";
    import insQuote from "vlocity_ins/insQuote";
    import template from "./insuranceQuoteExtended.html"
    export default class insuranceQuoteExtended extends insQuote{
        // your properties and methods here
        @api recordId;
            @api enableDebugMode;
            @api priceQuoteAsync;
            @api showActions;

        
        render()
          {
            return template;
          }
    }