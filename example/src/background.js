import store from './store';

// Increase timer each second
setInterval(function() {
  store.commit('UPDATE_TIMER', store.state.timer + 1);
}, 1000);
