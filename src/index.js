/* global chrome */

var constants = Object.freeze({
  INITIAL_STATE: '@@STORE_INITIAL_STATE',
  SYNC_MUTATION: '@@STORE_SYNC_MUTATION'
});

var defaultOptions = {
  connectionName: 'vuex-webextensions',
  persistentStates: []
};

export default function(opt) {
  let options = {...defaultOptions, ...opt};
  var receivedMutation = false;
  var store = null;
  var isBackground = false;

  function hookMutations(connection) {
    const unsubscribe = store.subscribe((mutation) => {
      if (!receivedMutation) {
        connection.postMessage({
          type: constants.SYNC_MUTATION,
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

  function handleConnection(connection) {
    if (connection.name !== options.connectionName) {
      return;
    }

    // Send current state on connect
    connection.postMessage({
      type: constants.INITIAL_STATE,
      data: store.state
    });

    connection.onMessage.addListener(handleMessage);
    hookMutations(connection);
  }

  function handleMessage(msg) {
    if (msg.type == constants.INITIAL_STATE) {
      store.replaceState(msg.data);
    } else if (msg.type == constants.SYNC_MUTATION) {
      receivedMutation = true;
      store.commit(msg.data.type, msg.data.payload);
    }
  }

  function filterObject(source, keys) {
    const newObject = {};

    keys.forEach((obj, key) => {
      newObject[obj] = source[obj];
    });

    return newObject;
  }

  function savePersistStates() {
    chrome.storage.local.set({'@@vwe-persistence': JSON.stringify(filterObject(store.state, options.persistentStates))}, function() {});
  }

  return function(str) {
    // Make store global
    store = str;

    // Get type of script and initialize connection
    chrome.runtime.getBackgroundPage(function(backgroundPage) {
      isBackground = window === backgroundPage;

      if (isBackground) {
        // Restore persistent states on background store
        if (options.persistentStates.length)
        {
          chrome.storage.local.get('@@vwe-persistence', function(data) {
            if (data['@@vwe-persistence']) {
              var savedStores = filterObject(JSON.parse(data['@@vwe-persistence']), options.persistentStates);
              store.replaceState({...store.state, ...savedStores});
            }
          });

          store.subscribe((mutation) => {
            savePersistStates();
          });
        }

        chrome.runtime.onConnect.addListener(handleConnection);
      } else {
        // Init connection with the background
        const connection = chrome.runtime.connect({ name: options.connectionName });

        connection.onMessage.addListener(handleMessage);
        hookMutations(connection);
      }
    });
  };
}