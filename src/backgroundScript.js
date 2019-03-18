/*
 *  Copyright 2018 - 2019 Mitsuha Kitsune <https://mitsuhakitsune.com>
 *  Licensed under the MIT license.
 */

class BackgroundScript {
  constructor(store, browser, settings) {
    this.store = store;
    this.browser = browser;
    this.settings = settings;
    this.connections = [];

    // Restore persistent state datas from localstorage
    if (this.settings.persistentStates.length) {
      this.browser.getPersistentStates().then((savedStates) => {
        if (savedStates !== null) {
          this.store.replaceState({
            ...this.store.state,
            ...this.filterObject(savedStates, this.settings.persistentStates)
          });
        }
      });
    }

    // Hook mutations
    this.store.subscribe((mutation) => {
      // Send mutation to connections pool
      for (var i = this.connections.length - 1; i >= 0; i--) {
        // If received mutations list of connection is empty isn't his mutation, send it
        if (!this.connections[i].receivedMutations.length) {
          this.sendMutation(this.connections[i], mutation);
        }

        // Check if is one of his mutations
        for (var j = this.connections[i].receivedMutations.length - 1; j >= 0; j--) {
          if (this.connections[i].receivedMutations[j].type == mutation.type && this.connections[i].receivedMutations[j].payload == mutation.payload) {
            this.connections[i].receivedMutations.splice(j, 1);
          } else if (i == 0) {
            this.sendMutation(this.connections[i], mutation);
          }
        }
      }

      // Save persistent states to local storage
      browser.savePersistentStates(this.filterObject(this.store.state, this.settings.persistentStates));
    });

    // Start listening for connections
    browser.handleConnection((connection) => {
      this.onConnection(connection);
    });
  }

  filterObject(source, keys) {
    const newObject = {};

    keys.forEach((obj) => {
      newObject[obj] = source[obj];
    });

    return newObject;
  }

  onConnection(connection) {
    // Remove from connections on disconnect
    connection.onDisconnect.addListener((conn) => {
      this.onDisconnect(conn);
    });

    // Initialize empty list of receivedMutations
    connection.receivedMutations = [];

    // Listen to messages
    connection.onMessage.addListener((message) => {
      this.onMessage(connection, message);
    });

    // Add to connections pool
    this.connections.push(connection);

    // Send current state
    connection.postMessage({
      type: '@@STORE_INITIAL_STATE',
      data: this.store.state
    });
  }

  onDisconnect(connection) {
    for (var i = this.connections.length - 1; i >= 0; i--) {
      if (this.connections[i].name === connection.name) {
        this.connections.splice(i, 1);
      }
    }
  }

  onMessage(connection, message) {
    if (message.type != '@@STORE_SYNC_MUTATION') {
      return;
    }

    connection.receivedMutations.push(message.data);
    this.store.commit(message.data.type, message.data.payload);
  }

  sendMutation(connection, mutation) {
    connection.postMessage({
      type: '@@STORE_SYNC_MUTATION',
      data: mutation
    });
  }
}

export default BackgroundScript;
