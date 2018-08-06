/*
 *  Copyright 2018 Mitsuha Kitsune <https://mitsuhakitsune.tk>
 *  Licensed under the MIT license.
 */

import Browser from './browser';

var constants = Object.freeze({
  MSG_INITIAL_STATE: '@@STORE_INITIAL_STATE',
  MSG_SYNC_MUTATION: '@@STORE_SYNC_MUTATION'
});

var defaultOptions = {
  connectionName: 'vuex-webextensions',
  persistentStates: []
};

export default function(opt) {
  const options = {
    ...defaultOptions,
    ...opt
  };

  var browser = new Browser();
  var receivedMutation = false;
  var store = null;

  function hookMutations(connection) {
    const unsubscribe = store.subscribe((mutation) => {
      if (!receivedMutation) {
        connection.postMessage({
          type: constants.MSG_SYNC_MUTATION,
          data: mutation
        });
      } else {
        receivedMutation = false;
      }
    });

    connection.onDisconnect.addListener(() => {
      unsubscribe();
    });
  }

  function onConnection(connection) {
    if (connection.name !== options.connectionName) {
      return;
    }

    // Send current state on connect
    connection.postMessage({
      type: constants.MSG_INITIAL_STATE,
      data: store.state
    });

    connection.onMessage.addListener(handleMessage);
    hookMutations(connection);
  }

  function handleMessage(msg) {
    if (msg.type == constants.MSG_INITIAL_STATE) {
      store.replaceState(msg.data);
    } else if (msg.type == constants.MSG_SYNC_MUTATION) {
      receivedMutation = true;
      store.commit(msg.data.type, msg.data.payload);
    }
  }

  function filterObject(source, keys) {
    const newObject = {};

    keys.forEach((obj) => {
      newObject[obj] = source[obj];
    });

    return newObject;
  }

  return function(str) {
    // Make store global
    store = str;

    // Get type of script and initialize connection
    browser.isBackgroundScript(window).then(function(isBackground) {
      if (isBackground) {
        // Restore persistent states on background store
        if (options.persistentStates.length) {
          browser.getPersistentStates().then(function(savedStates) {
            if (savedStates) {
              store.replaceState({
                ...store.state,
                ...filterObject(savedStates, options.persistentStates)
              });
            }
          });

          store.subscribe(() => {
            browser.savePersistentStates(filterObject(store.state, options.persistentStates));
          });
        }

        browser.handleConnection(onConnection);
      } else {
        // Init connection with the background
        const connection = browser.connectToBackground(options.connectionName);

        connection.onMessage.addListener(handleMessage);
        hookMutations(connection);
      }
    });
  };
}
