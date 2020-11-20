({
	onNewTabClick : function(component, event, helper) {
		window.open(component.get('v.iframeUrl'));
	},
	closeAlert: function(component, event, helper) {
		component.set('v.showAlert', false);
	}
})