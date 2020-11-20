({
	doInit : function(component, event, helper) {
		var modalParams = component.get("v.modalParams");
		modalParams.parent.set("v.showNotesModal", true);
		component.set("v.recordName", modalParams.parent.get("v.record").Name);
		component.set("v.notes", modalParams.parent.get("v.notes"));
	},
	onCancelClick : function(component, event, helper) {
		var modalParams = component.get("v.modalParams");
		modalParams.parent.set("v.showNotesModal", false);
		component.set("v.showModal", false);
	},
	onActionClick : function(component, event, helper) {
		var modalParams = component.get("v.modalParams");
		modalParams.parent.set("v.notes", component.get("v.notes"));
		modalParams.parent.saveNotes();
		modalParams.parent.set("v.showNotesModal", false);
		component.set("v.showModal", false);
	}
})