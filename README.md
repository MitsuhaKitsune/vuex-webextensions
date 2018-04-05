# Vuex WebExtensions
[![NPM](https://nodei.co/npm/vuex-webextensions.png)](https://npmjs.org/package/vuex-webextensions)

[![Build Status](https://travis-ci.org/MitsuhaKitsune/vuex-webextensions.svg?branch=master)](https://travis-ci.org/MitsuhaKitsune/vuex-webextensions)

A Node.JS module to use Vuex on WebExtensions on "shared" context, the module allows you to start several instances of Vuex store and keep them synchronized throught WebExtensions messaging API.

Uses the Vuex store instance on background script as master, and replicate the state of master to others instances on diferent context (popup or content scripts), when you commit any mutation to any store instance the rest will also be updated automatically.

You can work with the Vuex store like a unic instance (or standart Vue.js application), without worry for the different WebExtensions contexts, the module gona solve all WebExtensions problems for you automatically.

## Installation
Run the following command inside your WebExtensions project to install the module:

``npm install vuex-webextensions --save``

## Usage

##### Background script

You need create a Vuex store instance on the background script because it's the unic permanent script on WebExtensions, import the module on your background script with this line:

``import {setSharedStore} from 'vuex-webextensions'``

After initialize your Vuex store (I use the var store to refer to store instance on this example, if you use another var name change it), pass the instance to the module with this line:

``setSharedStore(store);``

Your background script it's done now to act as master store instance and sync with other scripts.

##### Popup/Content scripts

Import the module on your Popup/Content script with this line:

``import {getSharedStore} from 'vuex-webextensions'``

Then initialize again the same store instance that you initialize on the background (same states, actions, mutations...), after it put this line on your script:

``getSharedStore(store);``

All installation done here, now just work with the store like standart Vue.js application, this module gona sync all store instances for you.

## Changelog

##### 0.1.1
* Added lint and some prepublish methods to the package
* Solve some issues detected by linter
* Added Travis CI for automatic build and tests

##### 0.1.0
* First version

## Contribute

If you encounter a problem, issue or question feel free to open a new issue on this repository.

If you have some improvements, new features or fixes feel free to fork this repository and send a pull request.

## Pending work

* Add example
* Find proper initialization and method names
* Add tests and coverage
* Publish to Awesome Vue.js lists when no more pending work and up version to 1.0.0 (stable)
