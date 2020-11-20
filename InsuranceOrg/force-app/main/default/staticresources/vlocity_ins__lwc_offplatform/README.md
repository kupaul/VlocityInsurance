# Node Modules

Run `yarn install`

Will install all the required modules.

# Deploy the component

Run `yarn start`

Will compile all your files and run it on the browser with localhost:port; additionally, the webpack dependency analyser plugin will provide you with details on your package size and any dependent modules.

# Build the component

Run `yarn run build`

Will compile all your files and create a build directory on the dist folder with your index.html and component.js file, as well with the .gz file.

# Test the component

Run `yarn run-script test`

Will compile all your files and create a test result based on our test spec.

# Theme support

Manually add assets folder inside public folder to support icons for themes other than slds and set baseurl.
