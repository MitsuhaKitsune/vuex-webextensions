import * as types from './mutation-types';

export default {
  [types.UPDATE_TIMER](state, payload) {
    state.timer = payload;
  },
  [types.UPDATE_NAME](state, payload) {
    state.name = payload;
  },
  [types.UPDATE_COUNTER](state, payload) {
    state.counter = payload;
  },
  incrementCounter(state) {
    state.counter++;
  },
  decrementCounter(state) {
    state.counter--;
  },
};
