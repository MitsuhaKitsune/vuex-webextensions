/* global chrome */

var constants = Object.freeze({
  CONNECTION_NAME: 'vuex-webext',
  INITIAL_STATE: '@@STORE_INITIAL_STATE',
  SYNC_MUTATION: '@@STORE_SYNC_MUTATION'
});

export default function() {
  var receivedMutation = false;
  var store = null;

  function handleBackgroundMessage(msg) {
    if (msg.type == constants.INITIAL_STATE) {
      store.replaceState(msg.data);
    } else if (msg.type == constants.SYNC_MUTATION) {
      receivedMutation = true;
      store.commit(msg.data.type, msg.data.payload);
    }
  }

  function handleMessage(msg) {
    if (msg.type == constants.SYNC_MUTATION) {
      receivedMutation = true;
      store.commit(msg.data.type, msg.data.payload);
    }
  }

  function handleConnection(connection) {
    if (connection.name !== constants.CONNECTION_NAME) {
      return;
    }

    // Send current state on connect
    connection.postMessage({
      type: constants.INITIAL_STATE,
      data: store.state
    });

    connection.onMessage.addListener(handleMessage);

    // Sync mutations on change with other parts of extension
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

    // Unsuscribe on disconnect
    connection.onDisconnect.addListener(() => {
      unsubscribe();
    });
  }

  return function(str) {
    // Make store global
    store = str;

    // Get type of script and initialize connection
    chrome.runtime.getBackgroundPage(function(backgroundPage) {

      const isBackground = window === backgroundPage;

      if (isBackground) {
        chrome.runtime.onConnect.addListener(handleConnection);
      } else {
        // Init connection with the background
        const connection = chrome.runtime.connect({ name: constants.CONNECTION_NAME });

        connection.onMessage.addListener(handleBackgroundMessage);

        // Watch for mutation changes
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
    });
  };
}