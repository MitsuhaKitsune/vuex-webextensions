import { CONNECTION_NAME, INITIAL_STATE, SYNC_MUTATION } from './constants';

let store, receivedMutation;

function handleMessage(msg) {

  if (msg.type == INITIAL_STATE) {
    store.replaceState(msg.data);
  } else if (msg.type == SYNC_MUTATION) {
    receivedMutation = true;
    store.commit(msg.data.type, msg.data.payload);
  }
}

export default function getSharedStore(str) {

  if (typeof str !== 'object') {
    throw new Error(`Wrong type of vuex store, are you sure that you use store instance?`);
  }

  store = str;

  // Init connection with the background
  connection = chrome.runtime.connect({name: CONNECTION_NAME});
  connection.onMessage.addListener(handleMessage);

  // Watch for mutation changes
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

  connection.onDisconnect.addListener(() => {
    unsubscribe();
  });

  return store;
}
