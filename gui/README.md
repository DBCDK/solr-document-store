# GUI to explore the contents of solr-document-store

This module is a Single Page Application written in react to explore the 
contents of the database. The app uses a flux architecture, with redux and 
redux-saga for asynchronous actions.

The project is built using webpack.

## Setting up development server

The development server allows you to develop with hot reloading of redux 
reducers, and react components. New files or changes to redux-saga requires 
manual page reload.

The development server can be launched by running `npm run-script dev-server`

The webpack development server is already configured to run on localhost:8090, 
and should act as a proxy for the service to run on localhost:8080.

Webpack-dev-server requires node to run, so make sure it is installed.

## Style guide

Project uses `prettier` with `--single-quote` argument.

## TODO
 * Set up development server as a docker image, maybe a docker compose to
 launch service as well and configure ports for proxy etc.