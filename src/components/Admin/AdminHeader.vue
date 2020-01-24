<template>
  <header class="home bg-gray-200 mb-4 py-2">
    <div class="container mx-auto flex justify-between items-center h-16">
      <div class="header-links mx-auto flex justify-between items-center">
        <div class="mr-8">
          <router-link :to="{ name: 'home' }" class="bg-green-800 text-green-100 hover:bg-green-700 hover:text-green-100 text-sm py-3 px-4">Home Page</router-link>
        </div>
        <div class="flex justify-space items-center text-sm font-medium text-gray-800">
          <button @click="changeActiveLink('books')" :class="activeLink === 'books' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Books</button>
          <button @click="changeActiveLink('users')" :class="activeLink === 'users' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Users</button>
          <button @click="changeActiveLink('genres')" :class="activeLink === 'genres' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Genres</button>
          <button @click="changeActiveLink('authors')" :class="activeLink === 'authors' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Authors</button>
          <button @click="changeActiveLink('reviews')" :class="activeLink === 'reviews' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Reviews</button>
          <button @click="changeActiveLink('favorites')" :class="activeLink === 'favorites' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Favorites</button>
          <button @click="changeActiveLink('likes')" :class="activeLink === 'likes' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Likes</button>
          <button @click="changeActiveLink('logs')" :class="activeLink === 'logs' ? 'bg-purple-800 text-purple-100 hover:bg-purple-700 hover:text-purple-100' : ''" class="p-4 mr-8 hover:text-black">Logs</button>
        </div>
        <div class="cursor-pointer bg-gray-800 text-gray-100 hover:bg-gray-700 hover:text-gray-100 text-sm py-2 px-4 flex flex-col justify-center items-center" @click="logOut">
          <span>Log Out</span>
          <span style="font-size: .6rem" class="mt-2 text-gray-200">@{{ getUser.username }}</span>
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
      activeLink: 'books',
    };
  },
  methods: {
    changeActiveLink(link) {
      this.$emit('headerLinkChanged', link);
      this.activeLink = link;
    },
    logOut() {
      this.$store.dispatch('logUserOut').then(() => {
        this.$router.go({ path: 'landing' });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  .container {
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Merriweather', serif;
    }

    .header-links {
      font-family: 'Roboto Slab', 'Merriweather', serif;
    }
  }
}

*:focus {
  outline: none;
}
</style>
