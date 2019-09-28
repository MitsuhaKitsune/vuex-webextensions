/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

import BackgroundScript from './backgroundScript';
import Browser from './browser';
import ContentScript from './contentScript';
import Logger from './logger';

var defaultOptions = {
  connectionName: 'vuex-webextensions',
  loggerLevel: 'warning',
  persistentStates: [],
  ignoredMutations: []
};

export default function(opt) {
  if (typeof window === 'undefined') {
    // This allows authors to unit test more easily
    return () => {}; // eslint-disable-line no-empty-function
  }

  // Merge default options with passed settings
  const options = {
    ...defaultOptions,
    ...opt
  };

  // Initialize logger and browser class
  const logger = new Logger(options.loggerLevel);
  const browser = new Browser(logger);

  return function(str) {
    // Inject the custom mutation to replace the state on load
    str.registerModule('@@VWE_Helper', {
      mutations: {
        vweReplaceState(state, payload) {
          Object.keys(str.state).forEach(function(key) {
            str.state[key] = payload[key];
          });
        }
      }
    });

    // Get type of script and initialize connection
    browser.isBackgroundScript(window).then(function(isBackground) {
      if (isBackground) {
        return new BackgroundScript(logger, str, browser, options);
      }

      return new ContentScript(logger, str, browser, options);
    });
  };
}
