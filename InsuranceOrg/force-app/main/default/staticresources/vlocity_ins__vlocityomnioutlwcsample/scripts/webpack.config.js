// Custom webpack configuration file, provides generation of service worker
// More information: https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin
const express = require('express'),
    path = require('path'),
    dotenv = require('dotenv-webpack'),
    defaultBuilder = require('@vlocity-ins/resources/src/javascript/utils/webpackBuilder');

// Import required package configurations
const resourcesConfig = defaultBuilder(path.resolve(__dirname, `../node_modules/@vlocity-ins/resources/src/javascript/salesforce/`)),
    coreConfig = defaultBuilder(path.resolve(__dirname, `../node_modules/@vlocity-ins/core/src/javascript/salesforce/`)),
    componentsConfig = defaultBuilder(path.resolve(__dirname, `../node_modules/@vlocity-ins/components/src/javascript/salesforce/`)),
    ouiConfig = defaultBuilder(path.resolve(__dirname, `../node_modules/@vlocity-ins/oui/src/javascript/salesforce/`));

// Create the alias for package specify needs
const alias = {
    ...resourcesConfig.resolve.alias,
    ...coreConfig.resolve.alias,
    ...componentsConfig.resolve.alias,
    ...ouiConfig.resolve.alias,
    // 'vlocityoverride/connection': path.resolve(__dirname, '../src/modules/vlocityoverride/connection/connection.js'),   // uncomment to add support for override connection
};

// Export webpack config
module.exports = {
    plugins: [new dotenv()],
    devServer: {
        before: function(app, server, compiler) {
            app.use('/slds/', express.static('./node_modules/@salesforce-ux/design-system/'));
        },
        port: 4002,
    },
    resolve: {
        alias: alias,
    },
};
