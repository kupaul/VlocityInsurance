({
    /**
     * Calls the server side action to retrieve VlocitySystemLog records
     * @param {Aura.Component} component 
     */
    loadLogs: function (component) {
        const me = this;
        var record = component.get("v.record"),
            numRecords = component.get("v.numRecords"),
            action = component.get("c.getActionSystemLogs");

        const actionParams = {
            step: record,
            numRecords: numRecords
        };

        component.set("v.loading", true);
        action.setParams({ payload: JSON.stringify(actionParams) });

        action.setCallback(this, function (result) {
            var state = result.getState();
            if (state === "SUCCESS") {
                me.setLogsList(component, result.getReturnValue());
                component.set("v.loading", false);
            }
        });
        $A.enqueueAction(action);
    },

    /**
     * Sets the systemLogs attribute from the given list of VlocitySystemLog records
     * @param {Aura.Component} component 
     * @param {Array} logs 
     */
    setLogsList: function (component, logs) {
        const me = this;
        if (!logs || !logs.length || logs.length < 1) {
            logs = [{
                Name: "No system logs available for this step"
            }];
        } else {
            for (var i = 0; i < logs.length; i++) {
                var logData = {};
                if (logs[i].LogData)
                    logData = JSON.parse(logs[i].LogData);
                logs[i].LogData = logData;
                logs[i].actionCompleted = !(logData.output && logData.output.hasErrors);
            }
            me.setColumns(component, true);
        }

        component.set("v.systemLogs", logs);
    },

    /**
     * Navigates to the pressed displayed VlocitySystemLog record's detail view
     * @param {Aura.Component} component 
     * @param {Aura.Event} event 
     */
    navigateToLog: function (component, event) {
        var action = event.getParam("action");
        var row = event.getParam("row");
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            recordId: row.Id,
            slideDevName: "detail"
        });
        navEvt.fire();
    },

    /**
     * Sets the columns for the logs datatable
     * @param {Aura.Component} component 
     * @param {boolean} showActionButton
     */
    setColumns: function (component, showActionButton) {
        var columns = [{
            label: "Log Name",
            type: "text",
            cellAttributes: {},
            fieldName: "Name"
        },
        {
            label: "Date",
            type: "date",
            initialWidth: 200,
            fieldName: "TimeStamp"
        },
        {
            label: "Completed",
            type: "boolean",
            initialWidth: 120,
            cellAttributes: {
                alignment: "center"
            },
            fieldName: "actionCompleted"
        }];

        if (showActionButton)
        {
            columns.push({
                label: "View",
                type: "button",
                initialWidth: 140,
                cellAttributes: {
                    alignment: "right"
                },
                typeAttributes: {
                    label: "View Details",
                    title: "View Details",
                    name: "view_details"
                }
            });
        }

        component.set("v.columns", columns);
    }
});