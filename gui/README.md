# GUI to explore the contents of solr-document-store

This module is a Single Page Application written in react to explore the contents of the database. The app uses a flux architecture, with redux and redux-saga for asynchronous actions.

The project is built using webpack.

## Build

To build the project, run `npm run-script build`.

There are 3 javascript bundles produced by a build:
 - `solr-docstore-gui-bundle.js` for the main tool to explore the contents of the docstore.
 - `queue-admin-gui-bundle.js` the tool to manage the queues of the solr docstore
 - `vendor.js` is the shared libraies of the page bundles. Excellent for caching, keeping loadtimes lower.

All `css` is extracted into the file `solr-docstore-gui-styles.js` and used across all pages.

## Setting up development server

The development server allows you to develop with hot reloading of redux reducers, and react components. New files or changes to redux-saga requires manual page reload.

The development server can be launched by running `npm run-script dev-server`

The webpack development server is already configured to run on localhost:8090, and should act as a proxy for the service to run on localhost:8080.

Webpack-dev-server requires node to run, so make sure it is installed.

## Testing

Testing is being done with the `jest` framework, using `enzyme` to inspect React components. With `redux-saga-tester` it is possible to listen for certain future action events, making it possible to do integration tests of the UI entirely in node.js.

## Style guide

Project uses `prettier` with no configuration.

## TODO
 * Set up development server as a docker image, maybe a docker compose to
 launch service as well and configure ports for proxy etc.