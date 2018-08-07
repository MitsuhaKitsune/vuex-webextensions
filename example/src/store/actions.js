import * as types from './mutation-types';

export const setName = ({ commit }, payload) => {
  commit(types.UPDATE_NAME, payload);
};

export const incrementCounter = ({ commit }) => {
  commit('incrementCounter');
};

export const decrementCounter = ({ commit }) => {
  commit('decrementCounter');
};
