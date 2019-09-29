/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

class ContentScript {
  constructor(logger, store, browser, settings) {
    this.logger = logger;
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

  /**
   * Listener for incomming messages from background script.
   * @param {object} message - Message received from background script.
   * @returns {null} This function didn't return any value
   */
  onMessage(message) {
    this.logger.debug(`Received message from background`);

    // Don't process messages without type property, aren't from the plugin
    if (!message.type) {
      return;
    }

    switch (message.type) {
      // Process initial state from the background
      case '@@STORE_SYNC_STATE': {
        this.logger.info(`Received store initial state`);
        this.store.commit('vweReplaceState', message.data);
        this.initialized = true;
        this.processPendingMutations();
        break;
      }

      // Process mutation messages from background script
      case '@@STORE_SYNC_MUTATION': {
        this.logger.debug(`Received mutation ${message.data.type}`);

        // Don't commit any mutation from other contexts before the initial state sync
        if (!this.initialized) {
          this.logger.info(`Received mutation (${message.data.type}) but the store isn't initilized yet`);
          break;
        }

        this.receivedMutations.push(message.data);
        this.store.commit(message.data.type, message.data.payload);
        break;
      }

      default: {
        break;
      }
    }
  }

  /**
   * Hook for retrieve the comited mutations from content script.
   * @param {object} mutation - Mutation comited on content script store.
   * @returns {null} This function didn't return any value
   */
  hookMutation(mutation) {
    this.logger.debug(`Hooked mutation (${mutation.type})`);

    // If it's store initialization mutation don't send again to other contexts
    if (mutation.type === 'vweReplaceState') {
      this.logger.debug(`vweReplaceState mutation don't need send to other contexts`);

      return;
    }

    // If it's ignored mutation don't sync with the other contexts
    if (this.settings.ignoredMutations.length > 0 && this.settings.ignoredMutations.includes(mutation.type)) {
      this.logger.info(`Mutation (${mutation.type}) are on ignored mutations list, skiping...`);

      return;
    }

    // If store isn't initialized yet, just enque the mutation to reaply it after sync
    if (!this.initialized) {
      this.logger.info(`Hooked mutation (${mutation.type}) before initialization, enqued on pending mutations`);

      return this.pendingMutations.push(mutation);
    }

    // If received mutations list are empty it's own mutation, send to background
    if (!this.receivedMutations.length) {
      return this.sendMutation(mutation);
    }

    // Check if it's received mutation, if it's just ignore it, if not send to background
    for (var i = this.receivedMutations.length - 1; i >= 0; i--) {
      if (this.receivedMutations[i].type == mutation.type && this.receivedMutations[i].payload == mutation.payload) {
        this.logger.verbose(`Mutation ${this.receivedMutations[i].type} it's received mutation, don't send to background again`);
        this.receivedMutations.splice(i, 1);
      } else if (i == 0) {
        this.sendMutation(mutation);
      }
    }
  }

  /**
   * Helper function to send mutations to background script.
   * @param {object} mutation - The mutation to send.
   * @returns {null} This function didn't return any value
   */
  sendMutation(mutation) {
    this.logger.debug(`Sending mutation (${mutation.type}) to background script`);

    this.connection.postMessage({
      type: '@@STORE_SYNC_MUTATION',
      data: mutation
    });
  }

  /**
   * Process pending mutations queue.
   * @returns {null} This function didn't return any value
   */
  processPendingMutations() {
    this.logger.debug(`Processing pending mutations list...`);

    if (!this.pendingMutations.length) {
      this.logger.info(`The pending mutations list are empty`);

      return;
    }

    for (var i = 0; i < this.pendingMutations.length; i++) {
      this.logger.verbose(`Processing pending mutation (${this.pendingMutations[i].type}) with payload: ${this.pendingMutations[i].payload}`);
      this.store.commit(this.pendingMutations[i].type, this.pendingMutations[i].payload);

      // Clean the pending mutation when are applied
      this.pendingMutations.splice(i, 1);
    }
  }
}

export default ContentScript;
