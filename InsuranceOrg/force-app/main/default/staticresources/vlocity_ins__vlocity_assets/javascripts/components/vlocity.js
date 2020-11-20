if (window.vlocity) {
	window._vlocity = window.vlocity;
	window.vlocity = angular.module('vlocity', ['ng']);
	Object.keys(window._vlocity).forEach(function(key) {
		if (!window.vlocity[key]) {
			window.vlocity[key] = window._vlocity[key];
		}
	});
} else {
	window.vlocity = angular.module('vlocity', ['ng']);
}