var iframeIntervals = {};

/* create an iframe resize event  */
function bindIframeResize(iframeId, resizeHeight) {
	resizeIframe(iframeId, resizeHeight);

	iframeIntervals[iframeId] = setInterval(function() {
		resizeIframe(iframeId, resizeHeight);
	}, 500);
}

/* resize the given iframe */
function resizeIframe(iframeId, resizeHeight) {
	if (j$('#'+iframeId).length > 0) {
        var iframeBodyEl = j$('#'+iframeId).contents().find('body');

        // set width
        var prevwidth = j$('#'+iframeId).attr('width');
        var newwidth = iframeBodyEl.outerWidth(true);
        if (newwidth !== prevwidth && newwidth > 0) {
            //j$('#'+iframeId).attr('width', newwidth);
        }

        if (resizeHeight) {
            // set height
            var prevheight = j$('#'+iframeId).attr('height');
            var newheight = iframeBodyEl.outerHeight(true);
            if (newheight !== prevheight && newheight > 0) {
                j$('#'+iframeId).attr('height', newheight);
            }
        }
    }
}

/* unbind the iframe resize event */
function unbindIframeResize(iframeId) {
	clearInterval(iframeIntervals[iframeId]);
	delete iframeIntervals[iframeId];
}
