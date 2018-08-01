import Vue from 'vue';
import Vuex from 'vuex';
import VuexWebExtensions from '../../../src';

console.log(VuexWebExtensions);

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    foo: 'bar',
    timer: 0,
  },
  getters,
  mutations,
  actions,
  plugins: [VuexWebExtensions()],
});
