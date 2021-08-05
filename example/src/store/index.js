import { createStore } from 'vuex';
import VuexWebExtensions from '../../../src';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

export default createStore({
  state() {
    return {
      count: 0,
    };
  },
  getters,
  mutations,
  actions,
  plugins: [
    VuexWebExtensions({
      persistentStates: ['name', 'counter'],
      loggerLevel: 'verbose',
    }),
  ],
});
