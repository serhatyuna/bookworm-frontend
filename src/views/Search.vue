<template>
  <div class="app-wrapper flex flex-col min-h-screen">
    <header-nav />
    <main class="flex-grow">
      <div class="container mx-auto mb-8">
        <h2 class="text-xl text-gray-800 text-center mt-3 mb-8">Results for "{{ $route.params.query }}"</h2>
        <p class="text-center" v-if="booksLoading">Loading...</p>
        <p class="text-center" v-else-if="booksError && booksErrorMessage">{{ booksErrorMessage }}</p>
        <p class="text-center" v-else-if="booksError && !booksErrorMessage">Couldn't fetch the data. Please refresh the page!</p>
        <div v-else class="flex flex-col items-center">
          <div class="mx-auto w-9/12 flex flex-wrap mt-6 justify-between">
            <p class="mx-auto" v-if="books.length === 0">Not found...</p>
            <div v-for="book in books" :key="'searched-book-' + book.id" class="w-36 xxl:w-56 mb-16">
            <div :style="`background-image: url('${book.cover}')`" class="book-bg w-36 h-56 xxl:w-56 xxl:h-72 bg-no-repeat bg-cover bg-center">
              <router-link :to="'/book/' + book.id" class="w-36 h-56 xxl:w-56 xxl:h-72 block"></router-link>
            </div>
            <router-link :to="'/book/' + book.id" class="book-title mt-6 mb-3 font-medium block">{{ book.title }}</router-link>
            <span class="text-xs text-gray-500">{{book.Author.firstName}}   {{book.Author.lastName}}</span>
          </div>
          </div>
        </div>
      </div>
    </main>
    <footer-bottom />
  </div>
</template>

<script>
import headerNav from '../components/Header.vue';
import footerBottom from '../components/Footer.vue';

export default {
  name: 'search',
  data() {
    return {
      books: [],
      booksLoading: true,
      booksError: false,
      booksErrorMessage: '',
    };
  },
  components: {
    'header-nav': headerNav,
    'footer-bottom': footerBottom,
  },
  methods: {
    searchBook(query) {
      this.$http.get(`books/search/${query}`)
        .then((response) => {
          this.books = response.data.books;
          this.booksLoading = false;
          this.booksError = false;
        })
        .catch((err) => {
          if (err && err.response) {
            this.booksErrorMessage = err.response.data.message;
          } else {
            this.booksErrorMessage = '';
          }
          this.booksLoading = false;
          this.booksError = true;
        });
    },
    reset() {
      this.books = {};
      this.booksLoading = true;
      this.booksError = false;
      this.booksErrorMessage = '';
    },
  },
  created() {
    this.searchBook(this.$route.params.query);
  },
  beforeRouteUpdate(to, from, next) {
    this.reset();
    this.searchBook(to.params.query);
    next();
  },
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  font-family: 'PT Sans', 'Open Sans', sans-serif;

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Merriweather', serif;
  }

  main {
    .book-bg {
      transition: opacity .15s ease-in-out;

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
