/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
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
    this.initialized = false;
    this.pendingMutations = [];

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
    if (!message.type) {
      return;
    }

    if (message.type == '@@STORE_SYNC_STATE') {
      this.store.commit('vweReplaceState', message.data);
      this.initialized = true;
      this.processPendingMutations();
    } else if (message.type == '@@STORE_SYNC_MUTATION') {
      // Don't commit any mutation from other contexts before the initial state sync
      if (!this.initialized) {
        return;
      }

      this.receivedMutations.push(message.data);
      this.store.commit(message.data.type, message.data.payload);
    }
  }

  hookMutation(mutation) {
    // If store isn't initialized yet, just enque the mutation to reaply it after sync
    if (!this.initialized) {
      return this.pendingMutations.push(mutation);
    }

    // If it's store initialization mutation don't send again to other contexts
    if (mutation.type === 'vweReplaceState') {
      return;
    }

    // If it's ignored mutation don't sync with the other contexts
    if (this.settings.ignoredMutations.length > 0 && this.settings.ignoredMutations.includes(mutation.type)) {
      return;
    }

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

  processPendingMutations() {
    if (!this.pendingMutations.length) {
      return;
    }

    for (var i = 0; i < this.pendingMutations.length; i++) {
      this.store.commit(this.pendingMutations[i].type, this.pendingMutations[i].payload);

      // Clean the pending mutation when are applied
      this.pendingMutations.splice(i, 1);
    }
  }
}

export default ContentScript;
