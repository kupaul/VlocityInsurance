function parseContentTypes(zip) {
    var appendPNG = true;
    var deleteJPG = false;

    // check `Content_Types` for image extensions
    var contentTypesettings = zip.files["[Content_Types].xml"].asText();
    var CTXMLDoc = $.parseXML(contentTypesettings);
    $(CTXMLDoc).find('Default').each(function() {
        $.each(this.attributes, function(i, attrib) {
            var attrName = attrib.name;
            var attrValue = attrib.value;
            if (attrName === "Extension" && attrValue.toLowerCase() === "png") {
                appendPNG = false;
            }
            if (attrName === "Extension" && attrValue.toLowerCase() === "jpeg") {
                deleteJPG = true;
            }
        });
        if (deleteJPG === true) {
            $(this).remove();
            deleteJPG = false;
        }
        if (appendPNG === false) {
            return false;
        }
    });

    // if png extension is missing in `Content_Types`, then add it
    if (appendPNG === true) {
        var updateFieldsElement = $.parseXML("<Default/>").documentElement;
        var $updateFieldsElement = $(updateFieldsElement).attr({Extension: 'png', ContentType: 'image/png'});
        $(CTXMLDoc).children().append($updateFieldsElement);
        var cTypeSettingsRaw = (new XMLSerializer()).serializeToString(CTXMLDoc);
        cTypeSettingsRaw = cTypeSettingsRaw.replace(' xmlns=""', '');
        // https://github.com/open-xml-templating/docxtemplater/issues/240
        zip.file("[Content_Types].xml", cTypeSettingsRaw);
    }

    // convert all jpeg/jpg images to png
    if (zip["files"] !== undefined) {
        var fileObj = zip["files"];
        Object.keys(fileObj).forEach(function(key2) {
            var filesChild = fileObj[key2];
            if (key2.indexOf('word/_rels/header') != -1) {
                modifyHeaderXMLImageTypes(zip,filesChild);
            }
            if (key2.indexOf('word/media/') != -1) {
                modifyMediaImageTypes(zip,filesChild, fileObj);
            }
        });
    }
}

function modifyHeaderXMLImageTypes(zip, filesChild) {
    var folderPath = filesChild.name;
    var headerRels = getHeaderRelsFile(zip,folderPath);
    var headerXMLDoc = $.parseXML(headerRels);
    $(headerXMLDoc).find('Relationship').each(function() {
        $.each(this.attributes, function(i, attrib) {
            var name = attrib.name;
            var value = attrib.value;
            if (value.toLowerCase().endsWith('.jpeg')) {
                attrib.value = value.toLowerCase().replace('.jpeg', '.png');
            } else if (value.toLowerCase().endsWith('.jpg')) {
                attrib.value = value.toLowerCase().replace('.jpg', '.png');
            }
        });
    });
    var headerRelsRaw = (new XMLSerializer()).serializeToString(headerXMLDoc);
    zip.file(folderPath, headerRelsRaw);
}

function modifyMediaImageTypes(zip, filesChild, fileObj) {
    var name = filesChild.name;
    if (name.toLowerCase().endsWith('.jpeg')) {
        filesChild.name = name.toLowerCase().replace('.jpeg', '.png');
        fileObj[filesChild.name] = filesChild;
        zip.remove(name);
    } else if(name.toLowerCase().endsWith('.jpg')) {
        filesChild.name = name.toLowerCase().replace('.jpg', '.png');
        fileObj[filesChild.name] = filesChild;
        zip.remove(name);
    }
}

function getHeaderRelsFile(zip, path) {
    var file = zip.file(path);
    if (file != null) {
        return file.asText();
    }
    return '';
}