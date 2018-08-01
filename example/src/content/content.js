import Vue from 'vue';
import Bar from './Bar';
import store from './../store';

var wrapper = document.createElement('div');
wrapper.id = 'vwe-bar';
document.body.prepend(wrapper);

/* eslint-disable no-new */
new Vue({
  el: '#vwe-bar',
  store,
  render: h => h(Bar),
});
