<template>
  <header class="home bg-gray-200 mb-4 py-2">
    <div class="container mx-auto flex justify-between items-center h-16">
      <div class="flex justify-between items-center">
        <div class="logo">
          <h1 class="text-3xl">
            <router-link :to="{ name: 'home' }"><span class="font-bold">book</span>worm</router-link>
          </h1>
        </div>
        <div class="search-bar relative ml-6">
          <input v-model="query" @keyup.enter="search" type="text" class="pl-3 pr-10 py-3 w-96 shadow-md text-sm" placeholder="Find your next book...">
          <div @click="search" class="w-8 h-8 cursor-pointer absolute">
            <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>
      <div class="header-links flex justify-between items-center relative">
        <div class="flex justify-space items-center text-sm font-medium text-gray-800">
          <router-link :to="{ name: 'genres' }" class="mr-8 hover:text-black">Genres</router-link>
          <router-link :to="{ name: 'authors' }" class="mr-8 hover:text-black">Authors</router-link>
        </div>
        <div class="w-12 h-12 cursor-pointer" @click="toggleDropdown" >
          <img class="w-12 h-12" :src="'https://avatars.dicebear.com/v2/gridy/' + getUser.username + '.svg'" :alt="getUser.firstName + ' ' + getUser.lastName">
        </div>
        <div :class="clickedAvatar ? 'block': 'hidden'" class="dropdown absolute text-xs text-right">
            <router-link v-if="getUser.username" @click.native="clickedAvatar = false" :to="{ name: 'profile', params: { username: getUser.username } }" class="block w-full cursor-pointer bg-gray-800 text-gray-100 hover:bg-gray-400 hover:text-gray-900 p-4">My Profile</router-link>
            <div class="w-full cursor-pointer bg-gray-800 text-gray-100 hover:bg-gray-400 hover:text-gray-900 p-4" @click="logOut">Log Out</div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'header-nav',
  computed: {
    ...mapGetters(['getUser']),
  },
  data() {
    return {
      clickedAvatar: false,
      query: '',
    };
  },
  methods: {
    search() {
      this.query = this.query.trim();
      if (this.query && this.query.length > 1) {
        this.clickedAvatar = false;
        this.$router.push({ name: 'search', params: { query: this.query } });
      }
    },
    toggleDropdown() {
      this.clickedAvatar = !this.clickedAvatar;
      if (this.clickedAvatar) {
        this.$nextTick(() => {
          this.$refs.dropdownMenu.$el.focus();
        });
      }
    },
    logOut() {
      this.$store.dispatch('logUserOut').then(() => {
        this.$router.go({ path: 'landing' });
      });
    },
  },
};
</script>

<style lang="scss">
.home {
  .container {
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Merriweather', serif;
    }

    .header-links {
      font-family: 'Roboto Slab', 'Merriweather', serif;
    }

    .dropdown {
      font-family: 'PT Sans', 'Open Sans', sans-serif;
      top: 50px;
      right: 0px;
      border-radius: 3px;

      div {
        transition: all .15s ease-in-out;
      }
    }

    .search-bar {
      div {
        right: 0px;
        top: 10px;
      }
    }
  }
}
</style>
