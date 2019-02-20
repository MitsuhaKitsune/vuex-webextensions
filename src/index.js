/*
 *  Copyright 2018 Mitsuha Kitsune <https://mitsuhakitsune.tk>
 *  Licensed under the MIT license.
 */

import BackgroundScript from './backgroundScript';
import Browser from './browser';
import ContentScript from './contentScript';

var defaultOptions = {
  connectionName: 'vuex-webextensions',
  persistentStates: []
};

export default function(opt) {
  if (typeof window === 'undefined') {
    // This allows authors to unit test more easily
    return () => {}; // eslint-disable-line no-empty-function
  }

  const options = {
    ...defaultOptions,
    ...opt
  };

  const browser = new Browser();

  return function(str) {
    // Get type of script and initialize connection
    browser.isBackgroundScript(window).then(function(isBackground) {
      if (isBackground) {
        return new BackgroundScript(str, browser, options);
      }

      return new ContentScript(str, browser, options);
    });
  };
}
