// Copyright 2018 Mitsuha Kitsune <https://mitsuhakitsune.tk>
// Licensed under the MIT license.

// Custom class to apply polyfills without dependencies
// and offer crossbrowser compatibility

var browsers = Object.freeze({
  firefox: {
    name: "Mozilla Firefox",
    namespace: "browser",
    type: "promise"
  },

  chrome: {
    name: "Google Chrome",
    namespace: "chrome",
    type: "callback"
  },

  edge: {
    name: "Microsoft Edge",
    namespace: "browser",
    type: "callback"
  }
});

class Browser {
  constructor() {
    this.browser = this.detectBrowser();
  }

  detectBrowser() {
    if (typeof chrome !== "undefined") {
      if (typeof browser !== "undefined") {
        return browsers.firefox;
      } else {
        return browsers.chrome;
      }
    } else {
      return browsers.edge;
    }
  }

  isBackgroundScript(script) {
    return new Promise((resolve, reject) => {
      if (this.browser == browsers.chrome) {
        try {
          chrome.runtime.getBackgroundPage(function(backgroundPage) {
            return resolve(script === backgroundPage);
          });
        } catch (e) {
          return resolve(false);
        }
      } else if (this.browser == browsers.firefox) {
        try {
          browser.runtime.getBackgroundPage().then(function(backgroundPage) {
            return resolve(script === backgroundPage);
          });
        } catch (e) {
          return resolve(false);
        }
      } else if (this.browser == browsers.edge) {
        try {
          browser.runtime.getBackgroundPage(function(backgroundPage) {
            return resolve(script === backgroundPage);
          });
        } catch (e) {
          return resolve(false);
        }
      }
    });
  }

  getPersistentStates() {
    return new Promise((resolve, reject) => {
      if (this.browser == browsers.chrome) {
        try {
          chrome.storage.local.get("@@vwe-persistence", function(data) {
            if (data["@@vwe-persistence"]) {
              return resolve(JSON.parse(data["@@vwe-persistence"]));
            } else {
              return resolve(null);
            }
          });
        } catch (e) {
          return reject(e);
        }
      } else if (this.browser == browsers.firefox) {
        try {
          browser.storage.local.get("@@vwe-persistence").then(function(data) {
            if (data["@@vwe-persistence"]) {
              return resolve(JSON.parse(data["@@vwe-persistence"]));
            } else {
              return resolve(null);
            }
          });
        } catch (e) {
          return reject(e);
        }
      } else if (this.browser == browsers.edge) {
        try {
          browser.storage.local.get("@@vwe-persistence", function(data) {
            if (data["@@vwe-persistence"]) {
              return resolve(JSON.parse(data["@@vwe-persistence"]));
            } else {
              return resolve(null);
            }
          });
        } catch (e) {
          return reject(e);
        }
      }
    });
  }

  savePersistentStates(datas) {
    if (this.browser == browsers.chrome) {
      try {
        chrome.storage.local.set({
          "@@vwe-persistence": JSON.stringify(datas)
        });
      } catch (e) {
        console.error(
          `Vuex WebExtensions: Can't write persistent states to local store. You grant storage permision to your WebExtension?`
        );
      }
    } else if (this.browser == browsers.firefox) {
      try {
        browser.storage.local.set({
          "@@vwe-persistence": JSON.stringify(datas)
        });
      } catch (e) {
        console.error(
          `Vuex WebExtensions: Can't write persistent states to local store. You grant storage permision to your WebExtension?`
        );
      }
    } else if (this.browser == browsers.edge) {
      try {
        browser.storage.local.set({
          "@@vwe-persistence": JSON.stringify(datas)
        });
      } catch (e) {
        console.error(
          `Vuex WebExtensions: Can't write persistent states to local store. You grant storage permision to your WebExtension?`
        );
      }
    }
  }
}

export default Browser;
