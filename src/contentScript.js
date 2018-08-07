/*
 *  Copyright 2018 Mitsuha Kitsune <https://mitsuhakitsune.tk>
 *  Licensed under the MIT license.
 */

class ContentScript {
  constructor(store, browser, settings) {
    this.store = store;
    this.browser = browser;
    this.settings = settings;
    this.scriptId = Math.random()
      .toString(36)
      .substr(2, 9);
    this.connection = null;
    this.receivedMutations = [];

    // Connect to background script
    this.connection = browser.connectToBackground(`${this.settings.connectionName}_${this.scriptId}`);

    // Listen for messages
    this.connection.onMessage.addListener((message) => {
      this.onMessage(message);
    });

    // Hook mutations
    this.store.subscribe((mutation) => {
      this.hookMutation(mutation);
    });
  }

  onMessage(message) {
    if (message.type == '@@STORE_INITIAL_STATE') {
      this.store.replaceState(message.data);
    } else if (message.type == '@@STORE_SYNC_MUTATION') {
      this.receivedMutations.push(message.data);
      this.store.commit(message.data.type, message.data.payload);
    }
  }

  hookMutation(mutation) {
    // If received mutations list are empty it's own mutation, send to background
    if (!this.receivedMutations.length) {
      return this.sendMutation(mutation);
    }

    // Check if it's received mutation, if it's just ignore it, if not send to background
    for (var i = this.receivedMutations.length - 1; i >= 0; i--) {
      if (this.receivedMutations[i].type == mutation.type && this.receivedMutations[i].payload == mutation.payload) {
        this.receivedMutations.splice(i, 1);
      } else if (i == 0) {
        this.sendMutation(mutation);
      }
    }
  }

  sendMutation(mutation) {
    this.connection.postMessage({
      type: '@@STORE_SYNC_MUTATION',
      data: mutation
    });
  }
}

export default ContentScript;
