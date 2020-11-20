({
	doInit : function(component, event, helper) {
		var modalParams = component.get("v.modalParams"),
		record = modalParams.parent.get("v.record");
		modalParams.parent.set("v.showInstructionModal", true);

		component.set("v.recordName", record.Name);
		component.set("v.iframeUrl", record.StepCommand);
		component.set("v.instruction", record.Instruction);

		component.set("v.actionBtnAttributes", modalParams.parent.get("v.actionBtnAttributes"));
	},
	onCancelClick : function(component, event, helper) {
		var modalParams = component.get("v.modalParams");
		
		modalParams.parent.set("v.showInstructionModal", false);
		component.set("v.showModal", false);
	},
	onNewTabClick : function(component, event, helper) {
		window.open(component.get('v.iframeUrl'));
	},
	onActionClick : function(component, event, helper) {
		var modalParams = component.get("v.modalParams");
		modalParams.parent.completeAction();
		modalParams.parent.set("v.showInstructionModal", false);
		component.set("v.showModal", false);
	}
})