# Vuex WebExtensions
[![NPM](https://nodei.co/npm/vuex-webextensions.png)](https://npmjs.org/package/vuex-webextensions)
[![Build Status](https://travis-ci.org/MitsuhaKitsune/vuex-webextensions.svg?branch=master)](https://travis-ci.org/MitsuhaKitsune/vuex-webextensions)

A Node.JS module to use Vuex on WebExtensions on "shared" context, the module use the background script store instance as master and sync his status to new store instances on UI scripts throught WebExtensions messaging API, all mutations are replicated to the other instances, so all stores are syncronished with same states.

You can work with the Vuex store like a unic instance without worry for the different WebExtensions contexts.

### Installation
Run the following command inside your WebExtensions project:
``npm install vuex-webextensions --save``
