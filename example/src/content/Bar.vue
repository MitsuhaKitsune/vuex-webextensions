<template>
  <div id="vwe-bar">
    <div id="vwe-icon"></div>
    <div><h4>Vuex WebExtensions injected content script example</h4></div>
    <div id="vwe-bar-right">
      <div>Timer: {{ this.timer }}</div>
      <div>Name: <input type="text" name="name" v-model="name"></div>
      <div>Counter: {{ this.counter }} <button v-on:click="decrementCounter">-</button><button v-on:click="incrementCounter">+</button></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },

  computed: mapState(['timer', 'name', 'counter']),

  methods: {
    ...mapActions(['incrementCounter', 'decrementCounter']),
  },
};
</script>

<style>
@import './content.css';
</style>
