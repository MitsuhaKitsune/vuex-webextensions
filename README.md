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

Import the module into your store file:

```javascript
import VuexWebExtensions from 'vuex-webextensions'
```

Then add it as plugin on Vuex store initialization:

```javascript
export default new Vuex.Store({
  ...
  plugins: [VuexWebExtensions()]
});
```
All done!

## Changelog

##### 1.0.0

> ⚠  This version have a breaking changes please check the new install method and remove the old install of your scripts

* Convert module as "true" plugin of vuex

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
* Add optional persisted states on config to mantain data on restarts
* Add tests and coverage
* Publish to Awesome Vue.js lists when no more pending work and up version to 1.0.0 (stable)
