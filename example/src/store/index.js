import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from '../../../src';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    timer: 0,
    name: 'Mitsuha',
    counter: 0,
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
