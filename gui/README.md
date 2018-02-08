# GUI to explore the contents of solr-document-store

This module encompases two Single Page Application written in react to explore the contents of the database. The apps uses a flux architecture, with redux and redux-saga for asynchronous actions.

The project is built using webpack.

## Build

The project is automatically built and tested when building the module thanks to `maven-frontend-plugin`.

To build the project manually, run `npm run-script build`. There are 3 javascript bundles produced by a build:
 - `solr-docstore-gui-bundle.js` for the main tool to explore the contents of the docstore.
 - `queue-admin-gui-bundle.js` the tool to manage the queues of the solr docstore
 - `vendor.js` is the shared libraies of the page bundles. Excellent for caching, keeping loadtimes lower.

All `css` is extracted into the file `solr-docstore-gui-styles.js` and used across all pages.

## Setting up development server

The development server allows you to develop with hot reloading of react components and redux reducers. New files or changes to redux-saga requires manual page reload.

### Quickstart

A `docker-compose` configuration has been made, which launches the service as well as database and webpack development server. By running `docker-compose up` inside the `gui` folder you are ready to develop the frontend with hot reloading, test database and service endpoints.

To start development, simply visit `localhost:8090/dev.html` for the docstore tool, or `localhost:8090/dev-queue.html` for the queue tool.

Changes to the backend requires a manual compilation (ie. `mvn package` in root module) and relaunch of the docker images.

### Details

The development server can be launched by running `npm run-script dev-server`.

The webpack development server is already configured to run on localhost:8090, and should act as a proxy for the service to run on localhost:8080.

`webpack` and `webpack-dev-server` requires `node` >= 5.10 to run, so make sure it is installed.

## Project structure

Even though we create several bundles for several web pages, everything is written to be bundle agnostic.

### Folder structure

 - `app`: Contains all application code
 	- `actions`: Each file contains action producers and relevant type constants, that mirrors a reducer. Only exception is `global.js` which contains actions relevant to several reducers.
 	- `api`: Contains functions for interacting with the `service` backend API. All results are delivered as a `Promise`.
 	- `components`: Contains all react components.
 	- `functions`: Contains helper functions for non-trivial operations that also needs to be re-used in several places.
 	- `reducers`: Contain redux reducers as well as redux store configurators for setup. Each reducers corresponding actions are found in the `action` folder.
 	- `sagas`: Contains all sagas for `redux-saga`.
 - `development`: Contains html files to load development bundles if the `webpack-dev-server` is running.
 - `test`: Contains all tests, both unit and integration tests, all of which runs entirely in jest.

## Testing

Testing is being done with the `jest` framework, using `enzyme` to inspect React components. With `redux-saga-tester` it is possible to listen for certain future action events, making it possible to do integration tests of the UI entirely in node.js.

## Style guide

Project uses `prettier` with no configuration.