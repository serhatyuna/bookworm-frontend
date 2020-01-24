<template>
  <div class="app-wrapper flex flex-col min-h-screen">
    <header-nav />
    <main class="flex-grow">
      <div v-if="currentGenreID === -1" class="container mx-auto mb-8">
        <h2 class="text-base mb-4 uppercase tracking-widest text-gray-500 mb-8 mt-4 ml-4">ALL GENRES</h2>
        <p v-if="loading">Loading...</p>
        <p v-else-if="!loading && error">Couldn't fetch the data. Please refresh the page!</p>
        <div v-else class="flex flex-wrap justify-around items-center">
          <div v-for="(genre, index) in genres" :key="'genre-' + index" class="w-22/100 h-48 py-12 mb-8 shadow rounded-sm flex flex-col justify-around items-center">
            <h3>{{ genre.type }}</h3>
            <span v-if="genre.number_of_books <= 0" class="text-sm text-gray-600">(no book)</span>
            <span v-else-if="genre.number_of_books == 1" class="text-sm text-gray-600">({{ genre.number_of_books }} book)</span>
            <span v-else class="text-sm text-gray-600">({{ genre.number_of_books }} books)</span>
            <button @click="selectGenre(index)" v-if="genre.number_of_books > 0" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mt-4 rounded inline-flex items-center">
              <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span>View All Books</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="container mx-auto mb-8">
        <div class="flex items-center mt-4">
          <div @click="goBackToSelection" class="cursor-pointer flex justify-center items-center">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </div>
          <h2 class="text-base uppercase tracking-widest text-gray-500 ml-6">{{ selectedGenreType }} BOOKS</h2>
        </div>
        <p v-if="bookFetchLoading">Loading...</p>
        <p v-else-if="!bookFetchLoading && bookFetchError">Couldn't fetch the data. Please refresh the page!</p>
        <div v-else class="flex flex-wrap justify-around items-center">
          <div v-for="(book, index) in booksOfCurrentGenre" :key="'bookOfGenre' + index" class="w-22/100 mt-16">
            <div :style="`background-image: url('${book.cover}')`" class="book-bg w-56 h-72 bg-no-repeat bg-cover bg-center">
              <router-link :to="'/book/' + book.id" class="w-56 h-72 block"></router-link>
            </div>
            <router-link :to="'/book/' + book.id" class="book-title mt-6 mb-3 font-medium block">{{ book.title }}</router-link>
            <span class="text-xs text-gray-500">{{book.Author.firstName}} {{book.Author.lastName}}</span>
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
  name: 'genres',
  data() {
    return {
      genres: [],
      booksOfCurrentGenre: {},
      currentGenreID: -1,
      loading: true,
      error: false,
      bookFetchLoading: true,
      bookFetchError: false,
    };
  },
  computed: {
    selectedGenreType() {
      const genre = this.genres.filter(g => g.id === this.currentGenreID);
      return genre[0].type;
    },
  },
  components: {
    'header-nav': headerNav,
    'footer-bottom': footerBottom,
  },
  methods: {
    selectGenre(index) {
      this.currentGenreID = this.genres[index].id;
      this.$http.get(`genres/${this.currentGenreID}/books`)
        .then((response) => {
          this.booksOfCurrentGenre = response.data.books;
          this.bookFetchLoading = false;
        })
        .catch(() => {
          this.bookFetchError = true;
        });
    },
    goBackToSelection() {
      this.booksOfCurrentGenre = {};
      this.currentGenreID = -1;
    },
  },
  created() {
    this.$http.get('genres')
      .then((response) => {
        this.genres = response.data.genres;
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
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
      box-shadow:
        -3.3px 3.3px 0.6px -0 rgba(0, 0, 0, 0.056),
        -4.6px 4.6px 1.4px -0 rgba(0, 0, 0, 0.081),
        -5.3px 5.3px 2.6px -0 rgba(0, 0, 0, 0.1),
        -6px 6px 4.7px -0 rgba(0, 0, 0, 0.119),
        -7.2px 7.2px 8.8px -0 rgba(0, 0, 0, 0.144),
        -11px 11px 21px -0 rgba(0, 0, 0, 0.2);

      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
