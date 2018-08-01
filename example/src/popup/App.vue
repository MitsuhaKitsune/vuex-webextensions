<template>
  <div>
    <p>{{ this.timer }}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {};
  },

  computed: mapState(['timer']),
};
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>
