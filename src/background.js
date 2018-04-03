import { CONNECTION_NAME, INITIAL_STATE, SYNC_MUTATION } from './constants';

let store, receivedMutation;

function handleMessage(msg, sender, callback) {

  if (msg.type == SYNC_MUTATION) {
    receivedMutation = true;
    store.commit(msg.data.type, msg.data.payload);
  }
}

function handleConnection(connection) {

  if (connection.name !== CONNECTION_NAME) {
    return;
  }

  // Send current state on connect
  connection.postMessage({
    type: INITIAL_STATE,
    data: store.state
  });

  connection.onMessage.addListener(handleMessage);

  // Sync mutations on change with other parts of extension
  const unsubscribe = store.subscribe((mutation) => {
    if (!receivedMutation) {
      connection.postMessage({
        type: SYNC_MUTATION,
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

export default function setSharedStore(str) {

  if (typeof str !== 'object') {
    throw new Error(`Wrong type of vuex store, are you sure that you use store instance?`);
  }

  store = str;

  // Initialize connection with other webextension parts
  chrome.runtime.onConnect.addListener(handleConnection);

  return store;
}
