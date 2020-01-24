<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  methods: {
    ...mapActions(['setToken', 'getUserData']),
  },
  created() {
    this.$store.dispatch('setToken', this.$cookie.get('token'))
      .then(() => {
        this.$store.dispatch('getUserData')
          .catch(() => {
            this.$router.push({ name: 'landing' });
          });
      });
  },
};
</script>
