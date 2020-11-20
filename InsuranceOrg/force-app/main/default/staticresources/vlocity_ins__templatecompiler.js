/**
 * An OS component.
 */
export default class TemplateCompiler {

    compileZip(json, action) {
        return this.createZipToDeploy(json, action);
    }

    createZipToDeploy(json, action) {
        return new Promise((resolve, reject) => {
            let type;
            let url = '';
            var zip = new JSZip();

            if(action === "download") {
                type = 'blob';
            } else {
                url = 'lwc/';
                type = 'base64';
                 zip.file(
                    'package.xml',
                    `<?xml version="1.0" encoding="UTF-8"?>
                    <Package xmlns="http://soap.sforce.com/2006/04/metadata">
                        <types>
                            <members>${json.name}</members>
                            <name>LightningComponentBundle</name>
                        </types>
                        <version>45.0</version>
                    </Package>`
                );
            }

            json.files.forEach(function (file) {
                zip.file(`${url}${json.name}/${file.name}`, `${file.source}`);
            })

            zip.generateAsync({ type: type })
                .then(content => {
                    resolve(content);
                });
        });
    }

    getDownloadableZip(zipFile, json) {
        return new Promise((resolve, reject) => {
            var zip = new JSZip();
            var newZip = new JSZip();
            var _this = this;
            
            this.zipLoadAsync(zip, zipFile).then(function(retrievedZip){
                retrievedZip.files["staticresources/lwc_offplatform.resource"].async("base64").then(function(zipFile){
                    _this.zipLoadAsync(zip, zipFile).then(function(resourceFolder){      
                        _this.getFileSource(resourceFolder, newZip, json).then(function(zip){
                            json.files.forEach(function (file) {
                                zip.file(`src/c/${json.name}/${file.name}`, `${file.source}`);
                            });

                            zip.file('.npmrc','registry=https://npm.lwcjs.org');
                            zip.file('.yarnrc','registry "https://npm.lwcjs.org"');

                            
                            zip.generateAsync({ type: "blob" })
                            .then(content => {
                                resolve(content);
                            });
                        });
                    }, function(e){
                        reject(e);
                    });
                },  function(e){
                        reject(e);
                    });
            }, function(e){
                reject(e);
            })

   
            
            
        });
    }

    zipLoadAsync(zip, zipFile){
        return new Promise((resolve, reject) => {
            zip.loadAsync(zipFile, {base64: true,createFolders: true}).then(function(a){
                resolve(a);
            }, function (e) {
                reject(e);
            });
        });
    }

    getFileSource(resourceFolder, zip, json) {
        return new Promise((resolve, reject) => {
            const promises = [];
            let paths = [];
            resourceFolder.forEach(function(path,fileObject){
                promises.push(fileObject.async("string"));
                paths.push(path);
            });
            try {
                Promise.all(promises).then(function (data) {
                    paths.map((item, index) => { 
                        let obj = {};
                        obj[item] = data[index];
                        data[index] = data[index].replace(/\${lwc_name}/g, json.name);
                        zip.file(item, data[index])
                        return obj;
                    });
                    resolve(zip);
                });
            } catch(e) {
                reject(e);
            }
            
        });
    }

    getJs(json) {
        return `import { Element, api } from 'engine';
        import { OMNIDEF } from './${this.getLwcName(json)}_def.js';
        /**
         *  IMPORTANT! Generated class DO NOT MODIFY
         */
        export default class ${json.bpType}${json.bpSubType}${json.bpLang} extends Element {
            @api definition = OMNIDEF;

            @api value = {};
        }
            `;
    }

    getJson(json) {
        return 'export const OMNIDEF = ' + JSON.stringify(json) + ';';
    }

    getHtml(json) {
        return `<template><!-- IMPORTANT: This is a generated file. Do not modify it! -->${this.buildOmniHtml(json)}</template>`;
    }

    getMetaXml(json) {
        return `<?xml version="1.0" encoding="UTF-8"?>
        <LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
            <apiVersion>45.0</apiVersion>
            <isExposed>false</isExposed>
        </LightningComponentBundle>`;
    }

    getLwcName(json) {
        return (json.bpType + '_' + json.bpSubType + '_' + json.bpLang).toLowerCase()
    }

    getTemplateHtml(html) {
        const omniscript = document.createElement('div');
        omniscript.innerHTML = html;
        return omniscript.innerHTML;
    }

    buildOmniHtml(omniDef) {
        const omniscript = document.createElement('c-omniscript');
        omniscript.setAttribute('type', omniDef.bpType);
        omniscript.setAttribute('subtype', omniDef.bpSubType);
        omniscript.setAttribute('language', omniDef.bpLang);
        omniscript.setAttribute('definition', '{definition}');
        omniscript.setAttribute('value', '{value}');

        omniDef.children.forEach(child => {
            omniscript.appendChild(this.buildOmniStepHtml(child));
        });

        const builtHtml = omniscript.outerHTML;

        // now process the html string for attributes which are name="{something}" and remove the quotes
        return builtHtml.replace(/="({[^}]*})"/g, '=$1');
    }


    buildOmniStepHtml(stepDef) {
        const step = document.createElement('c-omniscript_step');
        step.setAttribute('name', stepDef.name);
        step.setAttribute('slot', 'omniscript_step');

        stepDef.children.forEach(child => {
            step.appendChild(this.buildOmniElement(child));
        });

        return step;
    }

    getAttributeNameForProp(propKey, elementDef) {
        switch (elementDef.componentName) {
            case 'lightning-formatted-rich-text':
                if (propKey === 'label') {
                    return 'value';
                }
                return propKey;
            // allow follow through
            default: return propKey;
        }
    }

    buildOmniElement(childDef) {
        return childDef.eleArray.map(childElDef => {
            const childEl = document.createElement(childElDef.componentName);
            childEl.setAttribute('name', childElDef.name);
            Object.keys(childElDef.propSetMap).forEach(key => {
                if (childElDef.propSetMap[key]) {
                    switch (key) {
                        case 'controlWidth':
                            childEl.setAttribute('class', 'slds-size_' + childElDef.propSetMap[key] + '-of-12 slds-p-horizontal_medium');
                            break;
                        default:
                            if (typeof childElDef.propSetMap[key] === 'boolean') {
                                childEl.setAttribute(this.getAttributeNameForProp(key, childElDef), key);
                            } else {
                                childEl.setAttribute(this.getAttributeNameForProp(key, childElDef), childElDef.propSetMap[key]);
                            }
                    }
                }
            });
            return childEl;
        })[0];
    }
}

window.TemplateCompiler = TemplateCompiler;
