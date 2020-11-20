// Find the full example of all available configuration options at
// https://github.com/muenzpraeger/create-lwc-app/blob/master/packages/lwc-services/example/lwc-services.config.js
module.exports = {
    resources: [
        { from: 'src/vlocityresources', to: 'dist/vlocityresources/' },
        { from: 'src/newport', to: 'dist/newport/' },
        { from: 'src/index.html', to: 'dist/' },
        { from: 'node_modules/@salesforce-ux/design-system/assets', to: 'dist/slds/assets/' }
    ]
};
