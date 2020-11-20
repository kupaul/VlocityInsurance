export const definition = {
  previewAttrs: {
    default: {
      selectedState: true,
      card: { title: "Card Active" },
      session: {
        rightIcon: "standard:article"
      },
      obj: {
        type: "Vlocity Action",
        iconName: "icon-v-payment-line",
        displayName: "Validate SIM",
        id: "Manage Payments",
        description: "New description from vlocity action object New description from"
      },
      state: {
        definedActions: {
          actions: [
            {
              type: "Vlocity Action",
              id: "View Record",
              collapse: true,
              isCustomAction: false,
              hasExtraParams: false
            }
          ]
        },
        fields: [
          {
            name: "['displayName']",
            label: "displayName",
            displayLabel: "['displayName']",
            type: "string",
            fieldType: "standard",
            group: "Custom Properties",
            collapse: true
          },
          {
            name: "['description']",
            label: "description",
            displayLabel: "['description']",
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