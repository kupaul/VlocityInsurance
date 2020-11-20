({
    // Create SVG, path, populate with default values from controller
    render: function(component, helper) {
        var result = this.superRender(),
            xmlns = "http://www.w3.org/2000/svg",
            updateContainer = result[0].querySelector("#progressContainer"),
            value = component.get("v.value"),
            dValue = "M 1 0 A 1 1 0 "+Math.floor(value / 50)+" 1 "+
                Math.cos(2 * Math.PI * value / 100)+" "+
                Math.sin(2 * Math.PI * value / 100)+" L 0 0",
            svg = document.createElementNS(xmlns,"svg"),
            path = document.createElementNS(xmlns,"path");
        svg.setAttributeNS(null,"viewBox", "-1 -1 2 2");
        path.setAttributeNS(null, "class", "slds-progress-ring__path");
        path.setAttributeNS(null, "d", dValue);
        svg.appendChild(path);
        updateContainer.appendChild(svg);
        return result;
    },
    // Update the progress bar on a rerender event
    rerender: function(component, helper) {
        var value = component.get("v.value"),
            dValue = "M 1 0 A 1 1 0 "+Math.floor(value / 50)+" 1 "+
                Math.cos(2 * Math.PI * value / 100)+" "+
                Math.sin(2 * Math.PI * value / 100)+" L 0 0",
            svg = component.getElement().querySelector("svg"),
            path = svg.childNodes[0];
        this.superRerender();
        path.setAttributeNS(null, "d", dValue);
    }
})