export const definition = {
  previewAttrs: {
    default: {
      selectedState: true,
      card: { title: "Card Title" },
      session: {
        img:
          "https://www.91-img.com/pictures/129546-v3-apple-iphone-xs-mobile-phone-large-1.jpg",
        status: "inactive"
      },
      obj: {
        Price: 1200,
        Plan: "128 GB",
        Image:
          "https://www.91-img.com/pictures/129546-v3-apple-iphone-xs-mobile-phone-large-1.jpg",
        "Device ID": "0000 7862 1723 8726 8721",
        IMEI: "231236123128736",
        name: "IPhone X",
        accountId: "0013t00001a7uq7AAA",
        Id: "02i3t00000QYBFgAAM",
        firstName: "Ayush"
      },
      state: {
        "smartAction": {
        "inputMap": {
          "pageSize": "5",
          "ContextId": "02i3t00000QYBFnAAE"
        },
        "ipMethod": "Smartcard_Policy"
      },
        definedActions: {
          actions: [
            {
            "collapse": true,
            "hasExtraParams": false,
            "id": "VPL-InteractionTopicPolicy-ViewDetails",
            "isCustomAction": false,
            "type": "Vlocity Action"
          },
          {
            "collapse": true,
            "hasExtraParams": false,
            "id": "InteractionPolicy-PayPremium",
            "isCustomAction": false,
            "type": "Vlocity Action"
          }
          ]
        },
        fields: [
          {
            name: "['name']",
            label: "Model",
            displayLabel: "['name']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true,
            editing: false
          },
          {
            name: "['Device ID']",
            label: "Device ID",
            displayLabel: "['Device ID']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          },
          {
            name: "['Plan']",
            label: "Plan",
            displayLabel: "['Plan']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          },
          {
            name: "['IMEI']",
            label: "IMEI",
            displayLabel: "['IMEI']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          },
          {
            name: "['Price']",
            label: "Price",
            displayLabel: "['Price']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          }
        ]
      }
    }
  }
};