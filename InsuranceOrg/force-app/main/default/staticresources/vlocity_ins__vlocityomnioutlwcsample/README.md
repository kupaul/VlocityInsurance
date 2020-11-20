# Vlocity OmniOut for LWC - Sample app

This sample app shows how you can customize your OmniOut project by adding additional LWC components to your project. This project contains a navigation example as well an example on how you can override the default OmniScript connection component.

## How to start?

1. Update the `.env` file with the namespace of your organization.
2. Update the `.npmrc` or `.yarnrc` file with the npm key provided to you.
3. Under the `./scripts/webpack.config.js` file, uncomment the `vlocityoverride/connection` line.
4. Run `npm install` or `yarn install` (if you are using `yarn` component manager). This will install all dependencies.
5. Run `npm watch` (or `yarn run watch`, if you set up the project with `yarn`). This will start the project with a local development server on your local address `http://localhost:4002`. 

The source files are located in the [`src`](./src) folder. All web components are within the [`src/modules`](./src/modules) folder. The folder hierarchy also represents the naming structure of the web components.