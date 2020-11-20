export const definition = {
  previewAttrs: {
    default: {
      selectedState: true,
      obj: {
        title: "Starting generator after electrical failure",
        subtitle: "New",
        ownerValueMap: {
          Owner: "John Doe"
        },
        onGoing: true,
        objType: "Case",
        objAPIName: "Case",
        Id: "5003t00001BY2sZAAO",
        highlight: "Problem",
        formatedLastActivityDate: "29/8/2019",
        detailValueMap: {
          Description:
            "I was not able to start the generator. It stops working after the power failure"
        },
        showTitle: true
      },
      state: {
        definedActions: {
          actions: []
        },
        fields: [
          {
            collapse: true,
            editing: false,
            fieldType: "standard",
            label: "Status",
            name: "['subtitle']",
            type: "string"
          },
          {
            collapse: true,
            editing: false,
            fieldType: "standard",
            label: "Case Type",
            name: "['highlight']",
            type: "string"
          },
          {
            name: "['ownerValueMap']['Owner']",
            label: "owner",
            displayLabel: "['ownerValueMap']['Owner']",
            type: "string",
            group: "Custom Properties",
            collapse: true,
            editing: false
          }
        ]
      }
    }
  }
};