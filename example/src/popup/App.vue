<template>
  <div>
    <div id="vwe-popup-header">
      <div id="vwe-icon"></div>
      <div><h4>Vuex WebExtensions popup script example</h4></div>
    </div>
    <div>Timer: {{ this.timer }}</div>
    <div>Name: <input type="text" :value="name" @input="updateName" /></div>
    <div>Counter: {{ this.counter }} <button v-on:click="decrementCounter">-</button><button v-on:click="incrementCounter">+</button></div>
    <p>Timer aren't persistent by default and it's handled by background script increasing the value each second.</p>
    <p>Name and counter are persistent and handle data entered by user on any part of the webextension.</p>
    <p>
      To test injected content scripts go to any <a href="https://github.com/MitsuhaKitsune/vuex-webextensions">GitHub url</a> and check the bar injected on the top of the page.
    </p>
    <p>Created by <a href="https://mitsuhakitsune.com/">Mitsuha Kitsune</a></p>
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

    updateName(e) {
      this.$store.commit('UPDATE_NAME', e.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  font-size: 12px;
}

#vwe-popup-header div {
  display: inline-block;
  line-height: 40px;
  height: 40px;
}

#vwe-icon {
  height: 40px;
  width: 40px;
  background-image: url(../icons/icon_48.png);
  background-size: 35px 35px;
  background-position: center;
  background-repeat: no-repeat;
  margin-right: 5px;
}
</style>
