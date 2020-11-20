export const definition = {
  previewAttrs: {
    default: {
      selectedState: true,
      session: {
        APIKEY: null,
        location: "312 Constitution Place\nAustin, TX 78767\nUSA Austin TX"
      },
      card: { title: "Open Me" },
      obj: {
        attributes: {
          type: "Account",
          url: "/services/data/v46.0/sobjects/Account/0013t00001a7uq8AA2"
        },
        Id: "0013t00001a7uq8AA2",
        Name: "Edge Communication 1",
        BillingAddress: {
          city: "Austin",
          country: null,
          geocodeAccuracy: null,
          latitude: null,
          longitude: null,
          postalCode: null,
          state: "TX",
          street: "312 Constitution Place\nAustin, TX 78767\nUSA"
        },
        test_pd__CalculatedAddress__c:
          "312 Constitution Place\nAustin, TX 78767\nUSA Austin TX",
        Phone: "(512) 757-6000",
        Type: "Customer - Direct",
        CurrencyIsoCode: "INR"
      },
      state: {
        fields: [
          {
            name: "['Type']",
            label: "Type",
            displayLabel: "['Type']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          },
          {
            name: "['Phone']",
            label: "Phone",
            displayLabel: "['Phone']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          }
        ],
        definedActions: {
          actions: [
            {
              type: "Vlocity Action",
              id: "Account Action",
              displayName: "Account Action",
              iconName: "icon-v-document1-line",
              collapse: true,
              isCustomAction: false,
              hasExtraParams: false
            },
            {
              type: "Vlocity Action",
              id: "Account Alert",
              displayName: "Account Alert",
              iconName: "icon-v-archive",
              test_pd__InvokeClassName__c: "testclass",
              test_pd__InvokeMethodName__c: "testmethod",
              collapse: true,
              isCustomAction: false,
              hasExtraParams: false
            },
            {
              type: "Vlocity Action",
              id: "Account Maint 1 AAL",
              displayName: "Add A Line",
              iconName: "icon-v-plus",
              collapse: true,
              isCustomAction: false,
              hasExtraParams: false
            }
          ]
        },
        name: "Active"
      }
    }
  }
};